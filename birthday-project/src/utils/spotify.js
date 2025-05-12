// spotify.js
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
    if (retryCount < 3) {
      console.warn(`Retrying access token fetch (${retryCount + 1}/3)...`);
      return getAccessToken(retryCount + 1);
    }
    console.error('Error fetching access token:', error);
    throw error;
  }
};

export const getBTSTopTracks = async (retryCount = 0) => {
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
    const tracks = data.tracks || [];
    const validTracks = tracks.filter(track => track.preview_url);
    if (validTracks.length === 0 && retryCount < 3) {
      console.warn(`No valid tracks found, retrying (${retryCount + 1}/3)...`);
      return getBTSTopTracks(retryCount + 1);
    }
    return validTracks;
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