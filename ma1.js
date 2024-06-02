// Define playlist array with song IDs in desired order
const playlist = ['bhabi', 'jatt da blood', 'koka', 'vail'];

// Variable to track current song index
let currentSongIndex = 0;


function playSong(songId) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const currentSongElement = document.getElementById('current-song'); // Get the element to display the current song

    let songPath = '';
    let songName = ''; // Variable to store the song name

    switch(songId) {
        case 'bhabi':
            songPath = 'music/Bhabi - Mankirt Aulakh.mp3';  // Replace with actual path
            break;
        case 'jaat da blood':
            songPath = 'music/Jatt Da Blood - Mankirt Aulakh.mp3';  // Replace with actual path
            break;
        case 'koka':
            songPath = 'music/Koka Mankirt Aulakh 320 Kbps.mp3';  // Replace with actual path
            break;
        case 'vail':
            songPath = 'music/Vail Ft. Nimrat Khaira - Mankirt Aulakh.mp3';  // Replace with actual path
            break;
        default:
            console.error('Unknown songId:', songId);
            return;
    }

    audioSource.src = songPath;
    audioPlayer.load();
    audioPlayer.play();

    // Update the current song element with the song name
    currentSongElement.textContent = `Now playing: ${songName}`;

    // Remove 'playing' class from all songs
    document.querySelectorAll('li').forEach(item => {
    item.classList.remove('playing');
    });

    // Add 'playing' class to the current song
    document.getElementById(songId).classList.add('playing');


    console.log('Playing song:', songId);
    console.log('Audio source:', audioSource.src);

    audioPlayer.removeEventListener('ended', playNextSong); // Remove previous event listener
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