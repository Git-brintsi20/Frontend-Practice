const CLIENT_ID = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_SECRET;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_ENDPOINT = 'https://api.spotify.com/v1';

export const BTS_ARTIST_ID = '3Nrfpe0tUJi4K4DXYWgG';

let accessToken = '';
let tokenExpiryTime = 0;

const getAccessToken = async () => {
  const currentTime = Date.now();
  if (accessToken && currentTime < tokenExpiryTime) {
    return accessToken;
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error('Access token not received from Spotify.');
    }

    accessToken = data.access_token;
    tokenExpiryTime = currentTime + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

export const getBTSTopTracks = async () => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_ENDPOINT}/artists/${BTS_ARTIST_ID}/top-tracks?market=US`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error fetching BTS top tracks:', error);
    throw error;
  }
};

export const getTrackPreviewUrl = async (trackId) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_ENDPOINT}/tracks/${trackId}?market=US`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch track preview: ${response.statusText}`);
    }

    const data = await response.json();
    return data.preview_url || null;
  } catch (error) {
    console.error('Error fetching track preview URL:', error);
    throw error;
  }
};