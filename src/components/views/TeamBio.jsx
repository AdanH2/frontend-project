import { useEffect, useState } from "react";

export default function TeamBio({ teamId, getTeamById }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getTeamById(teamId)
      .then((data) => {
        if (!mounted) return;
        setTeam(data?.team ?? data ?? null);
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
  }, [teamId, getTeamById]);

  return (
    <section className="view team-bio">
      <h3>Team Profile</h3>
      {loading && <p>Loading team...</p>}
      {error && <p>Error loading team data.</p>}
      {!loading && !error && (
        <div>
          {!team && <p>No team selected.</p>}
          {team && (
            <div>
              <p>
                <strong>
                  {team.market} {team.name}
                </strong>
                <hr />
                Bio: The {team.market} {team.name} are a professional baseball
                team based in {team.venue.city}, {team.venue.state}. They play
                their home games at {team.venue.name}, which has a seating
                capacity of {team.venue.capacity}. The team is part of the MLB
                and competes in the {team.league.name}, {team.division.name}.
                They were fouded in {team.founded}, and have won{" "}
                {team.championships_won}{" "}
                {team.championships_won === 1
                  ? "championship"
                  : "championships"}{" "}
                to date. Their mascot is {team.mascot ?? "N/A"} and their fight song is {team.fight_song ?? "N/A"}.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
