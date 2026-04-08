'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Создаём аудио элемент
  useEffect(() => {
    if (!currentTrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const audio = new Audio(currentTrack.src);
    audio.volume = volume;
    audio.loop = false;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack]);

  // Управление воспроизведением
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.log('Playback error:', error);
        // iOS требует пользовательского жеста
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Громкость
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-black/50 backdrop-blur-lg border-t border-white/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-3xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-medium">{currentTrack.title}</div>
            <div className="text-white/50 text-sm">Медитация</div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max={useStore.getState().duration || 100}
          value={useStore.getState().progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex items-center justify-center gap-6 mt-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
    </div>
  );
}