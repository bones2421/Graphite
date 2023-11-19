import React, { useState } from 'react';
import axios from 'axios';

const TrackSearch = ({ token, onPlayTrack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setResults(response.data.tracks.items);
        })
        .catch(error => console.error('Error searching tracks:', error));
    };

    return (
        <div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            {results.map(track => (
                <div key={track.id} onClick={() => onPlayTrack(track.uri)}>
                    {track.name}
                </div>
            ))}
        </div>
    );
};

export default TrackSearch;
