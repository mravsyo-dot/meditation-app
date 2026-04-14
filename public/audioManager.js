// public/audioManager.js
window.AudioManager = (function() {
    let currentAudio = null;
    let currentTrack = null;
    let listeners = {
        onPlay: [],
        onPause: [],
        onProgress: [],
        onDuration: [],
        onTrackChange: []
    };
    
    function notify(event, data) {
        if (listeners[event]) {
            listeners[event].forEach(fn => fn(data));
        }
    }
    
    function updateUI() {
        const playBtn = document.getElementById('nativePlayBtn');
        if (playBtn && currentAudio) {
            playBtn.textContent = currentAudio.paused ? '▶️' : '⏸️';
        }
        
        const progressBar = document.getElementById('nativeProgressBar');
        if (progressBar && currentAudio && currentAudio.duration) {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.value = progress;
        }
    }
    
    return {
        initTrack(track) {
            console.log('initTrack called', track.title);
            
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            
            currentTrack = track;
            currentAudio = new Audio(track.src);
            currentAudio.preload = 'auto';
            currentAudio.setAttribute('playsinline', 'true');
            currentAudio.volume = 0.7;
            
            currentAudio.addEventListener('loadedmetadata', () => {
                notify('onDuration', currentAudio.duration);
                updateUI();
            });
            
            currentAudio.addEventListener('timeupdate', () => {
                notify('onProgress', currentAudio.currentTime);
                updateUI();
            });
            
            currentAudio.addEventListener('ended', () => {
                notify('onPause', null);
                updateUI();
            });
            
            currentAudio.addEventListener('play', () => {
                notify('onPlay', null);
                updateUI();
            });
            
            currentAudio.addEventListener('pause', () => {
                notify('onPause', null);
                updateUI();
            });
            
            notify('onTrackChange', track);
            updateUI();
            
            const playerDiv = document.getElementById('nativePlayer');
            if (playerDiv) {
                playerDiv.style.display = 'block';
            }
            
            return true;
        },
        
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
        
        toggle() {
            if (!currentAudio) return;
            if (currentAudio.paused) {
                this.play();
            } else {
                this.pause();
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
        
        isPlaying() {
            return currentAudio ? !currentAudio.paused : false;
        },
        
        getCurrentTrack() {
            return currentTrack;
        },
        
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

window.initTrack = function(trackId, trackSrc, trackTitle, trackIcon) {
    window.AudioManager.initTrack({
        id: trackId,
        title: trackTitle,
        src: trackSrc,
        icon: trackIcon
    });
};

window.togglePlayPause = function() {
    window.AudioManager.toggle();
};

window.seekAudio = function(value) {
    window.AudioManager.seek(parseFloat(value));
};

window.changeVolume = function(value) {
    window.AudioManager.setVolume(parseFloat(value));
};