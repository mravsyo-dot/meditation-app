// public/audioManager.js
window.AudioManager = (function() {
    let currentAudio = null;
    let currentTrack = null;
    let listeners = {
        onPlay: [],
        onPause: [],
        onProgress: [],
        onDuration: []
    };
    
    function notify(event, data) {
        if (listeners[event]) {
            listeners[event].forEach(fn => fn(data));
        }
    }
    
    return {
        // Инициализация трека
        initTrack(track) {
            if (currentAudio) {
                currentAudio.pause();
            }
            
            currentTrack = track;
            currentAudio = new Audio(track.src);
            currentAudio.preload = 'auto';
            currentAudio.setAttribute('playsinline', 'true');
            currentAudio.volume = 0.7;
            
            currentAudio.addEventListener('loadedmetadata', () => {
                notify('onDuration', currentAudio.duration);
            });
            
            currentAudio.addEventListener('timeupdate', () => {
                notify('onProgress', currentAudio.currentTime);
            });
            
            currentAudio.addEventListener('ended', () => {
                notify('onPause', null);
                notify('onEnd', null);
            });
            
            currentAudio.addEventListener('play', () => {
                notify('onPlay', null);
            });
            
            currentAudio.addEventListener('pause', () => {
                notify('onPause', null);
            });
            
            return true;
        },
        
        // Управление
        async play() {
            if (!currentAudio) return false;
            try {
                await currentAudio.play();
                return true;
            } catch(e) {
                console.error('Play error:', e);
                return false;
            }
        },
        
        pause() {
            if (currentAudio) {
                currentAudio.pause();
            }
        },
        
        seek(time) {
            if (currentAudio) {
                currentAudio.currentTime = time;
            }
        },
        
        setVolume(vol) {
            if (currentAudio) {
                currentAudio.volume = vol;
            }
        },
        
        // Состояние
        isPlaying() {
            return currentAudio ? !currentAudio.paused : false;
        },
        
        getCurrentTrack() {
            return currentTrack;
        },
        
        // Слушатели
        on(event, callback) {
            if (listeners[event]) {
                listeners[event].push(callback);
            }
        },
        
        off(event, callback) {
            if (listeners[event]) {
                listeners[event] = listeners[event].filter(cb => cb !== callback);
            }
        }
    };
})();