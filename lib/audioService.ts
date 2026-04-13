// lib/audioService.ts
class AudioService {
  private audio: HTMLAudioElement | null = null;
  private onTimeUpdate: ((time: number) => void) | null = null;
  private onDurationChange: ((duration: number) => void) | null = null;
  private onEnded: (() => void) | null = null;

  init(src: string) {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    
    this.audio = new Audio(src);
    // Устанавливаем атрибуты через setAttribute для TypeScript
    this.audio.setAttribute('playsInline', 'true');
    this.audio.preload = 'auto';
    
    // Вешаем обработчики
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate && this.audio) {
        this.onTimeUpdate(this.audio.currentTime);
      }
    });
    
    this.audio.addEventListener('durationchange', () => {
      if (this.onDurationChange && this.audio) {
        this.onDurationChange(this.audio.duration);
      }
    });
    
    this.audio.addEventListener('ended', () => {
      if (this.onEnded) this.onEnded();
    });
  }

  setCallbacks(callbacks: {
    onTimeUpdate: (time: number) => void;
    onDurationChange: (duration: number) => void;
    onEnded: () => void;
  }) {
    this.onTimeUpdate = callbacks.onTimeUpdate;
    this.onDurationChange = callbacks.onDurationChange;
    this.onEnded = callbacks.onEnded;
  }

  async play() {
    if (!this.audio) return false;
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.error('Playback error:', error);
      return false;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  setCurrentTime(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  getCurrentTime() {
    return this.audio?.currentTime || 0;
  }

  isPlaying() {
    return this.audio ? !this.audio.paused : false;
  }
}

export const audioService = new AudioService();