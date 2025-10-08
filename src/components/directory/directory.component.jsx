import { useState, useContext } from "react";
import { getTrackInfo, getArtistInfo } from "../../utils/lastfm.component";
import getWikiImage from "../../utils/wiki.component";
import SearchTrack from "../search-track/search-track.component";
import SearchResults from "../search-results/search-results.component";
import { SearchContext } from "../../contexts/search.context";
import "./../search-track/search-track.styles.scss";
import "./directory.styles.scss";
import fetchWithTimeout from "../../utils/fetchWithTimeout.component";
import normalizeTag from "../../utils/normalizeTags.component";

const Directory = ({ setPastSearches }) => {
  const [songData, setSongData] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setPastSearches: setContextPastSearches } = useContext(SearchContext);
  const updateSearches = setPastSearches || setContextPastSearches;

  const handleSearch = async (artist, track) => {
    setLoading(true);
    setError(null);

    setSimilarTracks([]);
    setSimilarArtists([]);
    try {
      const data = await getTrackInfo(artist, track);
      if (!data.track) throw new Error("Track not found");
      console.log(data);
      setSongData(data.track);

      const artistInfo = await getArtistInfo(artist);
      if (!artistInfo) throw new Error("Artist not found");

      const similarArtistsWithImages = await Promise.all(
        (artistInfo.artist?.similar?.artist || []).map(async (a) => ({
          name: a.name,
          imageUrl: await getWikiImage(a.name),
        }))
      );
      setSimilarArtists(similarArtistsWithImages);

      const tags = data.track?.toptags?.tag || [];

      let detailedTracks = [];
      if (tags.length > 0) {
        const filteredTags = tags
          .map((tag) => normalizeTag(tag.name))
          .filter((t, idx, arr) => arr.indexOf(t) === idx) // remove duplicates
          .reverse();
        console.log(filteredTags);
        const tagTracks = await Promise.all(
          filteredTags.map(async (tag) => {
            const res = await fetchWithTimeout(
              `https://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${encodeURIComponent(
                tag
              )}&api_key=${process.env.REACT_APP_LASTFM_API_KEY}&format=json`,
              {},
              5000 // 5s timeout
            );
            const data = await res.json();
            return data.tracks?.track?.slice(0, 50) || [];
          })
        );
        console.log(tagTracks);
        const trackCounts = new Map();
        tagTracks.flat().forEach((t) => {
          const key = `${t.artist.name}-${t.name}`;
          if (!trackCounts.has(key))
            trackCounts.set(key, { track: t, count: 1 });
          else trackCounts.get(key).count += 1;
        });
        console.log(trackCounts);
        const tracksWithCounts = Array.from(trackCounts.values())
          .sort((a, b) => b.count - a.count)
          .filter(
            (t) => t.track.artist.name.toLowerCase() !== artist.toLowerCase()
          )
          .slice(0, 10);
        console.log(tracksWithCounts);
        detailedTracks = await Promise.all(
          tracksWithCounts.map(async ({ track, count }) => {
            try {
              const trackInfo = await getTrackInfo(
                track.artist.name,
                track.name
              );
              return { ...trackInfo.track, count };
            } catch {
              return { ...track, count };
            }
          })
        );

        setSimilarTracks(detailedTracks);
      }

      updateSearches?.((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: data.track.name,
          artist: data.track.artist.name,
          imageUrl: data.track.album?.image?.[3]?.["#text"] || "",
          similarTracks: detailedTracks.map((t) => ({
            name: t.name,
            artist: t.artist?.name,
            imageUrl: t.album?.image?.[3]?.["#text"] || "",
          })),
          similarArtists: similarArtistsWithImages,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="directory-container">
      <SearchTrack onSearch={handleSearch} />

      {loading && <div className="spinner"></div>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && songData && (
        <SearchResults
          songData={songData}
          similarTracks={similarTracks}
          similarArtists={similarArtists}
        />
      )}
    </div>
  );
};

export default Directory;
