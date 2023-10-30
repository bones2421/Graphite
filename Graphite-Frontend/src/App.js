import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);

  // Fetching the Spotify token
  useEffect(() => {
    async function fetchToken() {
      try {
        const { data } = await axios.get("https://getspotifytoken.azurewebsites.net");
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setTokenExpiry(Date.now() + data.expires_in * 1000);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch Spotify token. Please refresh the page or try again later.');
      }
    }

    fetchToken();
  }, []);

  // Handling token expiry and refreshing it
  useEffect(() => {
    if (tokenExpiry) {
      const timer = setTimeout(() => {
        async function refreshTokenFunc() {
          try {
            const { data } = await axios.get(`https://getspotifytoken.azurewebsites.net?refresh_token=${refreshToken}`);
            setToken(data.access_token);
            setTokenExpiry(Date.now() + data.expires_in * 1000);
          } catch (error) {
            console.error('Error refreshing token:', error);
            setError('Failed to refresh Spotify token.');
          }
        }
        refreshTokenFunc();
      }, tokenExpiry - Date.now() - 60000);

      return () => clearTimeout(timer);
    }
  }, [tokenExpiry, refreshToken]);

  // Initialize Spotify Player when token is fetched
  useEffect(() => {
    if (window.player || !token) return;

    if (window.Spotify && window.Spotify.Player) {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Your Spotify Player',
        getOAuthToken: cb => { cb(token); }
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setPlayerReady(true);
        setPlayer(spotifyPlayer);
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error(message);
        setError('Failed to initialize Spotify player.');
      });

      spotifyPlayer.connect();
    }
  }, [token]);

  const playSampleTrack = () => {
    if (!player) return;

    player.togglePlay().then(() => {
      console.log('Toggled playback!');
    });
  };

  return (
    <div>
      <h1>Spotify Web Playback SDK Example</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {playerReady && <div>
        <p>Player is connected and ready!</p>
        <button onClick={playSampleTrack}>Play/Pause Sample Track</button>
      </div>}
    </div>
  );
};

export default App;







