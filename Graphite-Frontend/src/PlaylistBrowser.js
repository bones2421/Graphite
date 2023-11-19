import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaylistBrowser = ({ token, onPlayTrack }) => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setPlaylists(response.data.items);
        })
        .catch(error => console.error('Error fetching playlists:', error));
    }, [token]);

    return (
        <div>
            {playlists.map(playlist => (
                <div key={playlist.id} onClick={() => onPlayTrack(playlist.uri)}>
                    {playlist.name}
                </div>
            ))}
        </div>
    );
};

export default PlaylistBrowser;
