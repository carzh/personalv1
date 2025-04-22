async function fetchSpotifyData() {
    try {
        // Fetch song data from your Netlify function
        const response = await fetch('/.netlify/functions/spotify');
        
        if (!response.ok) {
            throw new Error('Failed to fetch Spotify data' + response.text);
        }

        const data = await response.json();

        // Get the <li> element where the song will be displayed
        const songListItem = document.getElementById('spotify-song-list');

        if (data.currentlyPlaying) {
            // User is actively listening to a song
            const songLink = document.createElement('a');
            songLink.href = data.url;
            songLink.target = '_blank';
            songLink.textContent = `${data.name} by ${data.artist}`;
            
            songListItem.textContent = 'currently listening to ';
            songListItem.appendChild(songLink);
        } else {
            // User is not actively listening; fallback to last played
            const songLink = document.createElement('a');
            songLink.href = data.url;
            songLink.target = '_blank';
            songLink.textContent = `${data.name} by ${data.artist}`;
            
            songListItem.textContent = 'last listened to ';
            songListItem.appendChild(songLink);
        }
    } catch (error) {
        console.error('Error fetching or displaying Spotify data:', error);
        // Hide the <li> in case of an error
        const songListItem = document.getElementById('spotify-song-list');
        songListItem.style.display = 'none';
    }
}

// Call the function to display Spotify data
fetchSpotifyData();
