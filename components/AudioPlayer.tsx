'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { audioService } from '@/lib/audioService';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying, progress } = useStore();
  const [isIOS, setIsIOS] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const initAttemptedRef = useRef(false);

  // Определяем iOS
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
  }, []);

  // Инициализация аудио при смене трека
  useEffect(() => {
    if (!currentTrack) return;

    console.log('Initializing audio for:', currentTrack.title);
    
    audioService.init(currentTrack.src);
    audioService.setCallbacks({
      onTimeUpdate: (time) => setProgress(time),
      onDurationChange: (duration) => setDuration(duration),
      onEnded: () => {
        setIsPlaying(false);
        setProgress(0);
      },
    });
    
    audioService.setVolume(volume);
    setIsAudioReady(true);

    // iOS: пробуем "разбудить" аудио при первом касании
    const handleUserInteraction = async () => {
      if (isIOS && audioService.getCurrentTime() === 0 && !initAttemptedRef.current) {
        initAttemptedRef.current = true;
        await audioService.play();
        audioService.pause();
        console.log('Audio context initialized');
      }
    };

    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      audioService.pause();
    };
  }, [currentTrack, setProgress, setDuration, setIsPlaying, volume, isIOS]);

  // Управление воспроизведением
  useEffect(() => {
    if (!isAudioReady || !currentTrack) return;

    const controlPlayback = async () => {
      if (isPlaying) {
        const success = await audioService.play();
        if (!success) {
          console.log('Play failed, retrying...');
          // На iOS пробуем еще раз с небольшим таймаутом
          setTimeout(async () => {
            const retrySuccess = await audioService.play();
            if (!retrySuccess) {
              setIsPlaying(false);
            }
          }, 100);
        }
      } else {
        audioService.pause();
      }
    };

    controlPlayback();
  }, [isPlaying, isAudioReady, currentTrack, setIsPlaying]);

  // Громкость
  useEffect(() => {
    audioService.setVolume(volume);
  }, [volume]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    audioService.setCurrentTime(seekTime);
    setProgress(seekTime);
  };

  // Для iOS добавляем кнопку-заглушку
  const handlePlayButtonClick = async () => {
    if (isIOS && !isPlaying) {
      // На iOS нужно, чтобы play() вызывался напрямую из обработчика клика
      const success = await audioService.play();
      if (success) {
        setIsPlaying(true);
      } else {
        console.log('Still cannot play, user interaction might be needed twice');
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 p-6 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{currentTrack.title}</div>
            <div className="text-white/40 text-sm">
              {isIOS && !isPlaying && audioService.getCurrentTime() === 0 && (
                <span className="text-yellow-400 text-xs">⚠️ Нажмите Play для активации звука</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={useStore.getState().duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'white' }}
          />

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePlayButtonClick}
              className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="text-3xl">{isPlaying ? '⏸️' : '▶️'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}