import { create } from 'zustand';
import { Song } from '@/types/Song';

export type RepeatMode = 'off' | 'all' | 'one';
export type ShuffleMode = 'off' | 'on';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
  shuffleMode: ShuffleMode;
  repeatMode: RepeatMode;
  position: number;
  duration: number;
  volume: number;
}

interface PlayerActions {
  setCurrentSong: (song: Song | null) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  queueIndex: 0,
  shuffleMode: 'off',
  repeatMode: 'off',
  position: 0,
  duration: 0,
  volume: 1,

  setCurrentSong: (song) => set({ currentSong: song }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setQueue: (songs, startIndex = 0) =>
    set({
      queue: songs,
      queueIndex: startIndex,
      currentSong: songs[startIndex] || null,
    }),

  addToQueue: (song) =>
    set((state) => ({
      queue: [...state.queue, song],
    })),

  removeFromQueue: (index) =>
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index),
      queueIndex: index < state.queueIndex ? state.queueIndex - 1 : state.queueIndex,
    })),

  clearQueue: () => set({ queue: [], queueIndex: 0, currentSong: null }),

  playNext: () => {
    const { queue, queueIndex, repeatMode } = get();
    if (repeatMode === 'one') {
      set({ position: 0 });
      return;
    }
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      set({ queueIndex: nextIndex, currentSong: queue[nextIndex], position: 0 });
    } else if (repeatMode === 'all' && queue.length > 0) {
      set({ queueIndex: 0, currentSong: queue[0], position: 0 });
    }
  },

  playPrevious: () => {
    const { queue, queueIndex, position } = get();
    if (position > 3) {
      set({ position: 0 });
      return;
    }
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      set({ queueIndex: prevIndex, currentSong: queue[prevIndex], position: 0 });
    }
  },

  setPosition: (position) => set({ position }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  toggleShuffle: () =>
    set((state) => ({
      shuffleMode: state.shuffleMode === 'off' ? 'on' : 'off',
    })),

  cycleRepeatMode: () =>
    set((state) => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeatMode);
      return { repeatMode: modes[(currentIndex + 1) % modes.length] };
    }),
}));
