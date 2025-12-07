import { useState, useEffect } from "react";
import { getGamesForADate } from "../../api/sportsradarClient";
import Modal from "./Modal";

export default function GameCard({ date }) {
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!date) {
      setGames(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getGamesForADate(date)
      .then((data) => {
        if (!mounted) return;
        setGames(data.league.games ?? []);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, [date, getGamesForADate]);

  function formatDisplayDate(input) {
    if (!input) return "";
    // accept YYYY/MM/DD or YYYY-MM-DD
    const parts = String(input)
      .split(/[-\/]/)
      .map((p) => Number(p));
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return input;
    const [y, m, d] = parts;
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="game-card">
      <style>{`@keyframes pulse {0%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.35}100%{transform:scale(1);opacity:1}} .live-dot{position:absolute;bottom:12px;right:12px;width:10px;height:10px;border-radius:50%;background:red;box-shadow:0 0 8px rgba(255,0,0,0.7);animation:pulse 1s infinite;} .closed-dot{position:absolute;bottom:12px;right:12px;width:10px;height:10px;border-radius:50%;background:#444;box-shadow:none;opacity:0.9;}`}</style>
      {loading && <p>Loading game...</p>}
      {error && <p>Error loading game data.</p>}
      {!loading && !error && (
        <div>
          {!games && <p>No game selected or no data available.</p>}
          {Array.isArray(games) && games.length === 0 && date && (
            <p>There are no games for the selected date.</p>
          )}
          {Array.isArray(games) && games.length > 0 && date && (
            <>
              <h3 className="mb-6 text-xl font-semibold text-gray-700 mb-4">Games on {formatDisplayDate(date)}:</h3>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                {games.map((game) => {
                  const status = (game.game && game.game.status) || "";
                  const low = String(status).toLowerCase();
                  const isLive = low === "live";
                  const isClosed = low === "closed";
                  return (
                    <li
                      key={game.game.id}
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        background: "#041e42ac",
                        color: "white",
                        padding: 25,
                        borderRadius: 20,
                        width: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onClick={() => setSelectedGame(game)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          fontWeight: "bold",
                        }}
                      >
                        <span>{game.game.home.abbr}</span>
                        <span>{game.game.home.runs}</span>
                      </div>
                      <br />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          fontWeight: "bold",
                        }}
                      >
                        <span>{game.game.away.abbr}</span>
                        <span>{game.game.away.runs}</span>
                      </div>
                      {isLive && (
                        <div className="live-dot" aria-hidden="true" />
                      )}
                      {isClosed && (
                        <div
                          className="closed-dot"
                          aria-hidden="true"
                          title="Closed"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {selectedGame && (
            <Modal
              game={selectedGame}
              onClose={() => setSelectedGame(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
