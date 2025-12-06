import { useEffect, useState } from "react";

export default function PlayerBio({ playerId, getPlayerProfile, season }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!playerId) {
      setPlayer(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getPlayerProfile(playerId)
      .then((data) => {
        if (!mounted) return;
        setPlayer(data?.player ?? null);
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
  }, [playerId, getPlayerProfile]);

  return (
    <section className="view player-bio">
      <h3>Player Profile</h3>
      {loading && <p>Loading player...</p>}
      {error && <p>Error loading player data.</p>}
      {!loading && !error && (
        <div>
          {!player && <p>No player selected or no profile available.</p>}
          {player && (
            <div>
              <p>
                <strong>{player.full_name}</strong>
              </p>
              <p>Position: {player.primary_position}</p>
              <p>Birthdate: {player.birthdate}</p>
              <p>
                Height/Weight: {Math.floor(player.height / 12)}'{player.height % 12}" / {player.weight} lbs
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
