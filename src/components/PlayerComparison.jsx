import React, { useEffect, useState } from "react";
import {
  getTeams,
  getTeamProfile,
  getPlayerProfile,
} from "../api/sportsradarClient";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PlayerComparison() {
  const [teams, setTeams] = useState([]);

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const [roster1, setRoster1] = useState([]);
  const [roster2, setRoster2] = useState([]);

  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [rosterError1, setRosterError1] = useState(false);
  const [rosterError2, setRosterError2] = useState(false);

  // Load MLB teams at startup
  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await getTeams();
        setTeams(data.teams || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadTeams();
  }, []);

  // Fetch roster for Team 1
  useEffect(() => {
    if (!team1) return setRoster1([]);

    async function loadRoster() {
      try {
        const data = await getTeamProfile(team1);
        const players = data.players || [];

        if (players.length === 0) setRosterError1(true);
        else setRosterError1(false);

        setRoster1(players);
      } catch (err) {
        console.error(err);
        setRoster1([]);
        setRosterError1(true);
      }
    }
    loadRoster();
  }, [team1]);

  // Fetch roster for Team 2
  useEffect(() => {
    if (!team2) return setRoster2([]);

    async function loadRoster() {
      try {
        const data = await getTeamProfile(team2);
        const players = data.players || [];

        if (players.length === 0) setRosterError2(true);
        else setRosterError2(false);

        setRoster2(players);
      } catch (err) {
        console.error(err);
        setRoster2([]);
        setRosterError2(true);
      }
    }
    loadRoster();
  }, [team2]);

  // Extract stats
  const getPlayerStats = (data) => {
    const player = data?.player;
    const seasonTotals = player?.seasons?.[0]?.totals?.statistics || {};
  
    const hitting = seasonTotals.hitting?.overall || {};
    const pitching = seasonTotals.pitching?.overall || {};
  
    return {
      avg: hitting.avg ?? "—",
      hr: hitting.onbase?.hr ?? "—",
      era: pitching.era ?? "—",
      k9: pitching.k9 ?? "—",
    };
  };
  
  

  // Fetch player profile when selected
  const handleSelect = async (playerId, setter, loaderSetter) => {
    if (!playerId) return setter(null);

    loaderSetter(true);
    try {
      const profile = await getPlayerProfile(playerId);
      setter(profile);
    } catch (err) {
      console.error(err);
      setter(null);
    } finally {
      loaderSetter(false);
    }
  };
  const buildComparisonData = () => {
    if (!player1 && !player2) return [];
  
    const s1 = player1 ? getPlayerStats(player1) : {};
    const s2 = player2 ? getPlayerStats(player2) : {};
  
    return [
      { stat: "AVG", p1: Number(s1.avg) || 0, p2: Number(s2.avg) || 0 },
      { stat: "HR",  p1: Number(s1.hr)  || 0, p2: Number(s2.hr)  || 0 },
      { stat: "ERA", p1: Number(s1.era) || 0, p2: Number(s2.era) || 0 },
      { stat: "K/9", p1: Number(s1.k9)  || 0, p2: Number(s2.k9)  || 0 },
    ];
  };

  return (
    <div style={{ background: "white", minHeight: "100vh", padding: "40px" }}>
      <h1 className="page-title">Player Comparison</h1>

      {/* SELECTORS */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>

        {/* TEAM 1 + PLAYER 1 (side-by-side spacing) */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label>Team 1: </label>
              <select
                className="form-select mt-2"
                value={team1}
                onChange={(e) => {
                  setTeam1(e.target.value);
                  setPlayer1(null);
                }}
              >
                <option value="">-- Select Team --</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>Player 1: </label>
              <select
                className="form-select mt-2"
                onChange={(e) =>
                  handleSelect(e.target.value, setPlayer1, setLoading1)
                }
              >
                <option value="">-- Select Player --</option>
                {roster1.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {rosterError1 && (
            <p style={{ color: "red", fontSize: "14px" }}>
              Roster unavailable for this team (API limitation).
            </p>
          )}
        </div>


        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label>Team 2: </label>
              <select
                className="form-select mt-2"
                value={team2}
                onChange={(e) => {
                  setTeam2(e.target.value);
                  setPlayer2(null);
                }}
              >
                <option value="">-- Select Team --</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>Player 2: </label>
              <select
                className="form-select mt-2"
                onChange={(e) =>
                  handleSelect(e.target.value, setPlayer2, setLoading2)
                }
              >
                <option value="">-- Select Player --</option>
                {roster2.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {rosterError2 && (
            <p style={{ color: "red", fontSize: "14px" }}>
              Roster unavailable for this team (API limitation).
            </p>
          )}
        </div>
      </div>

{/* PLAYER CARDS */}
<div style={{ display: "flex", gap: "30px", marginBottom: "40px" }}>
  {[{ player: player1, loading: loading1, title: "Player 1" },
    { player: player2, loading: loading2, title: "Player 2" }].map(
    ({ player, loading, title }, i) => {
      const stats = getPlayerStats(player);

      // Extract best available player photo
      const photo =
        player?.player?.official_image ||
        player?.player?.photo ||
        player?.player?.images?.headshot?.href ||
        null;

      return (
        <div
          key={i}
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            position: "relative",
            minHeight: "200px",
          }}
        >
          <h2>{title}</h2>

          {loading ? (
            <p>Loading…</p>
          ) : player ? (
            <>
              {/* PLAYER IMAGE */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "90px",
                  height: "90px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="player headshot"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "12px", color: "#666" }}>No Image</span>
                )}
              </div>

              {/* TEXT */}
              <p><strong>Name:</strong> {player.player.full_name}</p>
              <p><strong>AVG:</strong> {stats.avg}</p>
              <p><strong>HR:</strong> {stats.hr}</p>
              <p><strong>ERA:</strong> {stats.era}</p>
              <p><strong>K/9:</strong> {stats.k9}</p>
            </>
          ) : (
            <p>No player selected.</p>
          )}
        </div>
      );
    }
  )}
</div>


   {/* GRAPH */}
<div
  style={{
    height: "350px",
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    border: "1px solid #ccc",
    marginTop: "40px"
  }}
>
  <h3 style={{ marginBottom: "10px" }}>
    Player Statistical Comparison
  </h3>

  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={buildComparisonData()}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="stat" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar dataKey="p1" name="Player 1" fill="#8884d8" />
      <Bar dataKey="p2" name="Player 2" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
</div>

    </div>
  );
}
