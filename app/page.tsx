'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { tracks } from '@/lib/tracks';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = useStore();
  const [debugMessage, setDebugMessage] = useState('Ожидание клика...');

  const handleTrackClick = (track: typeof tracks[0]) => {
    setDebugMessage(`Клик по: ${track.title}`);
    
    try {
      if (currentTrack?.id === track.id) {
        setIsPlaying(true);
      } else {
        setCurrentTrack(track);
        setTimeout(() => {
          setIsPlaying(true);
        }, 100);
      }
      setDebugMessage(`Успешно: ${track.title}`);
    } catch (error) {
      setDebugMessage(`Ошибка: ${error}`);
    }
  };

  const testAlert = () => {
    setDebugMessage('Нажата тестовая кнопка');
    alert('Тестовый alert');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12 pb-32">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
          🧘 Медитация
        </h1>
        
        {/* Отладочная панель */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-6 text-center">
          <p className="text-white/90 text-sm font-mono">{debugMessage}</p>
        </div>

        {/* Тестовая кнопка */}
        <button 
          onClick={testAlert}
          className="bg-white text-black p-4 rounded-xl mb-8 w-full font-bold"
        >
          🔧 Тестовая кнопка (нажми меня)
        </button>

        <p className="text-white/70 text-center mb-12">
          Нажми на трек, затем на Play
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleTrackClick(track)}
              className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/20 transition-all border border-white/20 active:scale-95 text-left"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{track.icon}</div>
                <div className="flex-1">
                  <div className="text-white text-lg font-medium">{track.title}</div>
                  <div className="text-white/50 text-sm">{track.duration}</div>
                </div>
                <div className="text-white/70">
                  {currentTrack?.id === track.id ? (isPlaying ? '🔊' : '⏸️') : '🎵'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <AudioPlayer />
    </div>
  );
}