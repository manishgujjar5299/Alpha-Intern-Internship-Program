// Define playlist array with song IDs in desired order
const playlist = ['tareefan', 'tuteSharab', 'snowfall', 'enemy'];

// Variable to track current song index
let currentSongIndex = 0;


function playSong(songId) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    let songPath = '';

    switch(songId) {
        case 'tareefan':
            songPath = 'music/Tareefan Jordan Sandhu 320 Kbps.mp3';  // Replace with actual path
            break;
        case 'tuteSharab':
            songPath = 'music/Tu Te Sharab_320(PagalWorld.com.sb).mp3';  // Replace with actual path
            break;
        case 'snowfall':
            songPath = 'music/Snowfall Jordan Sandhu 320 Kbps.mp3';  // Replace with actual path
            break;
        case 'enemy':
            songPath = 'music/Enemy - Jordan Sandhu 320 Kbps.mp3';  // Replace with actual path
            break;
        default:
            console.error('Unknown songId:', songId);
            return;
    }

    audioSource.src = songPath;
    audioPlayer.load();
    audioPlayer.play();

    console.log('Playing song:', songId);
    console.log('Audio source:', audioSource.src);

    audioPlayer.addEventListener('ended', playNextSong);

    const backButton = document.getElementById('back-button');
    if (backButton && !backButton.dataset.listenerAdded) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';  // Replace with the path to your file
        });
        backButton.dataset.listenerAdded = true;  // Mark that the listener has been added
    }
}



function playNextSong() {
    // Increment current song index
    currentSongIndex++;

    // Check if reached end of playlist, if so, loop back to beginning
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }

    // Get next song from playlist and play it
    const nextSongId = playlist[currentSongIndex];
    playSong(nextSongId);
}

// Initially play the first song when page loads
playSong(playlist[currentSongIndex]);