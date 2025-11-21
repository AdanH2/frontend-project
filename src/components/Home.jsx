import { useEffect, useState } from "react";
import {
  getSeasonLeaders,
  getPlayerById,
  getTeamById,
  getPlayersByTeam,
  getTeams,
} from "../api/sportsradarClient";
import Filters from "./Filters";
import HRLeaders from "./views/HRLeaders";
import AVGLeaders from "./views/AVGLeaders";
import ERALeaders from "./views/ERALeaders";
import PlayerBio from "./views/PlayerBio";
import PlayerPerformance from "./views/PlayerPerformance";
import PlayerStats from "./views/PlayerStats";
import TeamBio from "./views/TeamBio";
import TeamPlayers from "./views/TeamPlayers";
import TeamPerformance from "./views/TeamPerformance";

export default function Home() {
  const [season, setSeason] = useState("2025");
  const [playerId, setPlayerId] = useState(null);
  const [teamId, setTeamId] = useState(null);

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let mounted = true;
    getTeams()
      .then((data) => {
        if (!mounted) return;
        setTeams(data?.teams ?? []);
      })
      .catch((err) => {
        console.error(err);
        setTeams([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Enforce mutual exclusivity: if player selected, disable team; if team selected, disable player
  useEffect(() => {
    if (playerId) setTeamId(null);
  }, [playerId]);

  useEffect(() => {
    if (teamId) setPlayerId(null);
  }, [teamId]);

  const isPlayerMode = !!playerId;
  const isTeamMode = !!teamId;

  return (
    <div className="page home-page">
      <h2>Welcome to the MLB Stats Dashboard</h2>
      <p>
        Explore leaders, players, and team performance for the selected season.
      </p>

      <Filters
        teams={teams}
        season={season}
        playerId={playerId}
        teamId={teamId}
        onSeasonChange={setSeason}
        onPlayerChange={(id) => setPlayerId(id || null)}
        onTeamChange={(id) => setTeamId(id || null)}
      />

      <div className="views">
        {!isPlayerMode && !isTeamMode && (
          <>
            <HRLeaders season={season} getSeasonLeaders={getSeasonLeaders} />
            <AVGLeaders season={season} getSeasonLeaders={getSeasonLeaders} />
            <ERALeaders season={season} getSeasonLeaders={getSeasonLeaders} />
          </>
        )}

        {isPlayerMode && (
          <>
            <PlayerBio
              playerId={playerId}
              getPlayerById={getPlayerById}
              season={season}
            />
            <PlayerPerformance
              playerId={playerId}
              getPlayerById={getPlayerById}
            />
            <PlayerStats
              playerId={playerId}
              getPlayerById={getPlayerById}
              season={season}
            />
          </>
        )}

        {isTeamMode && (
          <>
            <TeamBio teamId={teamId} getTeamById={getTeamById} />
            <TeamPlayers teamId={teamId} getPlayersByTeam={getPlayersByTeam} />
            <TeamPerformance
              teamId={teamId}
              getTeamById={getTeamById}
              season={season}
            />
          </>
        )}
      </div>
    </div>
  );
}
