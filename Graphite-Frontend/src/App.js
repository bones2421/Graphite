import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [player, setPlayer] = useState(null);

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

  useEffect(() => {
    if (!token) return;

    const spotifyPlayer = new window.Spotify.Player({
      name: 'Simple Spotify Player',
      getOAuthToken: cb => { cb(token); }
    });

    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setPlayerReady(true);
      setPlayer(spotifyPlayer);
    });

    spotifyPlayer.connect();

    return () => {
      spotifyPlayer.disconnect();
    };
  }, [token]);

  const handlePlay = () => {
    if (player) player.togglePlay();
  };

  const handleNext = () => {
    if (player) player.nextTrack();
  };

  const handlePrev = () => {
    if (player) player.previousTrack();
  };

  return (
    <div>
     
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {playerReady ? (
        <div>
          <button onClick={handlePlay}>Play/Pause</button>
          <button onClick={handlePrev}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      ) : (
       
      )}
    </div>
  );
};

export default App;






