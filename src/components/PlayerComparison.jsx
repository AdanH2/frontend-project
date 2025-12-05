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

// Determines how to label a player's position (handles two-way players)
const getPlayerPositionLabel = (player, stats) => {
  const pos = player?.player?.position;

  // Detect two-way using stats
  const isTwoWay = stats.avg !== "—" && stats.era !== "—";

  if (isTwoWay) return "Two-Way Player";

  // Otherwise map the stored position
  const map = {
    P: "Pitcher",
    C: "Catcher",
    IF: "Infielder",
    OF: "Outfielder",
    DH: "Designated Hitter",
  };

  return map[pos] || pos || "—";
};


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
    // Tailwind classes: padding, min-height, centered content
    <div className="bg-gray-50 min-h-screen p-4 md:p-10 max-w-7xl mx-auto">
      
      {/* Title */}
      {/* Using Tailwind typography for consistency */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">Player Comparison</h1>

      {/* SELECTORS */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">

        {/* TEAM 1 + PLAYER 1 */}
        {/* flex-1 and space-y-4 for vertical stacking on mobile, converted to horizontal flex on md screens */}
        <div className="flex-1 space-y-4 md:space-y-0 md:flex md:space-x-4">
            
            {/* Team 1 Select */}
            <div className="flex-1">
              <label htmlFor="team1-select" className="block text-sm font-medium text-gray-700">Team 1: </label>
              <select
                id="team1-select"
                className="w-full mt-1 block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            {/* Player 1 Select */}
            <div className="flex-1">
              <label htmlFor="player1-select" className="block text-sm font-medium text-gray-700">Player 1: </label>
              <select
                id="player1-select"
                className="w-full mt-1 block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            <p className="text-red-500 text-sm mt-2">
              Roster unavailable for this team (API limitation).
            </p>
          )}

        {/* TEAM 2 + PLAYER 2 */}
        <div className="flex-1 space-y-4 md:space-y-0 md:flex md:space-x-4 mt-4 md:mt-0">
            <div className="flex-1">
              <label htmlFor="team2-select" className="block text-sm font-medium text-gray-700">Team 2: </label>
              <select
                id="team2-select"
                className="w-full mt-1 block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            <div className="flex-1">
              <label htmlFor="player2-select" className="block text-sm font-medium text-gray-700">Player 2: </label>
              <select
                id="player2-select"
                className="w-full mt-1 block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            <p className="text-red-500 text-sm mt-2">
              Roster unavailable for this team (API limitation).
            </p>
          )}
      </div>

{/* PLAYER CARDS */}
{/*Uses md:flex-row for horizontal layout on desktop, stacked on mobile */}
<div className="flex flex-col md:flex-row gap-6 mb-10">
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
          // Tailwind card classes: flex-1, border, padding, rounded, shadow, min-h
          className="flex-1 border border-gray-200 p-6 rounded-xl shadow-lg bg-white relative min-h-64"
        >
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

          {loading ? (
            <p className="text-gray-500 italic">Loading...</p>
          ) : player ? (
            <>
              {/* PLAYER IMAGE */}
              <div
                // Tailwind utility classes
                className="absolute top-6 right-6 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center shadow-md"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={`${player.player.full_name} headshot`}
                    // Converted style to object-cover. Using a placeholder as fallback.
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/CCCCCC/333333?text=No+Photo"; }}
                  />
                ) : (
                  <span className="text-xs text-gray-500">No Image</span>
                )}
              </div>

              {/* TEXT STATS */}
              <div className="space-y-1">
                <p className="text-base">
                    <strong className="font-semibold text-gray-700">Name:</strong> {player.player.full_name}
                </p>

                <p className="text-base player-position">
                    <strong className="font-semibold text-gray-700">Position:</strong> {getPlayerPositionLabel(player, stats)}
                </p>
                
                {/* Highlighted stats for better readability */}
                <p className="text-base">
                    <strong className="font-semibold text-gray-700">AVG:</strong> <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-800">{stats.avg}</span>
                </p>
                <p className="text-base">
                    <strong className="font-semibold text-gray-700">HR:</strong> <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-800">{stats.hr}</span>
                </p>
                <p className="text-base">
                    <strong className="font-semibold text-gray-700">ERA:</strong> <span className="font-mono bg-green-100 px-2 py-0.5 rounded text-green-800">{stats.era}</span>
                </p>
                <p className="text-base">
                    <strong className="font-semibold text-gray-700">K/9:</strong> <span className="font-mono bg-green-100 px-2 py-0.5 rounded text-green-800">{stats.k9}</span>
                </p>
              </div>

            </>
          ) : (
            <p className="text-gray-500 italic">Select a team and player above.</p>
          )}
        </div>
      );
    }
  )}
</div>


   {/* GRAPH */}
<div
  // Converted graph container style to Tailwind classes: padding, margin, border, shadow, rounded, height
  className="h-[350px] bg-white rounded-xl p-6 border border-gray-200 shadow-lg mt-8"
>
  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
    Player Statistical Comparison
  </h3>

  <ResponsiveContainer width="100%" height="90%">
    <BarChart data={buildComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="stat" stroke="#4B5563" />
      <YAxis stroke="#4B5563" />
      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }} />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />

      {/* Used standard Tailwind colors (converted to hex) for bars */}
      <Bar dataKey="p1" name={player1?.player?.full_name || "Player 1"} fill="#3B82F6" radius={[4, 4, 0, 0]} /> {/* Blue-500 */}
      <Bar dataKey="p2" name={player2?.player?.full_name || "Player 2"} fill="#10B981" radius={[4, 4, 0, 0]} /> {/* Green-500 */}
    </BarChart>
  </ResponsiveContainer>
</div>

    </div>
  );
}