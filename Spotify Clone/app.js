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
    const homeLink = document.querySelector('.nav-link[href="#"]');
    const searchLink = document.querySelector('.nav-link[href="#"]');
    const createPlaylistLink = document.querySelector('.nav-link2[href="#"]');
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
        let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        
        // Remove the song if it's already in the list
        recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
        
        // Add the song to the beginning of the list
        recentlyPlayed.unshift(song);
        
        // Keep only the last 4 songs
        recentlyPlayed = recentlyPlayed.slice(0, 4);
        
        // Save to localStorage
        localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
        
        // Update the UI
        updateRecentlyPlayedUI(recentlyPlayed);
    }

    function updateRecentlyPlayedUI(recentlyPlayed) {
        let recentlyPlayedElement = document.querySelector('.rectangle-grid');
        recentlyPlayedElement.innerHTML = '';
        recentlyPlayed.forEach(song => {
            let div = document.createElement('div');
            div.classList.add('rectangle-item');
            div.innerHTML = `<div class="rectangle" style="background-image: url('${song.img}');"></div>
                             <p>${song.title}</p>`;
            recentlyPlayedElement.appendChild(div);
        });
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
        libraryContent.style.display = libraryContent.style.display === 'block' ? 'none' : 'block';
    });

    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = volumeControl.value / 100;
    });

    playAllButton.addEventListener('click', playTrendingSong);

    document.getElementById('musiclibrary').addEventListener('click', function() {
        var librarySection = document.querySelector('.left .library');
        librarySection.style.display = (librarySection.style.display === 'none' || librarySection.style.display === '') ? 'block' : 'none';
    });

    document.querySelector('.library-content ul li:nth-child(4)').addEventListener('click', function() {
        document.querySelector('.favorite-artists').scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelector('.library-content ul li:first-child').addEventListener('click', function() {
        document.querySelector('.recently-played').scrollIntoView({ behavior: 'smooth' });
    });

    function toggleLikeSong() {
        if (currentSong) {
            currentSong.liked = !currentSong.liked;
            updateLikeButton();
            updateLikedSongs();
            
            // Update the song in the songs array
            const songIndex = songs.findIndex(song => song.id === currentSong.id);
            if (songIndex !== -1) {
                songs[songIndex].liked = currentSong.liked;
            }
            
            // Save liked songs to localStorage
            saveLikedSongs();
        }
    }

    function updateLikeButton() {
        if (currentSong && currentSong.liked) {
            likeButton.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
        } else {
            likeButton.innerHTML = '<i class="far fa-heart"></i>';
        }
    }

    function saveLikedSongs() {
        const likedSongs = songs.filter(song => song.liked);
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }

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
        
        // Update the count in the sidebar
        const likedSongsCount = document.querySelector('.nav-link2[href="#"] span');
        if (likedSongsCount) {
            likedSongsCount.textContent = `(${likedSongs.length})`;
        }
    }

    function loadLikedSongs() {
        const likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        likedSongs.forEach(likedSong => {
            const song = songs.find(s => s.id === likedSong.id);
            if (song) {
                song.liked = true;
            }
        });
        updateLikedSongs();
    }

    likeButton.addEventListener('click', toggleLikeSong);

    likedSongsLink.addEventListener('click', function(event) {
        event.preventDefault();
        mainContent.innerHTML = ''; // Clear main content
        mainContent.appendChild(likedSongsList); // Display liked songs
    });

    function showHome() {
        mainContent.innerHTML = '<h1>Home</h1><p>Welcome to your Spotify clone!</p>';
    }

    function showSearch() {
        mainContent.innerHTML = '<h1>Search</h1><input type="text" placeholder="Search for songs, artists, or albums">';
    }

    function showLibrary() {
        mainContent.innerHTML = '<h1>Your Library</h1>';
        mainContent.appendChild(libraryList);
    }

    function createPlaylist() {
        mainContent.innerHTML = '<h1>Create Playlist</h1><p>Feature coming soon!</p>';
    }

    homeLink.addEventListener('click', function(event) {
        event.preventDefault();
        showHome();
    });

    searchLink.addEventListener('click', function(event) {
        event.preventDefault();
        showSearch();
    });

    libraryLink.addEventListener('click', function(event) {
        event.preventDefault();
        showLibrary();
    });

    createPlaylistLink.addEventListener('click', function(event) {
        event.preventDefault();
        createPlaylist();
    });

    // Load liked songs and recently played on startup
    loadLikedSongs();
    let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
    updateRecentlyPlayedUI(recentlyPlayed);

    // Modify the "Liked Songs" link in the sidebar to show the count
    likedSongsLink.innerHTML += ' <span>(0)</span>';
});

function toggleLibraryContent() {
    const libraryContent = document.querySelector('.library-content');
    libraryContent.style.display = libraryContent.style.display === 'none' ? 'block' : 'none';
}