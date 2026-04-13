'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [releaseTime, setReleaseTime] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{title: string, src: string, icon: string} | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Время релиза
  useEffect(() => {
    const date = new Date('2026-04-13T18:00:00+03:00');
    setReleaseTime(date.toLocaleString());
    setError('Страница загружена, ждите...');
  }, []);

  const tracks = [
    { id: '1', title: 'Спокойный дождь', duration: '05:23', src: '/sounds/abc.m4a', icon: '🌧️' },
    { id: '2', title: 'Лесные звуки', duration: '07:15', src: '/sounds/abca.m4a', icon: '🌲' }
  ];

  const selectTrack = (track: typeof tracks[0]) => {
    setError(`Выбран трек: ${track.title}`);
    setCurrentTrack(track);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    const audio = new Audio(track.src);
    audio.preload = 'auto';
    audio.setAttribute('playsinline', 'true');
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setError(`Загружено: ${track.title}`);
    });
    audio.addEventListener('timeupdate', () => setProgress(audio.currentTime));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
    audio.addEventListener('error', (e) => setError(`Ошибка: ${track.title}`));
    
    audioRef.current = audio;
  };

  const playPause = async () => {
    const audio = audioRef.current;
    if (!audio) {
      setError('Сначала выберите трек');
      return;
    }
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setError('Пауза');
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        setError('Играет');
      } catch (err: any) {
        setError(`Ошибка: ${err.message}`);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const val = parseFloat(e.target.value);
      audio.currentTime = val;
      setProgress(val);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-4">🧘 Медитация</h1>
        
        {/* Время релиза */}
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 text-center mb-4">
          <p className="text-emerald-400 text-sm font-mono">🚀 Релиз: {releaseTime || 'загрузка...'}</p>
        </div>
        
        {/* Ошибки/статус */}
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-center mb-4">
          <p className="text-yellow-400 text-xs font-mono break-all">{error || 'Готов'}</p>
        </div>
        
        {/* Список треков */}
        <div className="space-y-3 mb-8">
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              onTouchStart={(e) => { e.preventDefault(); selectTrack(track); }}
              className={`w-full p-4 rounded-2xl text-left border transition-all
                ${currentTrack?.title === track.title 
                  ? 'bg-white/20 border-white/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
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
        
        {/* Плеер (показывается только если выбран трек) */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{currentTrack.icon}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{currentTrack.title}</div>
                  <div className="text-yellow-400 text-xs">Нажмите на кнопку</div>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full mb-4"
                style={{ accentColor: 'white' }}
              />
              
              <div className="flex justify-center">
                <button
                  onClick={playPause}
                  onTouchStart={(e) => { e.preventDefault(); playPause(); }}
                  className="w-20 h-20 bg-white text-black rounded-full text-4xl flex items-center justify-center active:scale-95 transition"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}