import { useEffect } from "react";

export default function GameModal({ game, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose && onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!game) return null;

  const g = game.game || {};
  const home = g.home ?? {};
  const away = g.away ?? {};

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      <div
        style={{
          width: 680,
          maxWidth: "95%",
          background: "white",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>
            {away.abbr ?? away.name ?? "Away"} @{" "}
            {home.abbr ?? home.name ?? "Home"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
          <div style={{ flex: 1, textAlign: "left" }}>
            <p style={{ margin: "6px 0" }}>
              <strong>Status:</strong> {g.status ?? "—"}
            </p>
            <p style={{ margin: "6px 0" }}>
              <strong>Venue:</strong> {g.venue?.name ?? "—"}
            </p>
            {/* <p style={{ margin: "6px 0" }}>
              <strong>Scheduled:</strong> {g.scheduled ?? "—"}
            </p> */}
          </div>

          <div style={{ width: 240 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Away</div>
                <div style={{ fontWeight: "bold" }}>{away.name}</div>
                <div>Runs: {away.runs ?? "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Home</div>
                <div style={{ fontWeight: "bold" }}>{home.name}</div>
                <div>Runs: {home.runs ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <h4 style={{ margin: "6px 0" }}>Details</h4>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              maxHeight: 240,
              overflow: "auto",
              background: "#f6f6f6",
              padding: 8,
              borderRadius: 6,
            }}
          >
            <div>
              <h3>Weather</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 200 }}>
                <div>
                  <h4>Forecast</h4>
                  <p>Condition: {g.weather?.forecast?.condition ?? "—"}</p>
                  <p>Temperature: {g.weather?.forecast?.temp_f ?? "—"}°F</p>
                  <p>Cloud cover: {g.weather?.forecast?.cloud_cover ?? "—"}%</p>
                  <p>Humidity: {g.weather?.forecast?.humidity ?? "—"}%</p>
                  <p>
                    Wind: {g.weather?.forecast?.wind?.speed_mph ?? "—"}mph{" "}
                    {g.weather?.forecast?.wind?.direction ?? ""}
                  </p>
                </div>
                <div>
                  <h4>Actual</h4>
                  <p>
                    Condition: {g.weather?.current_conditions?.condition ?? "—"}
                  </p>
                  <p>
                    Temperature: {g.weather?.current_conditions?.temp_f ?? "—"}
                    °F
                  </p>
                  <p>
                    Cloud cover:{" "}
                    {g.weather?.current_conditions?.cloud_cover ?? "—"}%
                  </p>
                  <p>
                    Humidity: {g.weather?.current_conditions?.humidity ?? "—"}%
                  </p>
                  <p>
                    Wind:{" "}
                    {g.weather?.current_conditions?.wind?.speed_mph ?? "—"}
                    mph {g.weather?.current_conditions?.wind?.direction ?? ""}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3>Starting Pitchers</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 100 }}>
                <div>
                  <h4>Away</h4>
                  <p>
                    {home.starting_pitcher?.full_name ?? "—"} (#
                    {home.starting_pitcher?.jersey_number ?? "—"})
                  </p>
                  <p>Wins: {home.starting_pitcher?.win ?? "—"}</p>
                  <p>Losses: {home.starting_pitcher?.loss ?? "—"}</p>
                  <p>
                    ERA:{" "}
                    {home.starting_pitcher?.era
                      ? home.starting_pitcher.era.toFixed(2)
                      : "—"}
                  </p>
                </div>
                <p style={{display: "flex", alignItems: "center"}}>Vs.</p>
                <div>
                  <h4>Home</h4>
                  <p>
                    {away.starting_pitcher?.full_name ?? "—"} (#
                    {away.starting_pitcher?.jersey_number ?? "—"})
                  </p>
                  <p>Wins: {away.starting_pitcher?.win ?? "—"}</p>
                  <p>Losses: {away.starting_pitcher?.loss ?? "—"}</p>
                  <p>
                    ERA:{" "}
                    {away.starting_pitcher?.era
                      ? away.starting_pitcher.era.toFixed(2)
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
}
