// src/utils/spotify.js

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_ENDPOINT = 'https://api.spotify.com/v1';

// These are loaded from your .env file (e.g., .env.local) by Vite
const CLIENT_ID = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_SECRET;

let accessToken = '';
let tokenExpiryTime = 0;

// Helper function to check if credentials are loaded
const checkCredentials = () => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    const errorMessage = "Spotify API Client ID or Secret is missing. \n" +
                         "1. Ensure you have a .env file in your project root (e.g., .env or .env.local).\n" +
                         "2. Ensure variables are named correctly: VITE_REACT_APP_SPOTIFY_CLIENT_ID and VITE_REACT_APP_SPOTIFY_CLIENT_SECRET.\n" +
                         "3. Restart your Vite development server after creating/modifying the .env file.";
    console.error(errorMessage);
    // alert(errorMessage); // Uncomment for very obvious feedback during development
    return false;
  }
  console.log("Spotify credentials seem to be loaded (CLIENT_ID is present).");
  return true;
};

const getAccessToken = async (retryCount = 0) => {
  console.log("getAccessToken called");
  if (!checkCredentials()) {
    throw new Error("Spotify credentials not configured. See console for details.");
  }

  const currentTime = Date.now();
  if (accessToken && currentTime < tokenExpiryTime) {
    console.log("Using cached Spotify access token.");
    return accessToken;
  }
  console.log("Fetching new Spotify access token...");

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Read body as text for detailed error
      console.error(`Spotify Auth Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch access token: ${response.status} ${response.statusText}. Details: ${errorBody}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      console.error("Access token not received from Spotify, response data:", data);
      throw new Error('Access token not received from Spotify.');
    }

    accessToken = data.access_token;
    tokenExpiryTime = currentTime + (data.expires_in * 1000) - 60000; // Subtract 1 min buffer
    console.log("Successfully fetched new Spotify access token.");
    return accessToken;
  } catch (error) {
    console.error("Error in getAccessToken:", error.message);
    if (retryCount < 3) { // Reduced retries for faster debugging, can increase later
      const delay = error.message.includes('429') ? 10000 : Math.pow(2, retryCount) * 1000;
      console.warn(`Retrying access token fetch (${retryCount + 1}/3) in ${delay}ms: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getAccessToken(retryCount + 1);
    }
    throw new Error(`Failed to fetch access token after ${retryCount + 1} attempts: ${error.message}`);
  }
};

export const searchTracks = async (query, retryCount = 0) => {
  console.log(`searchTracks called with query: "${query}"`);
  if (!checkCredentials()) {
    throw new Error("Spotify credentials not configured. See console for details.");
  }

  if (!query || query.trim() === '') {
    console.log("Search query is empty, returning empty array.");
    return [];
  }

  try {
    const token = await getAccessToken();
    console.log(`Searching Spotify with token (first 10 chars): ${token.substring(0, 10)}...`);
    
    const response = await fetch(
      `${API_ENDPOINT}/search?q=${encodeURIComponent(query)}&type=track&market=US&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify Search Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Search failed: ${response.status} ${response.statusText}. Details: ${errorBody}`);
    }

    const data = await response.json();
    console.log("Spotify search raw response data:", data);

    const tracks = (data.tracks?.items || []).filter(
      (track) => track && track.id && track.preview_url
    );
    console.log(`Found ${tracks.length} tracks with preview URLs.`);
    if (data.tracks?.items && tracks.length === 0 && data.tracks.items.length > 0) {
        console.warn("Tracks were found, but none had a preview_url. This is common for some songs/regions.");
    }

    return tracks;
  } catch (error) {
    console.error("Error in searchTracks:", error.message);
    if (retryCount < 3) { // Reduced retries
      const delay = error.message.includes('429') ? 10000 : Math.pow(2, retryCount) * 1000;
      console.warn(`Retrying search (${retryCount + 1}/3) in ${delay}ms: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return searchTracks(query, retryCount + 1);
    }
    // Don't re-throw the generic error, throw the specific one from the try block or getAccessToken
    if (error.message.startsWith("Failed to fetch access token") || error.message.startsWith("Search failed:")) {
        throw error; // rethrow specific error
    }
    throw new Error(`Failed to search tracks after ${retryCount + 1} attempts: ${error.message}`);
  }
};

// getTrackPreviewUrl is not directly used for playback in your current flow, but good to keep consistent
export const getTrackPreviewUrl = async (trackId) => {
  // ... (add similar logging and credential checks if you plan to use this)
  console.log(`getTrackPreviewUrl called for track ID: ${trackId}`);
   if (!checkCredentials()) {
    throw new Error("Spotify credentials not configured.");
  }
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_ENDPOINT}/tracks/${trackId}?market=US`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify Get Track Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch track: ${response.status} ${response.statusText}. Details: ${errorBody}`);
    }

    const data = await response.json();
    console.log("Fetched track data for preview URL:", data);
    return data.preview_url || null;
  } catch (error) {
    console.error(`Failed to fetch track preview URL: ${error.message}`);
    throw error; // rethrow
  }
};