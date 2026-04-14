'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    AudioManager: any;
  }
}

interface Track {
  id: string;
  title: string;
  duration: string;
  src: string;
  icon: string;
  gradient?: string;
}

interface PracticumPlayerProps {
  track: Track | null;
}

export default function PracticumPlayer({ track }: PracticumPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Подписка на события глобального аудио-менеджера
  useEffect(() => {
    if (!window.AudioManager) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onProgress = (time: number) => setProgress(time);
    const onDuration = (dur: number) => setDuration(dur);

    window.AudioManager.on('onPlay', onPlay);
    window.AudioManager.on('onPause', onPause);
    window.AudioManager.on('onProgress', onProgress);
    window.AudioManager.on('onDuration', onDuration);

    return () => {
      window.AudioManager.off('onPlay', onPlay);
      window.AudioManager.off('onPause', onPause);
      window.AudioManager.off('onProgress', onProgress);
      window.AudioManager.off('onDuration', onDuration);
    };
  }, []);

  // Инициализация трека
  useEffect(() => {
    if (track && window.AudioManager) {
      window.AudioManager.initTrack(track);
      setProgress(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [track]);

  const handlePlayPause = async () => {
    if (!window.AudioManager) return;
    
    if (isPlaying) {
      window.AudioManager.pause();
    } else {
      const success = await window.AudioManager.play();
      if (!success) {
        alert('Нажмите еще раз');
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (window.AudioManager) {
      window.AudioManager.seek(newTime);
      setProgress(newTime);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (window.AudioManager) {
      window.AudioManager.setVolume(newVol);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-xl border-t border-white/10 p-6 z-50">
      <div className="max-w-2xl mx-auto">
        {/* Трек инфо */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="text-5xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              {track.icon}
            </div>
            {isPlaying && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{track.title}</div>
            <div className="text-white/40 text-sm">Медитация • {track.duration}</div>
          </div>
        </div>

        {/* Прогресс */}
        <div className="space-y-2 mb-4">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#8b5cf6' }}
          />
          <div className="flex justify-between text-white/40 text-xs">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Контролы */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button className="text-white/40 hover:text-white/80 text-xl">
            ⏮️
          </button>
          
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl active:scale-95 transition-all shadow-lg hover:shadow-purple-500/25"
            style={{ touchAction: 'manipulation' }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button className="text-white/40 hover:text-white/80 text-xl">
            ⏭️
          </button>
        </div>

        {/* Громкость */}
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#8b5cf6' }}
          />
        </div>
      </div>
    </div>
  );
}