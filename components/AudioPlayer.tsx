'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying, progress } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [testClick, setTestClick] = useState(0);

  // Проверка что клики работают
  const handleTestClick = () => {
    setTestClick(prev => prev + 1);
    console.log('Click registered:', testClick + 1);
    alert(`Клик работает! Счетчик: ${testClick + 1}`);
  };

  // Создаем аудио элемент
  useEffect(() => {
    if (!currentTrack) return;

    console.log('Setting up audio for:', currentTrack.title);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(currentTrack.src);
    audio.preload = 'auto';
    audio.volume = volume;
    audio.setAttribute('playsinline', 'true');
    
    const onLoadedMetadata = () => {
      console.log('Audio loaded, duration:', audio.duration);
      setDuration(audio.duration);
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
      alert(`Ошибка загрузки аудио: ${currentTrack.title}`);
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, [currentTrack, setDuration, setProgress, setIsPlaying, volume]);

  // Управление воспроизведением
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handlePlay = async () => {
      if (isPlaying) {
        try {
          console.log('Attempting to play...');
          await audio.play();
          console.log('Playing successfully');
        } catch (err) {
          console.error('Play error:', err);
          setIsPlaying(false);
          alert('Нажмите на кнопку Play еще раз');
        }
      } else {
        audio.pause();
        console.log('Paused');
      }
    };

    handlePlay();
  }, [isPlaying, currentTrack, setIsPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const seekTime = parseFloat(e.target.value);
      audio.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  const handlePlayPause = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    console.log('Play/Pause button clicked', { currentIsPlaying: isPlaying });
    setIsPlaying(!isPlaying);
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-6 z-50">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p>Выберите трек для медитации</p>
          <button 
            onClick={handleTestClick}
            onTouchStart={handleTestClick}
            className="mt-4 px-4 py-2 bg-white/20 rounded-lg"
          >
            Тест клика (нажато: {testClick})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6 z-50"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={handleTestClick}
          onTouchStart={handleTestClick}
          className="absolute top-2 right-2 px-2 py-1 bg-white/10 rounded text-xs"
        >
          Тест: {testClick}
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{currentTrack.title}</div>
            <div className="text-white/40 text-xs">
              Нажмите на кнопку воспроизведения
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
            onTouchStart={(e) => e.stopPropagation()}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'white' }}
          />

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePlayPause}
              onTouchStart={handlePlayPause}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg hover:scale-105"
              style={{ 
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}