'use client';

import { useStore } from '@/lib/store';
import { tracks } from '@/lib/tracks';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const { currentTrack, setCurrentTrack, setIsPlaying } = useStore();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
          🧘 Медитация
        </h1>
        <p className="text-white/70 text-center mb-12">
          Выберите трек для практики
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => {
                if (currentTrack?.id === track.id) {
                  setIsPlaying(true);
                } else {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }
              }}
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