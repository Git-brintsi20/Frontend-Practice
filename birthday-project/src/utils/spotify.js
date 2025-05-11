const CLIENT_ID = 'your-client-id'; // Replace with your Spotify Client ID
const CLIENT_SECRET = 'your-client-secret'; // Replace with your Spotify Client Secret
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_ENDPOINT = 'https://api.spotify.com/v1';

export const BTS_ARTIST_ID = '3Nrfpe0tUJi4K4DXYWgG'; // BTS Artist ID

let accessToken = '';

const getAccessToken = async () => {
  if (accessToken) return accessToken;

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

  const data = await response.json();
  accessToken = data.access_token;
  setTimeout(() => (accessToken = ''), data.expires_in * 1000); // Reset token after expiration
  return accessToken;
};

export const getBTSTopTracks = async () => {
  const token = await getAccessToken();
  const response = await fetch(`${API_ENDPOINT}/artists/${BTS_ARTIST_ID}/top-tracks?market=US`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.tracks || [];
};

export const getTrackPreviewUrl = async (trackId) => {
  const token = await getAccessToken();
  const response = await fetch(`${API_ENDPOINT}/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.preview_url || null;
};