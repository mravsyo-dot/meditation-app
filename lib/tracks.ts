import { create } from 'zustand';

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

interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const useStore = create<PlayerStore>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
}));