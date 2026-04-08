'use client';

import { useStore } from '@/lib/store';
import { tracks } from '@/lib/tracks';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = useStore();

  const handleTrackClick = (track: typeof tracks[0]) => {
    console.log('Track clicked:', track.title);
    
    if (currentTrack?.id === track.id) {
      // Тот же трек — просто играем
      setIsPlaying(true);
    } else {
      // Новый трек
      setCurrentTrack(track);
      // Немного задержки для iOS
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12 pb-32">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
          🧘 Медитация
        </h1>
        <p className="text-white/70 text-center mb-12">
          Нажми на трек, затем на Play
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => handleTrackClick(track)}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all border border-white/20 active:scale-95"
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
            </div>
          ))}
        </div>
      </div>
      
      <AudioPlayer />
    </div>
  );
}