import { useEffect, useState } from "react";

export default function PlayerStats({ playerId, getPlayerProfile, season }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!playerId) {
      setStats(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getPlayerProfile(playerId)
      .then((data) => {
        if (!mounted) return;
        // Adjust to extract stats from the player data structure
        setStats(data?.stats ?? data?.player?.stats ?? null);
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
  }, [playerId, getPlayerProfile, season]);

  return (
    <section className="view player-stats">
      <h3>Player Stats {season ? `— ${season}` : ""}</h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading stats.</p>}
      {!loading && !error && (
        <div>
          {!stats && <p>No stats available for this player/season.</p>}
          {stats && (
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(stats, null, 2)}
            </pre>
          )}
        </div>
      )}
    </section>
  );
}
