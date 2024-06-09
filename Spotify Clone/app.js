document.addEventListener('DOMContentLoaded', function() {
    const playPauseButton = document.getElementById('play-pause');
    const audioPlayer = document.getElementById('audio-player');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const playAllButton = document.getElementById('play-all');
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
    const libraryLink = document.querySelector('.nav-link[onclick="toggleLibraryContent()"]');
    const libraryContent = document.querySelector('.library-content');
    const mainContent = document.querySelector('main');
    const playlistAudio = document.getElementById('playlist-audio');
    const likedSongsLink = document.querySelector('.nav-link2[href="#"]');
    const likedSongsList = document.createElement('ul');
    likedSongsList.classList.add('liked-songs-list');
    const likeButton = document.createElement('button');
    likeButton.id = 'like-song';
    likeButton.innerHTML = '<i class="far fa-heart"></i>';
    document.querySelector('.album-info').appendChild(likeButton);

    let songs = [
        { id: 1, title: 'Kinna Sona', artist: 'Marjaavaan', src: 'music/Kinna Sona Marjaavaan 320 Kbps.mp3', img: 'img3.jpg', liked: false },
        { id: 2, title: 'Dil Diyan Gallan', artist: 'Tiger Zinda Hai', src: 'music/Dil Diyan Gallan - Tiger Zinda Hai 320 Kbps.mp3', img: 'img5.jpg', liked: false },
        { id: 3, title: 'Chobbar', artist: 'Jordan Sandhu', src: 'music/Chobbar Jordan Sandhu 320 Kbps.mp3', img: 'img2.jpg', liked: false },
        { id: 4, title: 'Chann Warga', artist: 'Surjit Bhullar', src: 'music/Chann Warga - Surjit Bhullar 320 Kbps.mp3', img: 'img4.jpg', liked: false },
        { id: 5, title: '13 Pind', artist: 'Rajvir Jawanda', src: 'music/13 Pind - Rajvir Jawanda 320 Kbps.mp3', img: 'img1.jpg', liked: false },
    ];

    let librarySongs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let currentSong = null;

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

    function playTrendingSong() {
        const trendingSongTitle = document.querySelector('.coverside').textContent;
        const trendingArtist = document.querySelector('.coverside-content1').textContent;
        const trendingAlbumArt = document.querySelector('.playlist-header img').src;
        songTitle.textContent = trendingSongTitle;
        artistName.textContent = trendingArtist;
        albumArt.src = trendingAlbumArt;
        playlistAudio.play();
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        currentSong = { title: trendingSongTitle, artist: trendingArtist, img: trendingAlbumArt, liked: false };
        updateLikeButton();
    }

    function playSong(song) {
        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.img;
        audioPlayer.play();
        playlistAudio.pause();
        playlistAudio.currentTime = 0;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        addToRecentlyPlayed(song);
        addToLibrary(song);
        currentSongIndex = songs.indexOf(song);
        isPlaying = true;
        currentSong = song;
        updateProgressBar();
        updateLikeButton();
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
        const activeAudio = audioPlayer.src ? audioPlayer : playlistAudio;
        setInterval(() => {
            const currentTime = activeAudio.currentTime;
            const duration = activeAudio.duration;
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
        if (audioPlayer.paused && playlistAudio.paused) {
            if (audioPlayer.src) {
                audioPlayer.play();
            } else {
                playlistAudio.play();
            }
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playlistAudio.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        }
    });

    prevButton.addEventListener('click', playPreviousSong);
    nextButton.addEventListener('click', playNextSong);

    audioPlayer.addEventListener('ended', playNextSong);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);

    progressBar.addEventListener('input', function() {
        const activeAudio = audioPlayer.src ? audioPlayer : playlistAudio;
        const duration = activeAudio.duration;
        const seekTime = (progressBar.value / 100) * duration;
        activeAudio.currentTime = seekTime;
    });

    progressBar.addEventListener('mousemove', function() {
        const activeAudio = audioPlayer.src ? audioPlayer : playlistAudio;
        const duration = activeAudio.duration;
        const seekTime = (progressBar.value / 100) * duration;
        activeAudio.currentTime = seekTime;
    });

    libraryLink.addEventListener('click', function() {
        if (libraryContent.style.display === 'block') {
            libraryContent.style.display = 'none';
        } else {
            libraryContent.style.display = 'block';
        }
    });

    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = volumeControl.value / 100;
    });

    playAllButton.addEventListener('click', playTrendingSong);

    document.getElementById('musiclibrary').addEventListener('click', function() {
        var librarySection = document.querySelector('.left .library');
        if (librarySection.style.display === 'none' || librarySection.style.display === '') {
            librarySection.style.display = 'block';
        } else {
            librarySection.style.display = 'none';
        }
    });

    document.querySelector('.library-content ul li:nth-child(4)').addEventListener('click', function() {
        document.querySelector('.favorite-artists').scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelector('.library-content ul li:first-child').addEventListener('click', function() {
        document.querySelector('.recently-played').scrollIntoView({ behavior: 'smooth' });
    });

    // New function to toggle like status of a song
    function toggleLikeSong() {
        if (currentSong) {
            currentSong.liked = !currentSong.liked;
            updateLikeButton();
            updateLikedSongs();
        }
    }

    // New function to update the like button
    function updateLikeButton() {
        likeButton.innerHTML = currentSong && currentSong.liked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    }

    // Update the liked songs list
    function updateLikedSongs() {
        likedSongsList.innerHTML = '';
        const likedSongs = songs.filter(song => song.liked);
        likedSongs.forEach(song => {
            let li = document.createElement('li');
            li.innerHTML = `<img src="${song.img}" alt="${song.title}">
                            <div>
                              <h3>${song.title}</h3>
                              <p>${song.artist}</p>
                            </div>`;
            li.addEventListener('click', () => playSong(song));
            likedSongsList.appendChild(li);
        });
    }

    // Add event listener to the like button
    likeButton.addEventListener('click', toggleLikeSong);

    // Add event listener to the "Liked Songs" link
    likedSongsLink.addEventListener('click', function(event) {
        event.preventDefault();
        mainContent.innerHTML = ''; // Clear main content
        mainContent.appendChild(likedSongsList); // Display liked songs
    });
});

function toggleLibraryContent() {
    const libraryContent = document.querySelector('.library-content');
    libraryContent.style.display = libraryContent.style.display === 'none' ? 'block' : 'none';
}
