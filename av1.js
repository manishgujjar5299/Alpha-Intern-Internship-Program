// Define playlist array with song IDs in desired order
const playlist = ['chann sitare', 'teri jatti', 'saade kothe utte', 'khabbi seat'];

// Variable to track current song index
let currentSongIndex = 0;


function playSong(songId) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    let songPath = '';

    switch(songId) {
        case 'chann sitare':
            songPath = 'music/Chann Sitare - Ammy Virk.mp3';  // Replace with actual path
            break;
        case 'teri jatti':
            songPath = 'music/Teri Jatti - Ammy Virk.mp3';  // Replace with actual path
            break;
        case 'saade kothe utte':
            songPath = 'music/Saade Kothe Utte - DjPunjab.Com.Se.mp3';  // Replace with actual path
            break;
        case 'khabbi seat':
            songPath = 'music/Khabbi Seat - Ammy Virk.mp3';  // Replace with actual path
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