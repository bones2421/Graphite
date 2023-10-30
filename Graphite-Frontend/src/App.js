import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [error, setError] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const { data } = await axios.get("https://graphite-function.azurewebsites.net/api/getSpotifyToken");
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        // Setting the expiry time for the access token
        setTokenExpiry(Date.now() + data.expires_in * 1000);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch Spotify token. Please refresh the page or try again later.');
      }
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (tokenExpiry) {
      // Refresh the token 1 minute before it's due to expire
      const timer = setTimeout(() => {
        async function refreshTokenFunc() {
          try {
            const { data } = await axios.get(`https://graphite-function.azurewebsites.net/api/getSpotifyToken?refresh_token=${refreshToken}`);
            setToken(data.access_token);
            setTokenExpiry(Date.now() + data.expires_in * 1000);
          } catch (error) {
            console.error('Error refreshing token:', error);
            setError('Failed to refresh Spotify token.');
          }
        }
        refreshTokenFunc();
      }, tokenExpiry - Date.now() - 60000);

      return () => clearTimeout(timer);  // Clear the timer when the component is unmounted or if tokenExpiry changes
    }
  }, [tokenExpiry, refreshToken]);

  useEffect(() => {
    if (!token) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Your Spotify Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Listener: Check if player is ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setPlayerReady(true);
      });

      // Listener: Handle player connection errors
      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
        setError('Failed to initialize Spotify player.');
      });

      player.connect();
    };
  }, [token]);

  return (
    <div>
      <h1>Spotify Web Playback SDK Example</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {playerReady && <p>Player is connected and ready!</p>}
    </div>
  );
};

export default App;





