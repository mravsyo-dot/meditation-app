import { useEffect } from 'react';

export function useTouchFix() {
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (button && button.onclick) {
        // Trigger click programmatically
        button.click();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, []);
}