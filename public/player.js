// public/player.js
(function() {
    console.log('Player script loaded');
    
    let currentAudio = null;
    let currentTrackId = null;
    
    // Инициализация плеера
    window.initPlayer = function(trackId, trackSrc, trackTitle, trackIcon) {
        console.log('Init player:', trackId, trackSrc);
        
        // Останавливаем текущий
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        // Создаем новый audio элемент
        const audio = new Audio(trackSrc);
        audio.preload = 'auto';
        audio.setAttribute('playsinline', 'true');
        audio.volume = 0.7;
        
        // Обработчики
        audio.addEventListener('loadedmetadata', function() {
            console.log('Loaded metadata, duration:', audio.duration);
            const durationElem = document.getElementById('playerDuration');
            if (durationElem) {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                durationElem.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        });
        
        audio.addEventListener('timeupdate', function() {
            const progress = (audio.currentTime / audio.duration) * 100;
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                progressBar.value = progress;
            }
        });
        
        audio.addEventListener('ended', function() {
            const playBtn = document.getElementById('playPauseBtn');
            if (playBtn) playBtn.textContent = '▶️';
        });
        
        audio.addEventListener('play', function() {
            const playBtn = document.getElementById('playPauseBtn');
            if (playBtn) playBtn.textContent = '⏸️';
        });
        
        audio.addEventListener('pause', function() {
            const playBtn = document.getElementById('playPauseBtn');
            if (playBtn) playBtn.textContent = '▶️';
        });
        
        currentAudio = audio;
        currentTrackId = trackId;
        
        // Показываем плеер
        const playerDiv = document.getElementById('player');
        if (playerDiv) {
            playerDiv.style.display = 'block';
        }
        
        // Обновляем UI
        const iconElem = document.getElementById('playerIcon');
        const titleElem = document.getElementById('playerTitle');
        if (iconElem) iconElem.textContent = trackIcon;
        if (titleElem) titleElem.textContent = trackTitle;
        
        console.log('Player initialized successfully');
    };
    
    // Play/Pause
    window.togglePlayPause = function() {
        console.log('Toggle play/pause');
        
        if (!currentAudio) {
            alert('Сначала выберите трек');
            return;
        }
        
        if (currentAudio.paused) {
            const playPromise = currentAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Play error:', error);
                    alert('Нажмите еще раз для воспроизведения');
                });
            }
        } else {
            currentAudio.pause();
        }
    };
    
    // Seek
    window.seek = function(value) {
        if (currentAudio && currentAudio.duration) {
            const time = (value / 100) * currentAudio.duration;
            currentAudio.currentTime = time;
        }
    };
    
    // Volume
    window.setVolume = function(value) {
        if (currentAudio) {
            currentAudio.volume = value / 100;
        }
    };
    
    console.log('Player API ready');
})();