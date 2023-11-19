import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyPlayer from './SpotifyPlayer'; // Component for playback controls
import PlaylistBrowser from './PlaylistBrowser'; // Component to list and select playlists
import TrackSearch from './TrackSearch'; // Component for searching tracks
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the Spotify token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("https://getspotifytoken.azurewebsites.net");
        console.log('Full response:', response);
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch Spotify token. Please refresh the page or try again later.');
      }
    };    
  
    fetchToken();
  }, []);
  

  // Function to handle selected track from search or playlist
  const handlePlayTrack = (trackUri) => {
    // Call Spotify API to start playback of selected track
    // Implementation depends on your backend setup
  };

  return (
    <div className="app">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {token ? (
        <>
          <SpotifyPlayer token={token} />
          <PlaylistBrowser token={token} onPlayTrack={handlePlayTrack} />
          <TrackSearch token={token} onPlayTrack={handlePlayTrack} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;






