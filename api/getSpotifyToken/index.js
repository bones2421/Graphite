import { post } from 'axios';
import { stringify } from 'querystring';

export default async function (context, req) {
  const code = req.query.code;

  const tokenData = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
  };

  try {
    const response = await post('https://accounts.spotify.com/api/token', stringify(tokenData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    context.res = {
      body: response.data
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: `Error fetching Spotify token: ${error.message}`
    };
  }
};

