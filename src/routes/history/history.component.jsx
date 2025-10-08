import "./history.styles.scss";
import { useContext } from "react";
import { SearchContext } from "../../contexts/search.context";

const History = ({ pastSearches }) => {
  const { pastSearches: contextPastSearches, setPastSearches } =
    useContext(SearchContext);

  const searches =
    typeof pastSearches === "undefined" ? contextPastSearches : pastSearches;

  const handleClearHistory = () => {
    setPastSearches([]);
    localStorage.removeItem("pastSearches");
  };

  return (
    <div className="history-container">
      <h3>Past searches</h3>

      <div className="history-grid">
        {[...searches].reverse().map((item) => (
          <div key={item.id} className="history-item">
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
            <p>
              {item.name} – {item.artist}
            </p>
            Similar songs:
            {item.similarTracks?.length > 0 && (
              <div className="tags">
                {item.similarTracks.map((t, idx) => (
                  <span key={idx} className="tag">
                    {t.imageUrl && (
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "4px",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    {t.name}
                  </span>
                ))}
              </div>
            )}
            Similar artists:
            {item.similarArtists?.length > 0 && (
              <div className="artists">
                {item.similarArtists.map((t, idb) => (
                  <span key={idb} className="artist">
                    {t.imageUrl && (
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "4px",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    {t.name}
                  </span>
                ))}
              </div>
            )}
            <br /> <br />
          </div>
        ))}
      </div>
      <button onClick={handleClearHistory} className="clear-history-btn">
        Clear History
      </button>
    </div>
  );
};
export default History;
