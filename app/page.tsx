'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { tracks } from '@/lib/tracks';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = useStore();
  const [clickCount, setClickCount] = useState(0);

  const handleTrackClick = (track: typeof tracks[0]) => {
    setClickCount(prev => prev + 1);
    console.log('Track clicked:', track.title, 'Click count:', clickCount + 1);
    
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      // Не вызываем setIsPlaying(true) сразу, пусть пользователь сам нажмет Play
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16 pb-48">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🧘 Медитация</h1>
          <div className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1">
            <p className="text-white/60 text-xs font-mono">
              Кликов: {clickCount} | Трек: {currentTrack?.title || 'нет'}
            </p>
          </div>
        </header>

        <div className="max-w-xl mx-auto grid gap-4">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleTrackClick(track)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleTrackClick(track);
              }}
              className={`
                w-full p-5 rounded-3xl transition-all duration-300 text-left border
                ${currentTrack?.id === track.id 
                  ? 'bg-white/20 border-white/30 scale-[1.02]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-95'}
              `}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex items-center gap-5">
                <div className="text-5xl bg-black/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
                  {track.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white text-xl font-semibold mb-1">{track.title}</div>
                  <div className="text-white/40 text-sm flex items-center gap-2">
                    <span className="inline-block w-1 h-1 bg-white/30 rounded-full"></span>
                    {track.duration}
                  </div>
                </div>
                <div className="text-2xl">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <div className="flex gap-1 items-end h-5">
                      <div className="w-1 bg-white animate-pulse h-full"></div>
                      <div className="w-1 bg-white animate-pulse h-3"></div>
                      <div className="w-1 bg-white animate-pulse h-5"></div>
                    </div>
                  ) : (
                    <span className="opacity-30 text-white">→</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <AudioPlayer />
    </main>
  );
}