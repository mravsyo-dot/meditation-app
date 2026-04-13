'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, progress, setProgress, setDuration } = useStore();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Создаем аудио когда выбран трек
  useEffect(() => {
    if (!currentTrack) {
      setAudio(null);
      return;
    }

    console.log('Creating audio for:', currentTrack.title);
    
    // Создаем аудио элемент
    const newAudio = new Audio(currentTrack.src);
    newAudio.preload = 'auto';
    newAudio.volume = 0.7;
    newAudio.setAttribute('playsinline', 'true');
    
    // Обработчики
    newAudio.addEventListener('loadedmetadata', () => {
      console.log('Duration:', newAudio.duration);
      setDuration(newAudio.duration);
    });
    
    newAudio.addEventListener('timeupdate', () => {
      setProgress(newAudio.currentTime);
    });
    
    newAudio.addEventListener('ended', () => {
      console.log('Track ended');
      setIsPlaying(false);
      setProgress(0);
    });
    
    newAudio.addEventListener('play', () => {
      console.log('Play event fired');
      setIsPlaying(true);
    });
    
    newAudio.addEventListener('pause', () => {
      console.log('Pause event fired');
      setIsPlaying(false);
    });
    
    setAudio(newAudio);
    
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.src = '';
      }
    };
  }, [currentTrack, setDuration, setProgress, setIsPlaying]);

  // Обновляем состояние isPlaying когда аудио играет/пауза
  // Но не вызываем play() здесь!

  const handlePlayPause = () => {
    if (!audio) {
      console.log('No audio element');
      return;
    }
    
    console.log('Button clicked, isPlaying:', isPlaying);
    
    if (isPlaying) {
      audio.pause();
    } else {
      // Прямой вызов play() в обработчике клика
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Play succeeded');
        }).catch(error => {
          console.error('Play failed:', error);
          alert('Нажмите еще раз для воспроизведения');
        });
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      const value = parseFloat(e.target.value);
      audio.currentTime = value;
      setProgress(value);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentTrack.icon}</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">{currentTrack.title}</div>
            <div className="text-yellow-400 text-xs mt-1">
              👆 Нажмите на кнопку ниже
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'white' }}
          />

          <div className="flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg text-4xl"
              style={{ 
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}