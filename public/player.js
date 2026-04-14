// public/player.js
(function() {
    console.log('Player script loaded');
    
    let currentAudio = null;
    let currentTrack = null;
    
    // Глобальные функции для вызова из React
    window.Player = {
        initTrack(track) {
            console.log('Init track:', track.title);
            
            if (currentAudio) {
                currentAudio.pause();
            }
            
            currentTrack = track;
            currentAudio = new Audio(track.src);
            currentAudio.preload = 'auto';
            currentAudio.setAttribute('playsinline', 'true');
            currentAudio.volume = 0.7;
            
            // Обновляем UI плеера
            const playerDiv = document.getElementById('playerContainer');
            if (playerDiv) {
                playerDiv.style.display = 'block';
            }
            
            const iconSpan = document.getElementById('playerIcon');
            const titleSpan = document.getElementById('playerTitle');
            if (iconSpan) iconSpan.textContent = track.icon;
            if (titleSpan) titleSpan.textContent = track.title;
            
            // Обработчики
            currentAudio.addEventListener('timeupdate', () => {
                const progressBar = document.getElementById('progressBar');
                if (progressBar && currentAudio.duration) {
                    const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
                    progressBar.value = percent;
                }
                
                const currentTimeSpan = document.getElementById('currentTime');
                if (currentTimeSpan) {
                    const mins = Math.floor(currentAudio.currentTime / 60);
                    const secs = Math.floor(currentAudio.currentTime % 60);
                    currentTimeSpan.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                }
            });
            
            currentAudio.addEventListener('loadedmetadata', () => {
                const durationSpan = document.getElementById('duration');
                if (durationSpan) {
                    const mins = Math.floor(currentAudio.duration / 60);
                    const secs = Math.floor(currentAudio.duration % 60);
                    durationSpan.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                }
            });
            
            currentAudio.addEventListener('play', () => {
                const playBtn = document.getElementById('playPauseBtn');
                if (playBtn) playBtn.textContent = '⏸️';
            });
            
            currentAudio.addEventListener('pause', () => {
                const playBtn = document.getElementById('playPauseBtn');
                if (playBtn) playBtn.textContent = '▶️';
            });
            
            currentAudio.addEventListener('ended', () => {
                const playBtn = document.getElementById('playPauseBtn');
                if (playBtn) playBtn.textContent = '▶️';
            });
        },
        
        async togglePlay() {
            if (!currentAudio) {
                alert('Сначала выберите трек');
                return;
            }
            
            if (currentAudio.paused) {
                try {
                    await currentAudio.play();
                } catch(e) {
                    console.error('Play error:', e);
                    alert('Нажмите еще раз');
                }
            } else {
                currentAudio.pause();
            }
        },
        
        seek(value) {
            if (currentAudio && currentAudio.duration) {
                const time = (value / 100) * currentAudio.duration;
                currentAudio.currentTime = time;
            }
        },
        
        setVolume(value) {
            if (currentAudio) {
                currentAudio.volume = value;
            }
        }
    };
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM ready, player initialized');
        });
    } else {
        console.log('Player ready');
    }
})();