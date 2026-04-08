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
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    icon: '🌧️'
  },
  {
    id: '2',
    title: 'Лесные звуки',
    duration: '07:15',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    icon: '🌲'
  }
];