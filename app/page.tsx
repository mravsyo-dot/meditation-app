'use client';

import { useState, useEffect } from 'react';
import Player from '@/components/Player';

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

  const handleTrackSelect = (track: Track) => {
    console.log('Selecting track:', track.title);
    setSelectedTrack(track);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-12 pb-48">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur rounded-full px-4 py-2 mb-4">
            <span className="text-yellow-400">✨</span>
            <span className="text-white/60 text-sm">Медитация</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-4">
            Найди свой ритм
          </h1>
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1">
            <p className="text-emerald-400 text-xs font-mono">
              🚀 Релиз: {releaseTime}
            </p>
          </div>
        </div>

        {/* Grid треков */}
        <div className="max-w-xl mx-auto">
          <div className="grid gap-4">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className={`
                  group relative overflow-hidden rounded-2xl transition-all duration-300
                  ${selectedTrack?.id === track.id 
                    ? 'ring-2 ring-purple-500 scale-[1.02]' 
                    : 'hover:scale-[1.01]'}
                `}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                <div className="relative p-5 flex items-center gap-5">
                  <div className="text-5xl bg-black/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur">
                    {track.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white text-xl font-semibold mb-1">{track.title}</div>
                    <div className="text-white/40 text-sm">{track.duration}</div>
                  </div>
                  <div className="text-white/30 group-hover:text-white/60 transition">
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Player track={selectedTrack} />
    </main>
  );
}