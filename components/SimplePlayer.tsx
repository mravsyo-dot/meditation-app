'use client';

import { useEffect, useRef, useState } from 'react';

interface Track {
  id: string;
  title: string;
  duration: string;
  src: string;
  icon: string;
}

interface SimplePlayerProps {
  track: Track | null;
}

export default function SimplePlayer({ track }: SimplePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Создаем аудио элемент при смене трека
  useEffect(() => {
    if (!track) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    console.log('Creating audio for:', track.title);
    
    // Создаем новый аудио элемент
    const audio = new Audio(track.src);
    audio.preload = 'auto';
    audio.setAttribute('playsinline', 'true');
    audio.volume = 0.7;
    
    // Обработчики событий
    const onLoadedMetadata = () => {
      console.log('Loaded metadata');
      setDuration(audio.duration);
    };
    
    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const onEnded = () => {
      console.log('Track ended');
      setIsPlaying(false);
      setProgress(0);
    };
    
    const onPlay = () => {
      console.log('Play event');
      setIsPlaying(true);
    };
    
    const onPause = () => {
      console.log('Pause event');
      setIsPlaying(false);
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    
    audioRef.current = audio;
    
    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
  }, [track]);

  // Функция play/pause - вызывается ТОЛЬКО по клику
  const handlePlayPause = async () => {
    const audio = audioRef.current;
    
    if (!audio) {
      console.log('No audio element');
      return;
    }
    
    console.log('Button clicked, current paused state:', audio.paused);
    
    if (audio.paused) {
      // Пытаемся воспроизвести
      try {
        await audio.play();
        console.log('Play successful');
      } catch (error) {
        console.error('Play failed:', error);
        alert('Нажмите еще раз для воспроизведения');
      }
    } else {
      audio.pause();
      console.log('Paused');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{track.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{track.title}</div>
            <div className="text-yellow-400 text-xs">
              👆 Нажмите на кнопку для воспроизведения
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'white' }}
          />

          <div className="flex justify-center">
            <button
              onClick={handlePlayPause}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-4xl active:scale-95 transition-all shadow-lg"
              style={{ touchAction: 'manipulation' }}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}