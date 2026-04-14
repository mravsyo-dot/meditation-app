'use client';

import React, { useEffect, useState } from 'react';

interface Track {
  id: string;
  title: string;
  duration: string;
  src: string;
  icon: string;
}

interface NativePlayerProps {
  track: Track | null;
}

declare global {
  interface Window {
    AudioManager: any;
    initTrack: (id: string, src: string, title: string, icon: string) => void;
    togglePlayPause: () => void;
    seekAudio: (value: number) => void;
    changeVolume: (value: number) => void;
  }
}

export default function NativePlayer({ track }: NativePlayerProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // Подписка на события
  useEffect(() => {
    if (!window.AudioManager) return;

    const onProgress = (time: number) => setProgress(time);
    const onDuration = (dur: number) => setDuration(dur);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    window.AudioManager.on('onProgress', onProgress);
    window.AudioManager.on('onDuration', onDuration);
    window.AudioManager.on('onPlay', onPlay);
    window.AudioManager.on('onPause', onPause);

    return () => {
      window.AudioManager.off('onProgress', onProgress);
      window.AudioManager.off('onDuration', onDuration);
      window.AudioManager.off('onPlay', onPlay);
      window.AudioManager.off('onPause', onPause);
    };
  }, []);

  // Инициализация трека
  useEffect(() => {
    if (track && window.initTrack) {
      window.initTrack(track.id, track.src, track.title, track.icon);
    }
  }, [track]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <div 
      id="nativePlayer" 
      style={{ display: 'block' }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-xl border-t border-white/10 p-6 z-50"
    >
      <div className="max-w-2xl mx-auto">
        {/* Track info */}
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

        {/* Progress bar */}
        <div className="space-y-2 mb-4">
          <input
            id="nativeProgressBar"
            type="range"
            min="0"
            max="100"
            value={duration ? (progress / duration) * 100 : 0}
            onChange={(e) => window.seekAudio(parseFloat(e.target.value))}
            onTouchStart={(e) => e.stopPropagation()}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#8b5cf6' }}
          />
          <div className="flex justify-between text-white/40 text-xs">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button 
            onClick={() => window.togglePlayPause()}
            onTouchStart={(e) => {
              e.preventDefault();
              window.togglePlayPause();
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl active:scale-95 transition-all shadow-lg"
            style={{ touchAction: 'manipulation', cursor: 'pointer' }}
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
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              window.changeVolume(val);
            }}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#8b5cf6' }}
          />
        </div>
        
        {/* Инструкция для iOS */}
        <div className="text-center mt-4">
          <p className="text-yellow-400 text-xs">
            👆 Нажмите на кнопку для воспроизведения
          </p>
        </div>
      </div>
    </div>
  );
}