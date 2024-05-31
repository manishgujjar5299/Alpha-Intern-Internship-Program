document.addEventListener('DOMContentLoaded', function() {
    const playPauseButton = document.getElementById('play-pause');
    const audioPlayer = document.getElementById('audio-player');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const playAllButton = document.getElementById('play-all');
    const libraryLink = document.getElementById('library-link');
    const librarySection = document.getElementById('library-section');
    const playlistSection = document.getElementById('playlist-section');
    const songList = document.querySelector('.song-list');
    const libraryList = document.querySelector('.library-list');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume-control');

    let songs = [
        { title: 'Kinna Sona', artist: 'Marjaavaan', src: 'Kinna Sona Marjaavaan 320 Kbps.mp3', img: 'img3.jpg' },
        { title: 'Dil Diyan Gallan', artist: 'Tiger Zinda Hai', src: 'Dil Diyan Gallan - Tiger Zinda Hai 320 Kbps.mp3', img: 'img5.jpg' },
        { title: 'Chobbar', artist: 'Jordan Sandhu', src: 'Chobbar Jordan Sandhu 320 Kbps.mp3', img: 'img2.jpg' },
        { title: 'Chann Warga', artist: 'Surjit Bhullar', src: 'Chann Warga - Surjit Bhullar 320 Kbps.mp3', img: 'img4.jpg' },
        { title: '13 Pind', artist: 'Rajvir Jawanda', src: '13 Pind - Rajvir Jawanda 320 Kbps.mp3', img: 'img1.jpg' },
        // { title: 'Chal Chaliye', artist: 'Sajid Ali', src: 'Chal Chaliye Sajjad Ali 320 Kbps.mp3', img: 'img7.jpg'}
    ];

    let librarySongs = [];
    let currentSongIndex = 0;
    let isPlaying = false;

    songs.forEach(song => {
        let li = document.createElement('li');
        li.innerHTML = `<img src="${song.img}" alt="${song.title}">
                        <div>
                          <h3>${song.title}</h3>
                          <p>${song.artist}</p>
                        </div>`;
        li.addEventListener('click', () => playSong(song));
        songList.appendChild(li);
    });

    function playSong(song) {
        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.img;
        audioPlayer.play();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        addToRecentlyPlayed(song);
        addToLibrary(song);
        currentSongIndex = songs.indexOf(song);
        isPlaying = true;
        updateProgressBar();
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(songs[currentSongIndex]);
    }

    function playPreviousSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(songs[currentSongIndex]);
    }

    function addToRecentlyPlayed(song) {
        let recentlyPlayed = document.querySelector('.rectangle-grid');
        let div = document.createElement('div');
        div.classList.add('rectangle-item');
        div.innerHTML = `<div class="rectangle" style="background-image: url('${song.img}');"></div>
                         <p>${song.title}</p>`;
        recentlyPlayed.appendChild(div);

          // Remove the oldest song if there are already 5 songs
          if (recentlyPlayed.childElementCount >= 4) {
            recentlyPlayed.removeChild(recentlyPlayed.firstChild);
        }
        
        recentlyPlayed.appendChild(div);
    }
    

    function addToLibrary(song) {
        if (!librarySongs.includes(song)) {
            librarySongs.push(song);
            let li = document.createElement('li');
            li.innerHTML = `<img src="${song.img}" alt="${song.title}">
                            <div>
                              <h3>${song.title}</h3>
                              <p>${song.artist}</p>
                            </div>`;
            libraryList.appendChild(li);
        }
    }

    function updateProgressBar() {
        setInterval(() => {
            const currentTime = audioPlayer.currentTime;
            const duration = audioPlayer.duration;
            progressBar.value = (currentTime / duration) * 100;

            currentTimeElement.textContent = formatTime(currentTime);
            durationElement.textContent = formatTime(duration);
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    playPauseButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        }
    });

    prevButton.addEventListener('click', playPreviousSong);
    nextButton.addEventListener('click', playNextSong);

    audioPlayer.addEventListener('ended', playNextSong);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);

    // Allow user to seek through the song
    progressBar.addEventListener('input', function() {
        const duration = audioPlayer.duration;
        const seekTime = (progressBar.value / 100) * duration;
        audioPlayer.currentTime = seekTime;
    });

    // Update the progress bar on mouse move
    progressBar.addEventListener('mousemove', function() {
        const duration = audioPlayer.duration;
        const seekTime = (progressBar.value / 100) * duration;
        audioPlayer.currentTime = seekTime;
    });


    libraryLink.addEventListener('click', function() {
        librarySection.style.display = 'block';
        playlistSection.style.display = 'none';
    });

    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = volumeControl.value / 100;
    });

     // Play all songs button
     playAllButton.addEventListener('click', function() {
        currentSongIndex = 0;
        playSong(songs[currentSongIndex]);
    });
});
// document.getElementById('musiclibrary').addEventListener('click', function() {
//     var librarySection = document.querySelector('.left .library');
//     if (librarySection.style.display === 'none' || librarySection.style.display === '') {
//       librarySection.style.display = 'block';
//     } else {
//       librarySection.style.display = 'none';
//     }
//   });
  