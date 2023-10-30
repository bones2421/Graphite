import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const { data } = await axios.get("https://getspotifytoken.azurewebsites.net");
        setToken(data.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch Spotify token. Please refresh the page or try again later.');
      }
    }
    fetchToken();
  }, []);

  return (
    <div>
      <h1>Spotify Web Playback SDK Example</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {playerReady && <p>Player is connected and ready!</p>}
    </div>
  );
};

export default App;








