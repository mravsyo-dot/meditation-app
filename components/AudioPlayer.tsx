'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying, progress } = useStore();
  const [isIOS, setIsIOS] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // Создаем аудио элемент при смене трека
  useEffect(() => {
    if (!currentTrack) {
      setAudioElement(null);
      setIsAudioLoaded(false);
      return;
    }

    console.log('Creating audio for:', currentTrack.title);
    
    const audio = new Audio(currentTrack.src);
    audio.preload = 'auto';
    audio.volume = volume;
    audio.setAttribute('playsinline', 'true');
    
    const onLoadedMetadata = () => {
      console.log('Audio loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setIsAudioLoaded(true);
    };
    
    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const onEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
      setProgress(0);
    };
    
    const onError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      alert(`Ошибка загрузки: ${currentTrack.title}`);
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    
    setAudioElement(audio);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack, setDuration, setProgress, setIsPlaying, volume]);

  // Отдельный эффект для громкости
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  // Функция воспроизведения - вызывается ТОЛЬКО по клику
  const handlePlayPause = async () => {
    if (!audioElement || !currentTrack) {
      console.log('No audio element');
      return;
    }

    console.log('Play/Pause clicked, current isPlaying:', isPlaying);

    if (isPlaying) {
      // Пауза
      audioElement.pause();
      setIsPlaying(false);
    } else {
      // Воспроизведение - прямой вызов play() в обработчике клика
      try {
        await audioElement.play();
        console.log('Play success');
        setIsPlaying(true);
      } catch (err) {
        console.error('Play error:', err);
        alert('Нажмите еще раз для воспроизведения');
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioElement) {
      const seekTime = parseFloat(e.target.value);
      audioElement.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{currentTrack.title}</div>
            {isIOS && !isPlaying && (
              <div className="text-yellow-400 text-xs mt-1">
                🎵 Нажмите на кнопку воспроизведения
              </div>
            )}
            {!isAudioLoaded && (
              <div className="text-white/40 text-xs">
                Загрузка...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={useStore.getState().duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'white' }}
          />

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handlePlayPause}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg"
              style={{ 
                cursor: 'pointer',
                touchAction: 'manipulation'
              }}
            >
              <span className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}