'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    initPlayer: (id: string, src: string, title: string, icon: string) => void;
    togglePlayPause: () => void;
    seek: (value: number) => void;
  }
}

export default function Home() {
  const [releaseTime, setReleaseTime] = useState('');

  useEffect(() => {
    const date = new Date('2026-04-13T18:00:00+03:00');
    setReleaseTime(date.toLocaleString());
  }, []);

  const tracks = [
    { id: '1', title: 'Спокойный дождь', duration: '05:23', src: '/sounds/abc.m4a', icon: '🌧️' },
    { id: '2', title: 'Лесные звуки', duration: '07:15', src: '/sounds/abca.m4a', icon: '🌲' }
  ];

  const selectTrack = (track: typeof tracks[0]) => {
    if (window.initPlayer) {
      window.initPlayer(track.id, track.src, track.title, track.icon);
    } else {
      console.error('Player not loaded yet');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-xl mx-auto pb-32">
        <h1 className="text-3xl font-bold text-white text-center mb-4">🧘 Медитация</h1>
        
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 text-center mb-8">
          <p className="text-emerald-400 text-sm">🚀 Релиз: {releaseTime}</p>
        </div>
        
        <div className="space-y-3">
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{track.icon}</span>
                <div>
                  <div className="text-white font-semibold">{track.title}</div>
                  <div className="text-white/40 text-sm">{track.duration}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Плеер внизу */}
      <div id="player" style={{ display: 'none' }} className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span id="playerIcon" className="text-4xl"></span>
            <div className="flex-1">
              <div id="playerTitle" className="text-white font-semibold"></div>
              <div className="text-yellow-400 text-xs">Нажмите на кнопку</div>
            </div>
          </div>
          
          <input
            type="range"
            id="progressBar"
            min="0"
            max="100"
            defaultValue="0"
            onChange={(e) => window.seek(parseFloat(e.target.value))}
            className="w-full mb-4"
            style={{ accentColor: 'white' }}
          />
          
          <div className="flex justify-center">
            <button
              onClick={() => window.togglePlayPause()}
              className="w-20 h-20 bg-white text-black rounded-full text-4xl flex items-center justify-center active:scale-95 transition"
            >
              ▶️
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}