export default function Filters({
  teams = [],
  season,
  playerId,
  teamId,
  onSeasonChange,
  onPlayerChange,
  onTeamChange,
}) {
  return (
    <div className="filters" style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>
        Season:
        <select
          value={season}
          onChange={(e) => onSeasonChange(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </label>

      <label style={{ marginLeft: 16 }}>
        Player:
        <input
          type="text"
          placeholder="Enter player id"
          value={playerId ?? ""}
          onChange={(e) => onPlayerChange(e.target.value || null)}
          style={{ marginLeft: 8 }}
          disabled={!!teamId}
        />
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
    </div>
  );
}
