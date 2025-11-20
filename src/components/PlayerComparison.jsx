import React, { useState } from "react";
import { getPlayerProfile } from "../api/sportsradarClient";

// Hardcoded players with real Sportradar IDs
const PLAYERS = [
  {
    id: "80de60c9-74e3-4a50-b128-b3dc7456a254", // Shohei Ohtani
    name: "Shohei Ohtani",
  },
  {
    id: "insert-real-id-for-aaron-judge",
    name: "Aaron Judge",
  },
  {
    id: "insert-real-id-for-mookie-betts",
    name: "Mookie Betts",
  },
];

export default function PlayerComparison() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Helper to extract stats
  const getPlayerStats = (data) => {
    const player = data?.player;
    const season = player?.seasons?.[0]?.totals?.statistics;
    if (!season) return { avg: "—", hr: "—", era: "—", k9: "—" };

    const hitting = season.hitting?.overall;
    if (hitting) {
      return {
        avg: hitting.avg ?? "—",
        hr: hitting.onbase?.hr ?? "—",
      };
    }

    const pitching = season.pitching?.overall;
    if (pitching) {
      return {
        avg: "—",
        hr: "—",
        era: pitching.era ?? "—",
        k9: pitching.k9 ?? "—",
      };
    }

    return { avg: "—", hr: "—" };
  };

  // Fetch player data by ID
  const handleSelect = async (id, setPlayer, setLoading) => {
    if (!id) return setPlayer(null);
    setLoading(true);
    try {
      const profile = await getPlayerProfile(id);
      setPlayer(profile);
    } catch (err) {
      console.error(err);
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", minHeight: "100vh", padding: "40px" }}>
      <h1 className="page-title">Player Comparison</h1>

      {/* SELECTORS */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        {/* Player 1 Selector */}
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: "bold" }}>Select Player 1:</label>
          <select
            className="form-select mt-2"
            onChange={(e) =>
              handleSelect(e.target.value, setPlayer1, setLoading1)
            }
          >
            <option value="">-- choose player --</option>
            {PLAYERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Player 2 Selector */}
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: "bold" }}>Select Player 2:</label>
          <select
            className="form-select mt-2"
            onChange={(e) =>
              handleSelect(e.target.value, setPlayer2, setLoading2)
            }
          >
            <option value="">-- choose player --</option>
            {PLAYERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PLAYER CARDS */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "50px" }}>
        {[{ player: player1, loading: loading1, title: "Player 1" },
          { player: player2, loading: loading2, title: "Player 2" }].map(
          ({ player, loading, title }, i) => {
            const stats = getPlayerStats(player);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>{title}</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <p>Name: {player?.player?.full_name || "—"}</p>
                    <p>AVG: {stats.avg}</p>
                    <p>HR: {stats.hr}</p>
                    {stats.era && <p>ERA: {stats.era}</p>}
                    {stats.k9 && <p>K/9: {stats.k9}</p>}
                  </>
                )}
                {/* Image placeholder */}
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    background: "#e0e0e0",
                    borderRadius: "6px",
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                  }}
                />
              </div>
            );
          }
        )}
      </div>

      {/* GRAPH PLACEHOLDER */}
      <div
        style={{
          height: "300px",
          background: "#fafafa",
          border: "1px solid #ccc",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        Performance Comparison Over Time (Graph Placeholder)
      </div>
    </div>
  );
}
