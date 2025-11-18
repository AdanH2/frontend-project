import { useEffect, useState } from "react";
import { getTeams } from "../api/sportsradarClient";

export default function Home() {
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTeams()
      .then((data) => {
        if (!mounted) return;
        // The Sportradar response typically includes a `teams` array
        setTeams(data?.teams ?? []);
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
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page home-page">
      <h2>Home</h2>
      {loading && <p>Loading teams...</p>}
      {error && <p>Error loading teams.</p>}
      {!loading && !error && (
        <div>
          {teams.length === 0 && <p>No team data available.</p>}
          <ul>
            {teams.map((t) => (
              <li key={t?.id}>
                {t?.market ? `${t.market} ${t.name}` : t?.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
