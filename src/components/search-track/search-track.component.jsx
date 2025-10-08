import { useState, useEffect } from "react";
import "./search-track.styles.scss";
import { getTrackInfo } from "../../utils/lastfm.component";

const SearchTrack = ({ onSearch }) => {
  const [track, setTrack] = useState("");
  const [trackSuggestions, setTrackSuggestions] = useState([]);

  useEffect(() => {
    if (track.length < 2) {
      setTrackSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
            track
          )}&api_key=${process.env.REACT_APP_LASTFM_API_KEY}&format=json`
        );
        const data = await res.json();
        const suggestions = data?.results?.trackmatches?.track || [];
        setTrackSuggestions(suggestions.slice(0, 10));
      } catch (err) {
        console.error("Error fetching track suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [track]);

  const selectTrack = async (name, artistName) => {
    setTrack("");
    setTrackSuggestions([]);

    try {
      const info = await getTrackInfo(artistName, name);
      const confirmedArtist = info?.track?.artist?.name || artistName;
      onSearch(confirmedArtist, name);
    } catch (err) {
      console.error("Error getting track info:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!track) return alert("Please enter a track name");

    setTrackSuggestions([]);

    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
          track
        )}&api_key=${process.env.REACT_APP_LASTFM_API_KEY}&format=json`
      );
      const data = await res.json();
      const firstMatch = data?.results?.trackmatches?.track?.[0];
      if (!firstMatch) return alert("Track not found");

      const info = await getTrackInfo(firstMatch.artist, firstMatch.name);
      const confirmedArtist = info?.track?.artist?.name || firstMatch.artist;

      onSearch(confirmedArtist, firstMatch.name);
    } catch (err) {
      console.error("Error searching track:", err);
    }
  };

  return (
    <div className="search-track-container">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="input-with-suggestions">
          <input
            type="text"
            placeholder="Enter track name"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
          />
          {trackSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {trackSuggestions.map((s, i) => (
                <li key={i} onClick={() => selectTrack(s.name, s.artist)}>
                  {s.name} <span className="artist-name">by {s.artist}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Search</button>
      </form>
      <p className="search-track-container-title">
        Write the name of the track
      </p>
    </div>
  );
};

export default SearchTrack;
