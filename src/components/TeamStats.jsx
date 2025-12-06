import React, { useState, useEffect } from "react";
import standingsData from "../data/standings.json";



// Static fallback colors and selection list
const STATIC_TEAM_COLORS = {
  MIL: { primary: "#0A2351", secondary: "#FFC52F" },
  CHC: { primary: "#0E3386", secondary: "#CC3433" },
  CIN: { primary: "#C6011F", secondary: "#000000" },
  TOR: { primary: "#134A8E", secondary: "#1D2D5C" },
  NYY: { primary: "#0C2340", secondary: "#C6011F" },
};
const SELECTED_TEAM_ABBRS = Object.keys(STATIC_TEAM_COLORS);

// -------------------------------------------------------
// Component for the Detailed Team Overview Card
const TeamOverviewCard = ({ team }) => {
  if (!team) return null;

  const imageUrl = `./src/data/team_profiles/${team.abbr}.png`;
  
  // Run Differential is a placeholder stat box as it's missing in JSON
  const runDifferential = 0; 
  const diffClass = runDifferential >= 0 ? 'text-green-600' : 'text-red-600';
  const diffSign = runDifferential >= 0 ? '+' : '';

  const StatBox = ({ label, value, colorClass }) => (
    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-inner">
      <div className={`text-3xl font-extrabold ${colorClass}`}>{value}</div>
      <div className="text-sm font-medium text-gray-500 mt-1">{label}</div>
    </div>
  );
  
  const getStreakColor = (streak) => {
    if (streak.startsWith('W')) return 'bg-green-100 text-green-700';
    if (streak.startsWith('L')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 mb-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Logo and Primary Info */}
        <div className="flex-shrink-0 flex flex-col items-center">
            <img
                src={imageUrl}
                alt={`${team.name} Logo`}
                className="w-24 h-24 object-contain rounded-full border-4 shadow-lg p-1"
                style={{ borderColor: team.primaryColor }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                    `https://placehold.co/100x100/eeeeee/333333?text=${team.abbr}`;
                }}
            />
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3">{team.market} {team.name}</h2>
            <p className="text-lg font-mono font-bold text-gray-600">
                {team.win}-{team.loss}
            </p>
        </div>

        {/* Detailed Stats Grid */}
        <div className="flex-grow w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 md:mt-0">
          <StatBox 
            label="Win Pct" 
            value={(team.win_p * 100).toFixed(1) + '%'} 
            colorClass="text-blue-600" 
          />
          <StatBox 
            label="Games Back" 
            value={team.games_back} 
            colorClass="text-yellow-600" 
          />
          <StatBox 
            label="Streak" 
            value={<span className={`py-1 px-3 rounded-full text-base font-semibold ${getStreakColor(team.streak)}`}>{team.streak}</span>}
            colorClass="text-gray-800"
          />
          <StatBox 
            label="Home Record" 
            value={`${team.home_win}-${team.home_loss}`} 
            colorClass="text-indigo-600" 
          />
          <StatBox 
            label="Away Record" 
            value={`${team.away_win}-${team.away_loss}`} 
            colorClass="text-purple-600" 
          />
          <StatBox 
            label="Last 10" 
            value={`${team.last_10_won}-${team.last_10_lost}`} 
            colorClass="text-pink-600" 
          />
          <StatBox 
            label="Division Rank" 
            value={team.rank?.division || '-'} 
            colorClass="text-teal-600" 
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// CHART 1: Home vs Away Differential Chart (Win Percentages)
const HomeAwayWinPercentageChart = ({ team }) => {
  if (!team) return null;

  // Calculations derived directly from standings.json data
  const homeWinPct = team.home_win / (team.home_win + team.home_loss);
  const awayWinPct = team.away_win / (team.away_win + team.away_loss);
  
  const formatPct = (pct) => (pct * 100).toFixed(1) + '%';
  
  // Static colors for clarity and consistency (Home=Indigo, Away=Purple)
  const HOME_COLOR = '#4f46e5'; // Indigo-600
  const AWAY_COLOR = '#9333ea'; // Purple-600

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Home vs. Away Win Percentage</h3>
      
      <div className="space-y-6">
        {/* Home Win Percentage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-lg" style={{ color: HOME_COLOR }}>Home Record</span>
            <span className="font-bold text-xl" style={{ color: HOME_COLOR }}>
              {formatPct(homeWinPct)}
            </span>
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: formatPct(homeWinPct), backgroundColor: HOME_COLOR }}
              title={`Home Win %: ${formatPct(homeWinPct)}`}
            >
            </div>
          </div>
        </div>

        {/* Away Win Percentage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-lg" style={{ color: AWAY_COLOR }}>Away Record</span>
            <span className="font-bold text-xl" style={{ color: AWAY_COLOR }}>
              {formatPct(awayWinPct)}
            </span>
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: formatPct(awayWinPct), backgroundColor: AWAY_COLOR }}
              title={`Away Win %: ${formatPct(awayWinPct)}`}
            >
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md">
        <p className="font-semibold text-blue-800">Analysis:</p>
        <p>This chart directly compares the team's Home (Indigo) and Away (Purple) Win Percentages. A greater bar length indicates a higher winning rate in that environment. The percentages are calculated as Wins / (Wins + Losses) at that location.</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// CHART 2: Last 10 vs. Season Win Percentage Comparison
const FormComparisonChart = ({ team }) => {
  if (!team) return null;

  const seasonWinPct = team.win_p;
  const last10WinPct = team.last_10_won / 10;
  
  const formatPct = (pct) => (pct * 100).toFixed(1) + '%';
  
  // Use team's primary color for the overall season performance
  const OVERALL_COLOR = team.primaryColor;
  
  const getTrendColor = (current, overall) => {
    if (current > overall) return '#10b981'; // Green (Trending Up)
    if (current < overall) return '#f87171'; // Red (Trending Down)
    return '#6b7280'; // Gray (Stable)
  };
  
  const trendColor = getTrendColor(last10WinPct, seasonWinPct);

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Current Form vs. Overall Performance</h3>
      
      <div className="space-y-6">
        {/* Overall Season Win Percentage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-lg text-gray-700">Season Win %</span>
            <span className="font-bold text-xl" style={{ color: OVERALL_COLOR }}>
              {formatPct(seasonWinPct)}
            </span>
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: formatPct(seasonWinPct), backgroundColor: OVERALL_COLOR }}
              title={`Season Win %: ${formatPct(seasonWinPct)}`}
            >
            </div>
          </div>
        </div>

        {/* Last 10 Games Win Percentage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-lg" style={{ color: trendColor }}>
              Last 10 Games ({team.last_10_won}-{team.last_10_lost})
            </span>
            <span className="font-bold text-xl" style={{ color: trendColor }}>
              {formatPct(last10WinPct)}
            </span>
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: formatPct(last10WinPct), backgroundColor: trendColor }}
              title={`Last 10 Win %: ${formatPct(last10WinPct)}`}
            >
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
        <p className="font-semibold text-yellow-800">Interpretation:</p>
        <p>The chart compares the team's long-term success (Season Win %, Team Color) against its recent form (Last 10 Win %, Green/Red). Green means the team is **trending up** (Last 10 is better than Season), and Red means the team is **trending down**.</p>
      </div>
    </div>
  );
};


// -------------------------------------------------------
// Main Component
export default function TeamStats() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const season = standingsData.league?.season?.year || new Date().getFullYear();

  // 1. Initial Data Loading and Parsing
  useEffect(() => {
    const parsedTeams = [];
    const leagues = standingsData.league?.season?.leagues;

    if (Array.isArray(leagues)) {
      leagues.forEach((lg) => {
        lg.divisions?.forEach((div) => {
          div.teams?.forEach((t) => {
            // Filter to only include the 5 pre-selected teams based on abbr
            if (SELECTED_TEAM_ABBRS.includes(t.abbr)) {
              const colors = STATIC_TEAM_COLORS[t.abbr];
              parsedTeams.push({
                id: t.id,
                abbr: t.abbr,
                market: t.market,
                name: t.name,
                primaryColor: colors.primary,
                secondaryColor: colors.secondary,
                // Extract all required stats directly
                win: t.win,
                loss: t.loss,
                win_p: t.win_p,
                games_back: t.games_back,
                home_win: t.home_win,
                home_loss: t.home_loss,
                away_win: t.away_win,
                away_loss: t.away_loss,
                last_10_won: t.last_10_won,
                last_10_lost: t.last_10_lost,
                streak: t.streak,
                rank: t.rank,
              });
            }
          });
        });
      });
    }

    setTeams(parsedTeams);
    // Set initial selected team
    if (parsedTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(parsedTeams[0]);
    }
  }, [selectedTeam]); 

  const handleSelectTeam = (id) => {
    const team = teams.find(t => t.id === id);
    if (team) {
      setSelectedTeam(team);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold text-gray-900 text-center pt-4">
        MLB Team Overview ({season})
      </h1>
      
      {/* Team Selector */}
      <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Select Team for Snapshot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {teams.map((t) => (
            <button
              key={t.id}
              className={`p-3 rounded-xl border-2 transition-all duration-200 shadow-md ${
                selectedTeam?.id === t.id
                  ? " text-white border-opacity-100 transform scale-[1.02]"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
              }`}
              style={{
                borderColor: selectedTeam?.id === t.id ? t.primaryColor : undefined,
                backgroundColor: selectedTeam?.id === t.id ? t.primaryColor : undefined,
                color: selectedTeam?.id === t.id ? 'white' : t.primaryColor,
                boxShadow: selectedTeam?.id === t.id ? `0 4px 12px rgba(0, 0, 0, 0.2)` : `0 2px 8px rgba(0, 0, 0, 0.05)`,
              }}
              onClick={() => handleSelectTeam(t.id)}
            >
              <div className="font-bold text-lg leading-tight">
                {t.abbr}
              </div>
              <div className="text-xs opacity-80 mt-1">
                {t.market}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Team Snapshot/Overview Card */}
      {selectedTeam && <TeamOverviewCard team={selectedTeam} />}

      {/* Differential Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {selectedTeam && <HomeAwayWinPercentageChart team={selectedTeam} />}
        {selectedTeam && <FormComparisonChart team={selectedTeam} />}
      </div>

    </div>
  );
}