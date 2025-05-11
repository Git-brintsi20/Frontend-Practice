import axios from 'axios';

// Spotify API configuration
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

// Spotify API endpoints
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Store token info
let accessToken = null;
let tokenExpirationTime = 0;

/**
 * Get access token using Client Credentials flow
 * @returns {Promise<string>} Access token
 */
const getAccessToken = async () => {
  // Check if we have a valid token already
  if (accessToken && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  try {
    // Request new token
    const response = await axios({
      method: 'post',
      url: SPOTIFY_AUTH_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      },
      data: 'grant_type=client_credentials'
    });

    // Save token and expiration time
    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + (response.data.expires_in * 1000) - 60000; // Remove 1 minute buffer
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
};

/**
 * Get track details from Spotify
 * @param {string} trackId Spotify track ID
 * @returns {Promise<Object>} Track details
 */
export const getTrackDetails = async (trackId) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      `${SPOTIFY_API_BASE}/tracks/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting track details:', error);
    throw error;
  }
};

/**
 * Search for BTS songs on Spotify
 * @param {string} query Search query
 * @returns {Promise<Array>} List of track results
 */
export const searchBTSSongs = async (query) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      `${SPOTIFY_API_BASE}/search`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: `artist:BTS ${query}`,
          type: 'track',
          limit: 10
        }
      }
    );
    
    return response.data.tracks.items;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
};

/**
 * Get track preview URL
 * @param {string} trackId Spotify track ID
 * @returns {Promise<string|null>} Preview URL or null if unavailable
 */
export const getTrackPreviewUrl = async (trackId) => {
  try {
    const trackDetails = await getTrackDetails(trackId);
    return trackDetails.preview_url;
  } catch (error) {
    console.error('Error getting preview URL:', error);
    return null;
  }
};

/**
 * Get artist's top tracks
 * @param {string} artistId Spotify artist ID
 * @param {string} [country='US'] Country code
 * @returns {Promise<Array>} List of top tracks
 */
export const getArtistTopTracks = async (artistId, country = 'US') => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          market: country
        }
      }
    );
    
    return response.data.tracks;
  } catch (error) {
    console.error('Error getting artist top tracks:', error);
    throw error;
  }
};

// BTS artist ID on Spotify
export const BTS_ARTIST_ID = '3Nrfpe0tUJi4K4DXYWgMUX';

/**
 * Get BTS top tracks
 * @returns {Promise<Array>} List of BTS top tracks
 */
export const getBTSTopTracks = async () => {
  return getArtistTopTracks(BTS_ARTIST_ID);
};

export default {
  getAccessToken,
  getTrackDetails,
  searchBTSSongs,
  getTrackPreviewUrl,
  getArtistTopTracks,
  getBTSTopTracks
};