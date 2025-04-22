const axios = require('axios');

exports.handler = async (event, context) => {
    const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

    try {
        // Step 1: Refresh the access token
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: SPOTIFY_REFRESH_TOKEN,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        return {
            statusCode: 200,
            body: accessToken
        };

        // Step 2: Fetch currently playing track
        const currentlyPlayingResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (currentlyPlayingResponse.status === 204 || !currentlyPlayingResponse.data) {
            // No track is currently playing
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    currentlyPlaying: false,
                    name: track.name,
                    artist: track.artists.map((artist) => artist.name).join(', '),
                    url: track.external_urls.spotify,
                }),
            };
        }

        const track = currentlyPlayingResponse.data.item;

        // Return the currently playing track details
        return {
            statusCode: 200,
            body: JSON.stringify({
                currentlyPlaying: true,
                name: track.name,
                artist: track.artists.map((artist) => artist.name).join(', '),
                url: track.external_urls.spotify,
            }),
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
