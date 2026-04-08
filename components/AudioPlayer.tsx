'use client';

import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, volume, setProgress, setDuration, setIsPlaying } = useStore();
  const soundRef = useRef<Howl | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Определяем iOS
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
  }, []);

  // Инициализация трека
  useEffect(() => {
    if (!currentTrack) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }

    const sound = new Howl({
      src: [currentTrack.src],
      html5: true,
      volume: volume,
      onload: () => {
        setDuration(sound.duration());
        setIsReady(true);
      },
      onplay: () => {
        requestAnimationFrame(updateProgress);
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
      },
    });

    soundRef.current = sound;

    // Для iOS: не играем автоматически, ждём клика
    if (!isIOS && isPlaying) {
      sound.play();
    }

    return () => {
      sound.unload();
    };
  }, [currentTrack]);

  // Обновление громкости
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Управление воспроизведением с учётом iOS
  useEffect(() => {
    if (!soundRef.current || !isReady) return;

    if (isPlaying) {
      if (isIOS) {
        // iOS: создаём временный буфер для "разрешения" звука
        const silentSound = new Howl({
          src: ['data:audio/wav;base64,U3RlYWx0aCBibGFuayBzb3VuZA=='],
          volume: 0,
          onend: () => {
            soundRef.current?.play();
          }
        });
        silentSound.play();
      } else {
        soundRef.current.play();
      }
    } else {
      soundRef.current.pause();
    }
  }, [isPlaying, isReady, isIOS]);

  const updateProgress = () => {
    if (soundRef.current && soundRef.current.playing()) {
      const seek = soundRef.current.seek() as number;
      setProgress(seek);
      requestAnimationFrame(updateProgress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (soundRef.current) {
      const seekTime = parseFloat(e.target.value);
      soundRef.current.seek(seekTime);
      setProgress(seekTime);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-black/50 backdrop-blur-lg border-t border-white/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-3xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-medium">{currentTrack.title}</div>
            <div className="text-white/50 text-sm">Медитация</div>
          </div>
          {isIOS && !isReady && (
            <div className="text-white/50 text-xs">Загрузка...</div>
          )}
        </div>

        <input
          type="range"
          min="0"
          max={useStore.getState().duration || 100}
          value={useStore.getState().progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
        />

        <div className="flex items-center justify-center gap-6 mt-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
    </div>
  );
}