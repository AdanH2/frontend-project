import axios from "axios";

// Use Vite env var for the API key. Create a `.env` or `.env.local` with
// `VITE_SPORTSRADAR_API_KEY=your_key` and do NOT commit that file.
const API_KEY = import.meta.env.VITE_SPORTSRADAR_API_KEY;

// Use a proxied base path during development. The Vite dev server proxies
// `/sportradar/*` to `https://api.sportradar.com/*` (see `vite.config.js`).
const BASE = import.meta.env.VITE_SPORTSRADAR_BASE || "/sportradar";
const TEAM_LIST_URL = `${BASE}/mlb/trial/v8/en/league/teams.json`;
const CURRENT_SEASON_YEAR = new Date().getFullYear(); // Needed for standings
const STANDINGS_URL = `${BASE}/mlb/trial/v8/en/seasons/${CURRENT_SEASON_YEAR}/REG/standings.json`;
const TEAMS_URL = `${BASE}/mlb/trial/v8/en/league/depth_charts.json`;

/**
 * Fetch basic team data from Sportradar
 * - Sends `accept: application/json` header
 * - Passes API key as `api_key` query parameter
 * @returns {Promise<Object>} response data
 */
export async function getTeams() {
  try {
    if (!API_KEY) {
      console.warn(
        "sportsradarClient: No API key set. Set VITE_SPORTSRADAR_API_KEY in .env"
      );
    }
    const res = await axios.get(TEAMS_URL, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data;
  } catch (error) {
    // Keep the error visible to calling components
    console.error("sportsradarClient.getTeams error:", error);
    throw error;
  }
}

/**
 * Fetch season leaders for a given statistic.
 * If the API is not available in dev, components should handle empty data.
 * @param {string} stat - e.g. 'home_runs', 'batting_average', 'era'
 * @param {string|number} season - season year string/number
 */
export async function getSeasonLeaders(stat = "home_runs", season = "2025") {
  try {
    if (!API_KEY) {
      console.warn(
        "sportsradarClient: No API key set. Returning empty leaders."
      );
    }
    const url = `${BASE}/mlb/trial/v8/en/seasons/${season}/REG/leaders/statistics.json`;
    const res = await axios.get(url, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });

    const data = res.data;

    // Map common aliases to the JSON keys used by the leaders file
    const statKeyMap = {
      era: "earned_run_average",
      earned_run_average: "earned_run_average",
      batting_average: "batting_average",
      home_runs: "home_runs",
    };
    const lookupStat = statKeyMap[stat] || stat;

    const aggregateFrom = (payload) => {
      const result = [];
      if (!payload || !Array.isArray(payload.leagues)) return result;
      payload.leagues.forEach((league) => {
        const hit = league?.hitting?.[lookupStat]?.players;
        if (Array.isArray(hit)) result.push(...hit);
        const pit = league?.pitching?.[lookupStat]?.players;
        if (Array.isArray(pit)) result.push(...pit);
      });
      return result;
    };

    const aggregated = aggregateFrom(data);

    // Normalize values and deduplicate by id
    const seen = new Set();
    const leaders = [];
    aggregated.forEach((p) => {
      const id = p?.id;
      if (!id) return;
      if (seen.has(id)) return;
      seen.add(id);

      // compute numeric value for charting
      let value = null;
      if (lookupStat === "batting_average") {
        value = parseFloat(p.avg ?? p.value ?? null);
      } else if (lookupStat === "home_runs") {
        value = Number(p.home_runs ?? p.hr ?? p.value ?? 0);
      } else if (lookupStat === "earned_run_average") {
        value = Number(p.era ?? p.value ?? 0);
      } else {
        value = Number(p.value ?? 0);
      }

      leaders.push({ ...p, value });
    });

    // Sort primarily by numeric `value` (descending for counting stats/avg, ascending for ERA)
    if (leaders.length > 0) {
      leaders.sort((a, b) => {
        const va =
          a.value ??
          (lookupStat === "earned_run_average" ? Infinity : -Infinity);
        const vb =
          b.value ??
          (lookupStat === "earned_run_average" ? Infinity : -Infinity);
        if (va === vb) {
          const ra = typeof a.rank === "number" ? a.rank : Infinity;
          const rb = typeof b.rank === "number" ? b.rank : Infinity;
          return ra - rb;
        }
        return lookupStat === "earned_run_average" ? va - vb : vb - va;
      });
    }

    return { ...data, leaders };
  } catch (error) {
    console.error("sportsradarClient.getSeasonLeaders error:", error);
    throw error;
  }
}

export async function getPlayerProfile(playerId) {
  try {
    if (!playerId) return null;
    const url = `${BASE}/mlb/trial/v8/en/players/${playerId}/profile.json`;
    const res = await axios.get(url, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("sportsradarClient.getPlayerProfile error:", error);
    throw error;
  }
}

export async function getTeamProfile(teamId) {
  try {
    if (!teamId) return null;
    const url = `${BASE}/mlb/trial/v8/en/teams/${teamId}/profile.json`;
    const res = await axios.get(url, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("sportsradarClient.getTeamProfile error:", error);
    throw error;
  }
}

export async function getPlayersByTeam(teamId) {
  try {
    if (!teamId) return [];
    const url = `${BASE}/mlb/trial/v8/en/teams/${teamId}/profile.json`;
    const res = await axios.get(url, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data?.players;
  } catch (error) {
    console.error("sportsradarClient.getPlayersByTeam error:", error);
    throw error;
  }
}

export async function getStandings() {
  try {
    if (!API_KEY) {
      console.warn("sportsradarClient: No API key set.");
    }
    const res = await axios.get(STANDINGS_URL, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("sportsradarClient.getStandings error:", error);
  }
}
  
export async function getGamesForADate(dateStr) {
  try {
    if (!dateStr) return [];
    const url = `${BASE}/mlb/trial/v8/en/games/${dateStr}/schedule.json`;
    const res = await axios.get(url, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data || [];
  } catch (error) {
    console.error("sportsradarClient.getGamesForADate error:", error);
    throw error;
  }
}

export default {
  getTeams,
  getStandings,
  getSeasonLeaders,
  getPlayerProfile,
  getTeamProfile,
  getPlayersByTeam,
  getGamesForADate,
};
