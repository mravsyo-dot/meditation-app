'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('Готов к работе');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    console.log('Test page mounted');
    setStatus('Страница загружена');
  }, []);

  const handlePlay = async () => {
    setStatus('Пытаюсь воспроизвести...');
    setClickCount(prev => prev + 1);
    
    try {
      const audio = new Audio('/sounds/abc.m4a');
      audio.setAttribute('playsinline', 'true');
      await audio.play();
      setStatus('✅ Аудио играет!');
      console.log('Audio playing');
    } catch (error: any) {
      setStatus(`❌ Ошибка: ${error.message}`);
      console.error('Play error:', error);
    }
  };

  const handlePlaySecond = async () => {
    setStatus('Пытаюсь воспроизвести второй трек...');
    
    try {
      const audio = new Audio('/sounds/abca.m4a');
      audio.setAttribute('playsinline', 'true');
      await audio.play();
      setStatus('✅ Второй трек играет!');
    } catch (error: any) {
      setStatus(`❌ Ошибка: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧘 Тест аудио на iPhone</h1>
      
      <div style={{ 
        background: '#1e293b', 
        padding: '10px', 
        borderRadius: '8px', 
        margin: '10px 0',
        color: '#a5f3fc',
        fontFamily: 'monospace'
      }}>
        Статус: {status}
      </div>
      
      <div style={{ margin: '10px 0', color: '#94a3b8' }}>
        Кликов: {clickCount}
      </div>
      
      <button 
        onClick={handlePlay}
        onTouchStart={handlePlay}
        style={{
          width: '100%',
          padding: '15px',
          margin: '10px 0',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        🎵 Воспроизвести abc.m4a
      </button>
      
      <button 
        onClick={handlePlaySecond}
        onTouchStart={handlePlaySecond}
        style={{
          width: '100%',
          padding: '15px',
          margin: '10px 0',
          background: '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        🎵 Воспроизвести abca.m4a
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#0f172a', borderRadius: '8px' }}>
        <p style={{ color: '#fbbf24', fontSize: '12px' }}>
          👆 Нажмите на кнопку. Если аудио не играет с первого раза - нажмите еще раз.
        </p>
        <p style={{ color: '#64748b', fontSize: '11px', marginTop: '10px' }}>
          URL: {typeof window !== 'undefined' ? window.location.href : ''}
        </p>
      </div>
    </div>
  );
}