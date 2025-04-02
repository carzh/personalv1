const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    // Get Spotify Access Token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch Currently Playing Track
    const currentlyPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (currentlyPlayingResponse.status === 204 || currentlyPlayingResponse.status === 404) {
        // No active playback or no track available
        return {
            statusCode: 200,
            body: JSON.stringify({ currentlyPlaying: false }),
        };
    }

    const currentlyPlayingData = await currentlyPlayingResponse.json();

    if (currentlyPlayingData.is_playing) {
        const track = currentlyPlayingData.item;
        return {
            statusCode: 200,
            body: JSON.stringify({
                currentlyPlaying: true,
                name: track.name,
                artist: track.artists[0].name,
                url: track.external_urls.spotify,
            }),
        };
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                currentlyPlaying: false,
                name: track.name,
                artist: track.artists[0].name,
                url: track.external_urls.spotify,
            }),
        };
    }
};
