'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Player: {
      initTrack: (track: any) => void;
      togglePlay: () => void;
      seek: (value: number) => void;
      setVolume: (value: number) => void;
    };
  }
}

interface Track {
  id: string;
  title: string;
  duration: string;
  src: string;
  icon: string;
}

interface PlayerProps {
  track: Track | null;
}

export default function Player({ track }: PlayerProps) {
  const [volume, setVolume] = useState(0.7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalDuration, setTotalDuration] = useState('0:00');
  const [progress, setProgress] = useState(0);

  // Слушаем события из глобального плеера
  useEffect(() => {
    if (!window.Player) return;

    // Обновляем состояние через интервал (можно улучшить через события)
    const interval = setInterval(() => {
      if (window.Player && (window as any).currentAudio) {
        const audio = (window as any).currentAudio;
        if (audio && !audio.paused) {
          setIsPlaying(true);
          const percent = (audio.currentTime / audio.duration) * 100;
          setProgress(percent);
          
          const mins = Math.floor(audio.currentTime / 60);
          const secs = Math.floor(audio.currentTime % 60);
          setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
        } else if (audio && audio.paused) {
          setIsPlaying(false);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (track && window.Player) {
      window.Player.initTrack(track);
      
      // Обновляем длительность из метаданных
      const checkDuration = setInterval(() => {
        const audio = (window as any).currentAudio;
        if (audio && audio.duration) {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60);
          setTotalDuration(`${mins}:${secs.toString().padStart(2, '0')}`);
          clearInterval(checkDuration);
        }
      }, 100);
      
      setProgress(0);
      setCurrentTime('0:00');
    }
  }, [track]);

  const handlePlayPause = () => {
    if (window.Player) {
      window.Player.togglePlay();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (window.Player) {
      window.Player.seek(val);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (window.Player) {
      window.Player.setVolume(val);
    }
  };

  if (!track) return null;

  return (
    <div 
      id="playerContainer"
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-xl border-t border-white/10 p-6 z-50"
    >
      <div className="max-w-2xl mx-auto">
        {/* Track info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="text-5xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <span id="playerIcon">{track.icon}</span>
            </div>
            {isPlaying && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">
              <span id="playerTitle">{track.title}</span>
            </div>
            <div className="text-white/40 text-sm">Медитация • {track.duration}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mb-4">
          <input
            id="progressBar"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#8b5cf6' }}
          />
          <div className="flex justify-between text-white/40 text-xs">
            <span id="currentTime">{currentTime}</span>
            <span id="duration">{totalDuration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            id="playPauseBtn"
            onClick={handlePlayPause}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl active:scale-95 transition-all shadow-lg"
            style={{ touchAction: 'manipulation' }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* Volume */}
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

        <div className="text-center mt-4">
          <p className="text-yellow-400 text-xs">
            👆 Нажмите на кнопку для воспроизведения
          </p>
        </div>
      </div>
    </div>
  );
}