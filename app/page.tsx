'use client';

import { useState, useEffect } from 'react';
import SimplePlayer from '@/components/SimplePlayer';

interface Track {
  id: string;
  title: string;
  duration: string;
  src: string;
  icon: string;
}

export default function Home() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [releaseTime, setReleaseTime] = useState('');

  const tracks: Track[] = [
    { id: '1', title: 'Спокойный дождь', duration: '05:23', src: '/sounds/abc.m4a', icon: '🌧️' },
    { id: '2', title: 'Лесные звуки', duration: '07:15', src: '/sounds/abca.m4a', icon: '🌲' }
  ];

  useEffect(() => {
    const date = new Date('2026-04-13T18:00:00+03:00');
    setReleaseTime(date.toLocaleString());
  }, []);

  const selectTrack = (track: Track) => {
    console.log('Selecting track:', track.title);
    setSelectedTrack(track);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16 pb-48">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🧘 Медитация</h1>
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1">
            <p className="text-emerald-400 text-xs font-mono">
              🚀 Релиз: {releaseTime || 'загрузка...'}
            </p>
          </div>
        </header>

        <div className="max-w-xl mx-auto grid gap-4">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className={`
                w-full p-5 rounded-3xl transition-all duration-300 text-left border
                ${selectedTrack?.id === track.id 
                  ? 'bg-white/20 border-white/30 scale-[1.02]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-95'}
              `}
              style={{ touchAction: 'manipulation' }}
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
      
      <SimplePlayer track={selectedTrack} />
    </main>
  );
}