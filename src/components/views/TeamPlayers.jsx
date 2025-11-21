import { useEffect, useState } from "react";

export default function TeamPlayers({ teamId, getPlayersByTeam }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!teamId) {
      setPlayers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getPlayersByTeam(teamId)
      .then((data) => {
        if (!mounted) return;
        setPlayers(data ?? []);
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
  }, [teamId, getPlayersByTeam]);

  return (
    <section className="view team-players">
      <h3>Team Roster</h3>
      {loading && <p>Loading roster...</p>}
      {error && <p>Error loading roster.</p>}
      {!loading && !error && (
        <div>
          {players.length === 0 && <p>No players available.</p>}
          <ul>
            {players.map((p, idx) => (
              <li key={p.id ?? idx}>
                {p.full_name} - {p.primary_position}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
