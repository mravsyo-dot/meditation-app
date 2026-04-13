'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { tracks } from '@/lib/tracks';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const { currentTrack, setCurrentTrack, setIsPlaying } = useStore();
  const [releaseTime, setReleaseTime] = useState('');

  useEffect(() => {
    const date = new Date('2026-04-13T18:00:00+03:00');
    setReleaseTime(date.toLocaleString());
  }, []);

  const selectTrack = (track: typeof tracks[0]) => {
    console.log('Selecting track:', track.title);
    
    if (currentTrack?.id === track.id) {
      // Тот же трек - ничего не делаем, пусть плеером управляют
      return;
    }
    
    // Просто устанавливаем трек, НЕ включаем воспроизведение
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16 pb-48">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🧘 Медитация</h1>
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1">
            <p className="text-emerald-400 text-xs font-mono">🚀 Релиз: {releaseTime}</p>
          </div>
        </header>

        <div className="max-w-xl mx-auto grid gap-4">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className={`
                w-full p-5 rounded-3xl transition-all duration-300 text-left border
                ${currentTrack?.id === track.id 
                  ? 'bg-white/20 border-white/30 scale-[1.02]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-95'}
              `}
            >
              <div className="flex items-center gap-5">
                <div className="text-5xl bg-black/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {track.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white text-xl font-semibold mb-1">{track.title}</div>
                  <div className="text-white/40 text-sm">{track.duration}</div>
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