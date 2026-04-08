'use client';

import { useStore } from '@/lib/store';
import { tracks } from '@/lib/tracks';
import AudioPlayer from '@/components/AudioPlayer';
import { useState, useEffect } from 'react';

export default function Home() {
  const { currentTrack, setCurrentTrack, setIsPlaying } = useStore();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
  }, []);

  const handleTrackSelect = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(true);
    } else {
      setCurrentTrack(track);
      // На iOS не запускаем автоматически
      if (!isIOS) {
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12 pb-32">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
          🧘 Медитация
        </h1>
        <p className="text-white/70 text-center mb-12">
          Выберите трек для практики
        </p>

        {isIOS && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-6 text-center text-white/90 text-sm">
            📱 Нажмите Play на плеере, чтобы начать
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{track.icon}</div>
                <div className="flex-1">
                  <div className="text-white text-lg font-medium">{track.title}</div>
                  <div className="text-white/50 text-sm">{track.duration}</div>
                </div>
                <div className="text-white/70">
                  {currentTrack?.id === track.id ? '🔊' : '🎵'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AudioPlayer />
    </div>
  );
}