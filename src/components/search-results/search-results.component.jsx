import "./../search-track/search-track.styles.scss";

const SearchResults = ({ songData, similarTracks, similarArtists }) => {
  return (
    <div className="search-results-container">
      {songData && (
        <div className="track-info">
          <h3>{songData.name}</h3>
          <p>Artist: {songData.artist.name}</p>
          {songData.album?.image?.[3]?.["#text"] && (
            <img src={songData.album.image[3]["#text"]} alt={songData.name} />
          )}
        </div>
      )}

      {similarTracks?.length > 0 && (
        <div className="similar-track">
          <h4>Similar Tracks:</h4>
          <ul>
            {similarTracks.map((t, idx) => (
              <li key={t?.name + t?.artist?.name + idx}>
                <p>
                  {t.name} –{" "}
                  {typeof t.artist === "string" ? t.artist : t.artist?.name}
                </p>
                {t.album?.image?.[3]?.["#text"] && (
                  <img src={t.album.image[3]["#text"]} alt={t.name} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {similarArtists?.length > 0 && (
        <div className="artists">
          <h4>Similar Artists:</h4>
          <ul>
            {similarArtists.map((t, idx) => (
              <li key={t.name + idx}>
                <p>{t.name}</p>
                {t.imageUrl && (
                  <img className="artist-image" src={t.imageUrl} alt={t.name} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
