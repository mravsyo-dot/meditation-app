// lib/iosAudioFix.ts
export class IOSAudioManager {
  private static instance: IOSAudioManager;
  private audioElement: HTMLAudioElement | null = null;
  private isIOS = false;
  private pendingSrc: string | null = null;
  private onPlayCallback: (() => void) | null = null;
  private isInitialized = false;

  private constructor() {
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (this.isIOS) {
      this.setupIOSAudio();
    }
  }

  static getInstance() {
    if (!IOSAudioManager.instance) {
      IOSAudioManager.instance = new IOSAudioManager();
    }
    return IOSAudioManager.instance;
  }

  private setupIOSAudio() {
    // Создаем тихий аудио элемент для "разогрева"
    this.audioElement = new Audio();
    this.audioElement.setAttribute('playsinline', 'true');
    this.audioElement.preload = 'auto';
    this.audioElement.volume = 0;
    
    // Пытаемся воспроизвести тишину для активации аудио контекста
    const unlockAudio = () => {
      if (this.isInitialized) return;
      
      if (this.audioElement) {
        this.audioElement.play()
          .then(() => {
            console.log('iOS Audio context unlocked');
            this.audioElement!.pause();
            this.audioElement!.currentTime = 0;
            this.isInitialized = true;
            
            // Если есть ожидающий трек, загружаем его
            if (this.pendingSrc) {
              this.loadAndPlay(this.pendingSrc);
            }
          })
          .catch(e => console.log('Audio unlock failed:', e));
      }
      
      // Удаляем обработчики после первого взаимодействия
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
  }

  async loadAndPlay(src: string, onPlay?: () => void) {
    this.onPlayCallback = onPlay || null;
    
    if (!this.isIOS) {
      // Для десктопа - обычное воспроизведение
      const audio = new Audio(src);
      audio.setAttribute('playsinline', 'true');
      await audio.play();
      if (this.onPlayCallback) this.onPlayCallback();
      return audio;
    }

    // Для iOS
    if (!this.isInitialized) {
      this.pendingSrc = src;
      console.log('Waiting for user interaction to play audio');
      return null;
    }

    // Создаем новый аудио элемент для каждого трека
    const audio = new Audio(src);
    audio.setAttribute('playsinline', 'true');
    audio.preload = 'auto';
    
    try {
      await audio.play();
      if (this.onPlayCallback) this.onPlayCallback();
      return audio;
    } catch (error) {
      console.error('iOS play error:', error);
      // Пробуем еще раз с принудительным взаимодействием
      const playOnInteraction = async () => {
        try {
          await audio.play();
          if (this.onPlayCallback) this.onPlayCallback();
        } catch (e) {
          console.error('Second attempt failed:', e);
        }
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('click', playOnInteraction);
      };
      
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('click', playOnInteraction, { once: true });
      return null;
    }
  }
}