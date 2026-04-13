'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying, progress } = useStore();
  const [isIOS, setIsIOS] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // Создаем аудио элемент при смене трека
  useEffect(() => {
    if (!currentTrack) return;

    // Очищаем старый
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Создаем новый
    const audio = new Audio(currentTrack.src);
    audio.preload = 'auto';
    audio.volume = volume;
    
    // Важно для iOS
    audio.setAttribute('playsinline', 'true');
    
    // Обработчики
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    
    audioRef.current = audio;

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [currentTrack, setDuration, setProgress, setIsPlaying, volume]);

  // Управление воспроизведением
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const togglePlay = async () => {
      if (isPlaying) {
        try {
          await audio.play();
        } catch (err) {
          console.error('Play error:', err);
          setIsPlaying(false);
        }
      } else {
        audio.pause();
      }
    };

    togglePlay();
  }, [isPlaying, currentTrack, setIsPlaying]);

  // Громкость
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const seekTime = parseFloat(e.target.value);
      audio.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 p-6 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{currentTrack.title}</div>
            {isIOS && (
              <div className="text-yellow-400 text-xs mt-1">
                ⚠️ Нажмите Play после выбора трека
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
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'white' }}
          />

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handlePlayPause}
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