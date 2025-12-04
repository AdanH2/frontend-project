import { useEffect, useState } from "react";
import {
  getSeasonLeaders,
  getPlayerProfile,
  getTeamProfile,
  getPlayersByTeam,
  getTeams,
} from "../api/sportsradarClient";
import Filters from "./Filters";
import HRLeaders from "./views/HRLeaders";
import AVGLeaders from "./views/AVGLeaders";
import ERALeaders from "./views/ERALeaders";
import PlayerBio from "./views/PlayerBio";
import PlayerPerformance from "./views/PlayerPerformance";
import TeamBio from "./views/TeamBio";
import TeamPlayers from "./views/TeamPlayers";

export default function Home() {
  const [season, setSeason] = useState("2025");
  const [playerId, setPlayerId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [playerNameMap, setPlayerNameMap] = useState({});

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
    fetch("/playerNameToId.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((m) => {
        if (!mounted) return;
        setPlayerNameMap(m ?? {});
      })
      .catch(() => {
        if (!mounted) return;
        setPlayerNameMap({});
      });
    return () => {
      mounted = false;
    };
  }, []);

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
        playerNameMap={playerNameMap}
        teamId={teamId}
        onSeasonChange={setSeason}
        onPlayerChange={(id) => {
          setPlayerId(id || null);
          setTeamId(null);
        }}
        onTeamChange={(id) => {
          setTeamId(id || null);
          setPlayerId(null);
        }}
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
              getPlayerProfile={getPlayerProfile}
              season={season}
            />
            <PlayerPerformance
              playerId={playerId}
              getPlayerProfile={getPlayerProfile}
            />
          </>
        )}

        {isTeamMode && (
          <>
            <TeamBio teamId={teamId} getTeamProfile={getTeamProfile} />
            <TeamPlayers teamId={teamId} getPlayersByTeam={getPlayersByTeam} />
          </>
        )}
      </div>
    </div>
  );
}
