import { create } from 'zustand';
import type { Track } from './tracks';

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