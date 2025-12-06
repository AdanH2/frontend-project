import { useState, useEffect } from "react";

export default function Filters({
  teams = [],
  season,
  playerId,
  teamId,
  playerNameMap = {},
  onSeasonChange,
  onPlayerChange,
  onTeamChange,
}) {
  const [playerName, setPlayerName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!playerId) {
      setPlayerName("");
      return;
    }
    const found = Object.keys(playerNameMap).find(
      (k) => String(playerNameMap[k]) === String(playerId)
    );
    setPlayerName(found ?? "");
  }, [playerId, playerNameMap]);

  function onNameChange(v) {
    setPlayerName(v);
    if (!v) {
      setSuggestions([]);
      onPlayerChange(null);
      return;
    }
    const q = v.toLowerCase();
    const keys = Object.keys(playerNameMap || {});
    const matches = keys.filter((k) => k.toLowerCase().includes(q)).slice(0, 8);
    setSuggestions(matches);
  }

  function chooseName(name) {
    const id = playerNameMap?.[name] ?? null;
    setPlayerName(name);
    setSuggestions([]);
    onPlayerChange(id);
  }

  function onNameKey(e) {
    if (e.key === "Enter") {
      const exact = Object.keys(playerNameMap || {}).find(
        (k) => k.toLowerCase() === String(playerName).toLowerCase()
      );
      if (exact) {
        chooseName(exact);
      } else {
        onPlayerChange(null);
      }
    }
  }

  return (
    <div className="filters" style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>
        Season:
        <select
          value={season}
          onChange={(e) => onSeasonChange(e.target.value)}
          style={{ marginLeft: 8 }}
          disabled={!!playerId || !!teamId}
        >
          {Array.from({ length: 12 }, (_, i) => 2025 - i).map((yr) => (
            <option key={yr} value={String(yr)}>
              {yr}
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: 16, position: "relative" }}>
        Player:
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName ?? ""}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={onNameKey}
          style={{ marginLeft: 8 }}
          disabled={!!teamId}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              left: 56,
              top: "100%",
              background: "white",
              border: "1px solid #ddd",
              padding: 8,
              margin: 0,
              listStyle: "none",
              width: 130,
              maxHeight: 150,
              overflowY: "auto"
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  chooseName(s);
                }}
                style={{ padding: "4px 6px", cursor: "pointer" }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </label>

      <label style={{ marginLeft: 16 }}>
        Team:
        <select
          value={teamId ?? ""}
          onChange={(e) => onTeamChange(e.target.value || null)}
          style={{ marginLeft: 8 }}
          disabled={!!playerId}
        >
          <option value="">-- none --</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.market ? `${t.market} ${t.name}` : t.name}
            </option>
          ))}
        </select>
      </label>
      {(playerId || teamId) && (
        <button
          onClick={() => {
            setPlayerName("");
            setSuggestions([]);
            onPlayerChange(null);
            onTeamChange(null);
          }}
          style={{ marginLeft: 16 }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
