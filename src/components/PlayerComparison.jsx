import React, { useState } from "react";

export default function PlayerComparison() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  // Temporary dummy players — REPLACE with API data
  const samplePlayers = [
    { id: 1, name: "Aaron Judge", avg: 0.289, hr: 37 },
    { id: 2, name: "Shohei Ohtani", avg: 0.304, hr: 44 },
    { id: 3, name: "Mookie Betts", avg: 0.280, hr: 29 },
  ];

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
              setPlayer1(samplePlayers.find((p) => p.id == e.target.value))
            }
          >
            <option value="">-- choose player --</option>
            {samplePlayers.map((p) => (
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
              setPlayer2(samplePlayers.find((p) => p.id == e.target.value))
            }
          >
            <option value="">-- choose player --</option>
            {samplePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PLAYER CARDS */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "50px" }}>
        
        {/* Player 1 Card */}
        <div
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
          <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>Player 1</h2>
          <p>Name: {player1?.name || "—"}</p>
          <p>AVG: {player1?.avg ?? "—"}</p>
          <p>HR: {player1?.hr ?? "—"}</p>

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

        {/* Player 2 Card */}
        <div
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
          <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>Player 2</h2>
          <p>Name: {player2?.name || "—"}</p>
          <p>AVG: {player2?.avg ?? "—"}</p>
          <p>HR: {player2?.hr ?? "—"}</p>

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
