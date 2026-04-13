// lib/tracks.ts
export type Track = {
  id: string;
  title: string;
  duration: string;
  src: string;
  icon: string;
};

export const tracks: Track[] = [
  {
    id: '1',
    title: 'Спокойный дождь',
    duration: '05:23',
    src: '/sounds/abc.m4a',
    icon: '🌧️'
  },
  {
    id: '2',
    title: 'Лесные звуки',
    duration: '07:15',
    src: '/sounds/abca.m4a',
    icon: '🌲'
  }
];