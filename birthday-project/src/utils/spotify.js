const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_ENDPOINT = 'https://api.spotify.com/v1';
const BTS_PLAYLIST_ID = '37i9dQZF1DX1aTxiF1r6Xy'; // BTS Playlist ID
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
    console.log('Access token obtained:', accessToken);
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
    let tracks = [];

    // 1. Fetch tracks from BTS playlist
    const playlistResponse = await fetch(`${API_ENDPOINT}/playlists/${BTS_PLAYLIST_ID}/tracks?market=global`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!playlistResponse.ok) {
      throw new Error(`Failed to fetch playlist tracks: ${playlistResponse.status} ${playlistResponse.statusText}`);
    }

    const playlistData = await playlistResponse.json();
    tracks = playlistData.items?.map((item) => item.track).filter((track) => track && track.id) || [];

    console.log('Playlist tracks:', tracks);
    console.log('Playlist tracks with preview URLs:', tracks.filter((track) => track.preview_url));

    // 2. If no tracks with previews, try search
    if (tracks.every((track) => !track.preview_url)) {
      console.warn('No preview URLs in playlist, searching for BTS tracks...');
      const searchResponse = await fetch(`${API_ENDPOINT}/search?q=artist:BTS&type=track&market=global&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!searchResponse.ok) {
        throw new Error(`Failed to search tracks: ${searchResponse.status} ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      tracks = searchData.tracks?.items || [];
      console.log('Search tracks:', tracks);
      console.log('Search tracks with preview URLs:', tracks.filter((track) => track.preview_url));
    }

    if (tracks.length === 0) {
      throw new Error('No tracks found.');
    }

    return tracks;
  } catch (error) {
    if (retryCount < 3) {
      console.warn(`Retrying track fetch (${retryCount + 1}/3)...`);
      return getBTSTopTracks(retryCount + 1);
    }
    console.error('Error fetching BTS tracks:', error);
    throw error;
  }
};

export const getTrackPreviewUrl = async (trackId) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${API_ENDPOINT}/tracks/${trackId}?market=global`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch track preview: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.preview_url || null;
  } catch (error) {
    console.error('Error fetching track preview URL:', error);
    throw error;
  }
};