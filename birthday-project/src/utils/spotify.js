
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_ENDPOINT = 'https://api.spotify.com/v1';
const CLIENT_ID = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_SECRET;

let accessToken = '';
let tokenExpiryTime = 0;

const getAccessToken = async (retryCount = 0) => {
  const currentTime = Date.now();
  if (accessToken && currentTime < tokenExpiryTime) {
    return accessToken;
  }

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
      throw new Error(`Failed to fetch access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error('Access token not received from Spotify.');
    }

    accessToken = data.access_token;
    tokenExpiryTime = currentTime + data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    if (retryCount < 5) {
      const delay = error.message.includes('429') ? 10000 : Math.pow(2, retryCount) * 1000;
      console.warn(`Retrying access token fetch (${retryCount + 1}/5): ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getAccessToken(retryCount + 1);
    }
    throw new Error(`Failed to fetch access token after ${retryCount + 1} attempts: ${error.message}`);
  }
};

export const searchTracks = async (query, retryCount = 0) => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${API_ENDPOINT}/search?q=${encodeURIComponent(query)}&type=track&market=US&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = (data.tracks?.items || []).filter(
      (track) => track && track.id && track.preview_url
    );

    return tracks;
  } catch (error) {
    if (retryCount < 5) {
      const delay = error.message.includes('429') ? 10000 : Math.pow(2, retryCount) * 1000;
      console.warn(`Retrying search (${retryCount + 1}/5): ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return searchTracks(query, retryCount + 1);
    }
    throw new Error(`Failed to search tracks after ${retryCount + 1} attempts: ${error.message}`);
  }
};

export const getTrackPreviewUrl = async (trackId) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_ENDPOINT}/tracks/${trackId}?market=US`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch track: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.preview_url || null;
  } catch (error) {
    console.error(`Failed to fetch track preview URL: ${error.message}`);
    throw new Error(`Failed to fetch track preview URL: ${error.message}`);
  }
};