import axios from "axios";

// Use Vite env var for the API key. Create a `.env` or `.env.local` with
// `VITE_SPORTSRADAR_API_KEY=your_key` and do NOT commit that file.
const API_KEY = import.meta.env.VITE_SPORTSRADAR_API_KEY;

// Use a proxied base path during development. The Vite dev server proxies
// `/sportradar/*` to `https://api.sportradar.com/*` (see `vite.config.js`).
const BASE = import.meta.env.VITE_SPORTSRADAR_BASE || "/sportradar";
const TEAMS_URL = `${BASE}/mlb/trial/v8/en/league/teams.json`;

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

//export default { getTeams };

export async function getPlayerProfile(playerId) {
  const url = `${BASE}/mlb/trial/v8/en/players/${playerId}/profile.json`;

  try {
    const res = await axios.get(url, {
      params: { api_key: API_KEY },
      headers: { accept: "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("getPlayerProfile error:", err);
    throw err;
  }
}
