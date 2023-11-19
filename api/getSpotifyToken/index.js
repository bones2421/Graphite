import { post } from 'axios';
import { stringify } from 'querystring';

export default async function (context, req) {
  let tokenEndpointData;

  if (req.query.code) {
    tokenEndpointData = {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    };
  } else if (req.query.refresh_token) {
    tokenEndpointData = {
      grant_type: "refresh_token",
      refresh_token: req.query.refresh_token,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    };
  } else {
    context.res = {
      status: 400,
      body: "Invalid request. Either code or refresh_token is required."
    };
    return;
  }

  try {
    const response = await post('https://accounts.spotify.com/api/token', stringify(tokenEndpointData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    context.res = {
      body: response.data
    };
  } catch (error) {
    context.log('Error fetching token:', error.response ? error.response.data : error.message);
    context.res = {
      status: 500,
      body: `Error fetching Spotify token: ${error.response ? error.response.data : error.message}`
    };
  }  
};


