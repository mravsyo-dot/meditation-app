'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying, progress } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Синхронизация воспроизведения
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('iOS Playback error:', error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack, setIsPlaying]);

  // Громкость
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 p-6 z-50">
      {/* Скрытый элемент аудио — единственный надежный способ для iOS Safari */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        playsInline
      />

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{currentTrack.title}</div>
            <div className="text-white/40 text-sm">Медитация</div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={useStore.getState().duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
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