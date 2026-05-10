/**
 * ICC Cricket Management System - API Handler
 * Centralized service for fetching real-time cricket data.
 * Supports CricAPI and RapidAPI (Cricket Live Score).
 */

const CricketAPI = (() => {
  // CONFIGURATION
  // Replace with your actual API key from CricAPI or RapidAPI
  const API_CONFIG = {
    CRIC_API_KEY: '', // https://cricapi.com/
    RAPID_API_KEY: '', // https://rapidapi.com/
    CACHE_DURATION: 1000 * 60 * 5, // 5 minutes cache
    MOCK_MODE: true // Set to false when API key is provided
  };

  // CACHE HELPER
  const cache = {
    get: (key) => {
      const stored = localStorage.getItem(`icc_cache_${key}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp > API_CONFIG.CACHE_DURATION) {
        localStorage.removeItem(`icc_cache_${key}`);
        return null;
      }
      return parsed.data;
    },
    set: (key, data) => {
      localStorage.setItem(`icc_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
  };

  // FALLBACK DATA (High Quality Realistic Data)
  const FALLBACK_DATA = {
    liveMatches: [
      {
        id: "live-1",
        name: "India vs England, 3rd ODI",
        status: "India elected to bat",
        venue: "Eden Gardens, Kolkata",
        format: "ODI",
        teams: {
          t1: { name: "India", flag: "🇮🇳", score: "287/4", overs: "42.3" },
          t2: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "Yet to bat", overs: "0.0" }
        }
      },
      {
        id: "live-2",
        name: "Australia vs South Africa, 1st T20I",
        status: "South Africa need 45 runs in 18 balls",
        venue: "The Gabba, Brisbane",
        format: "T20I",
        teams: {
          t1: { name: "Australia", flag: "🇦🇺", score: "182/6", overs: "20.0" },
          t2: { name: "South Africa", flag: "🇿🇦", score: "138/4", overs: "17.0" }
        }
      }
    ],
    rankings: {
      ODI: [
        { rank: 1, team: "India", flag: "🇮🇳", rating: 126, points: "5,432", matches: 58 },
        { rank: 2, team: "Australia", flag: "🇦🇺", rating: 121, points: "5,210", matches: 45 },
        { rank: 3, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rating: 118, points: "4,980", matches: 42 },
        { rank: 4, team: "New Zealand", flag: "🇳🇿", rating: 115, points: "4,750", matches: 40 },
        { rank: 5, team: "Pakistan", flag: "🇵🇰", rating: 112, points: "4,620", matches: 38 }
      ],
      T20I: [
        { rank: 1, team: "India", flag: "🇮🇳", rating: 269, points: "5,810", matches: 47 },
        { rank: 2, team: "South Africa", flag: "🇿🇦", rating: 267, points: "3,612", matches: 28 },
        { rank: 3, team: "Australia", flag: "🇦🇺", rating: 259, points: "4,050", matches: 36 },
        { rank: 4, team: "New Zealand", flag: "🇳🇿", rating: 251, points: "3,200", matches: 30 },
        { rank: 5, team: "Pakistan", flag: "🇵🇰", rating: 247, points: "3,100", matches: 35 }
      ],
      TEST: [
        { rank: 1, team: "Australia", flag: "🇦🇺", rating: 128, points: "4,604", matches: 36 },
        { rank: 2, team: "India", flag: "🇮🇳", rating: 122, points: "3,581", matches: 31 },
        { rank: 3, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rating: 116, points: "3,920", matches: 37 },
        { rank: 4, team: "South Africa", flag: "🇿🇦", rating: 106, points: "2,700", matches: 26 },
        { rank: 5, team: "New Zealand", flag: "🇳🇿", rating: 96, points: "2,000", matches: 22 }
      ]
    },
    playerStats: {
      "Virat Kohli": {
        role: "Top-order Batter",
        country: "India",
        stats: {
          ODI: { matches: 292, runs: 13848, avg: 58.67, sr: 93.5, cents: 50 },
          T20I: { matches: 117, runs: 4037, avg: 51.75, sr: 138.1, cents: 1 },
          TEST: { matches: 113, runs: 8848, avg: 49.15, cents: 29 }
        }
      },
      "Babar Azam": {
        role: "Batter",
        country: "Pakistan",
        stats: {
          ODI: { matches: 117, runs: 5729, avg: 56.72, sr: 88.5, cents: 19 },
          T20I: { matches: 109, runs: 3698, avg: 41.55, sr: 129.1, cents: 3 },
          TEST: { matches: 52, runs: 3898, avg: 45.85, cents: 9 }
        }
      }
    }
  };

  // CORE FETCH FUNCTION
  async function fetchData(endpoint, cacheKey) {
    if (API_CONFIG.MOCK_MODE) {
      return new Promise(resolve => setTimeout(() => resolve(FALLBACK_DATA[cacheKey] || []), 500));
    }

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Example endpoint for CricAPI (requires key)
      const response = await fetch(`https://api.cricapi.com/v1/${endpoint}&apikey=${API_CONFIG.CRIC_API_KEY}`);
      const result = await response.json();
      
      if (result.status === "success") {
        cache.set(cacheKey, result.data);
        return result.data;
      }
      throw new Error(result.reason || "API Error");
    } catch (err) {
      console.error("Fetch Error:", err);
      return FALLBACK_DATA[cacheKey] || [];
    }
  }

  return {
    getLiveMatches: () => fetchData('currentMatches', 'liveMatches'),
    getRankings: (type) => fetchData('rankings', 'rankings').then(data => data[type] || []),
    getPlayerStats: (name) => fetchData(`playerStats?name=${name}`, 'playerStats').then(data => data[name] || null),
    getUpcomingMatches: () => fetchData('matches', 'upcomingMatches'),
    initAutoRefresh: (callback, interval = 30000) => {
      setInterval(callback, interval);
    }
  };
})();

window.CricketAPI = CricketAPI;
