// public/player.js
(function() {
    console.log('Global player loaded');
    
    let currentAudio = null;
    let currentTrackId = null;
    
    window.initPlayer = function(trackId, trackSrc, trackTitle, trackIcon) {
        console.log('Init player:', trackId, trackSrc);
        
        // Останавливаем старый
        if (currentAudio) {
            currentAudio.pause();
        }
        
        // Создаем новый аудио элемент
        const audio = new Audio(trackSrc);
        audio.setAttribute('playsinline', 'true');
        audio.preload = 'auto';
        
        currentAudio = audio;
        currentTrackId = trackId;
        
        // Обновляем UI
        document.getElementById('playerIcon').textContent = trackIcon;
        document.getElementById('playerTitle').textContent = trackTitle;
        document.getElementById('player').style.display = 'block';
        document.getElementById('playPauseBtn').textContent = '▶️';
        
        // Обработчики
        audio.addEventListener('timeupdate', function() {
            const progress = (audio.currentTime / audio.duration) * 100;
            const progressBar = document.getElementById('progressBar');
            if (progressBar) progressBar.value = progress;
        });
        
        audio.addEventListener('ended', function() {
            document.getElementById('playPauseBtn').textContent = '▶️';
        });
    };
    
    window.togglePlayPause = function() {
        const btn = document.getElementById('playPauseBtn');
        
        if (!currentAudio) {
            alert('Сначала выберите трек');
            return;
        }
        
        if (currentAudio.paused) {
            currentAudio.play()
                .then(() => {
                    btn.textContent = '⏸️';
                    console.log('Playing');
                })
                .catch(e => {
                    console.error('Play error:', e);
                    alert('Нажмите еще раз');
                });
        } else {
            currentAudio.pause();
            btn.textContent = '▶️';
        }
    };
    
    window.seek = function(value) {
        if (currentAudio) {
            const time = (value / 100) * currentAudio.duration;
            currentAudio.currentTime = time;
        }
    };
})();