import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch the token from your server (Azure Function)
    async function fetchToken() {
      try {
        const { data } = await axios.get("/api/getSpotifyToken"); // Replace with your Azure Function endpoint
        setToken(data.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    fetchToken();

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Your Spotify Player',
        getOAuthToken: cb => { cb(token); }
      });

      player.connect();
    };
  }, [token]);

  return (
    <div>
      <h1>Spotify Web Playback SDK Example</h1>
    </div>
  );
};

export default App;



