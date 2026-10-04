const tracks = [
    {
        id: 1,
        title: "Nevada",
        artist: "Vicetone ft. Cozi Zuehlsdorff",
        album: "Monstercat Best",
        duration: "3:25",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "Spectre",
        artist: "Alan Walker",
        album: "NCS Release",
        duration: "3:48",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "Faded",
        artist: "Alan Walker",
        album: "Different World",
        duration: "3:32",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 4,
        title: "Unity",
        artist: "TheFatRat",
        album: "TheFatRat Essentials",
        duration: "4:08",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: 5,
        title: "Energy",
        artist: "Bensound",
        album: "Acoustic Indie",
        duration: "2:59",
        cover: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=100",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        id: 6,
        title: "Sunny",
        artist: "Bensound",
        album: "Vlog Music",
        duration: "4:21",
        cover: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=100",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// DOM Elements
const audioElement = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const songListEl = document.getElementById('song-list');
const searchInput = document.getElementById('search-input');
const btnPlayAll = document.getElementById('btn-play-all');

const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerHeart = document.getElementById('player-heart');

// Initialize App
function init() {
    renderSongs(tracks);
    loadTrack(currentTrackIndex);

    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleTrackEnd);
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    searchInput.addEventListener('input', handleSearch);
    btnPlayAll.addEventListener('click', () => {
        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
        playTrack();
    });
    playerHeart.addEventListener('click', toggleFavorite);
}

// Render Songs List
function renderSongs(songsToRender) {
    songListEl.innerHTML = '';
    if (songsToRender.length === 0) {
        songListEl.innerHTML = '<p style="padding: 20px; color: #b3b3b3; text-align: center;">Không tìm thấy bài hát nào.</p>';
        return;
    }

    songsToRender.forEach((song, index) => {
        const isFav = favorites.includes(song.id);
        const isCurrent = tracks[currentTrackIndex].id === song.id;
        const songItem = document.createElement('div');
        songItem.className = `song-item ${isCurrent ? 'active' : ''}`;
        songItem.innerHTML = `
            <span class="song-index">${index + 1}</span>
            <div class="song-details">
                <img src="${song.cover}" alt="${song.title}">
                <div class="title-artist">
                    <h5>${song.title}</h5>
                    <p>${song.artist}</p>
                </div>
            </div>
            <span class="album-name">${song.album}</span>
            <span class="song-duration">${song.duration}</span>
        `;
        songItem.addEventListener('click', () => {
            const actualIndex = tracks.findIndex(t => t.id === song.id);
            currentTrackIndex = actualIndex;
            loadTrack(currentTrackIndex);
            playTrack();
            renderSongs(tracks);
        });
        songListEl.appendChild(songItem);
    });
}

// Load Track
function loadTrack(index) {
    const song = tracks[index];
    audioElement.src = song.audioUrl;
    playerCover.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    
    if (favorites.includes(song.id)) {
        playerHeart.className = "fa-solid fa-heart active";
    } else {
        playerHeart.className = "fa-regular fa-heart";
    }
}

// Play / Pause
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    isPlaying = true;
    audioElement.play();
    playIcon.className = "fa-solid fa-pause";
}

function pauseTrack() {
    isPlaying = false;
    audioElement.pause();
    playIcon.className = "fa-solid fa-play";
}

// Next / Prev
function nextTrack() {
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    loadTrack(currentTrackIndex);
    playTrack();
    renderSongs(tracks);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
    renderSongs(tracks);
}

// Progress Bar
function updateProgress() {
    const { duration, currentTime } = audioElement;
    if (isNaN(duration)) return;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    if (!isNaN(duration)) {
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    audioElement.currentTime = (clickX / width) * duration;
}

// Volume
function setVolume() {
    audioElement.volume = volumeSlider.value;
}

// Shuffle & Repeat
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

function handleTrackEnd() {
    if (isRepeat) {
        audioElement.currentTime = 0;
        playTrack();
    } else {
        nextTrack();
    }
}

// Search
function handleSearch(e) {
    const keyword = e.target.value.toLowerCase();
    const filtered = tracks.filter(song => 
        song.title.toLowerCase().includes(keyword) || 
        song.artist.toLowerCase().includes(keyword) ||
        song.album.toLowerCase().includes(keyword)
    );
    renderSongs(filtered);
}

// Favorites
function toggleFavorite() {
    const currentSong = tracks[currentTrackIndex];
    const index = favorites.indexOf(currentSong.id);
    if (index > -1) {
        favorites.splice(index, 1);
        playerHeart.className = "fa-regular fa-heart";
    } else {
        favorites.push(currentSong.id);
        playerHeart.className = "fa-solid fa-heart active";
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderSongs(tracks);
}

// Navigation tabs
const navItems = document.querySelectorAll('.nav-menu li');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        const tab = item.getAttribute('data-tab');
        if (tab === 'favorites') {
            const favSongs = tracks.filter(s => favorites.includes(s.id));
            renderSongs(favSongs);
        } else {
            renderSongs(tracks);
        }
    });
});

// Run init on load
window.addEventListener('DOMContentLoaded', init);
