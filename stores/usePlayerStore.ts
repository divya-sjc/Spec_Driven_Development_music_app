import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  
  // Queue actions
  setQueue: (songs: Song[], startIndex?: number) => void;
  playNow: (songs: Song[], startIndex?: number) => void;
  playNext: (song: Song) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  
  // Playback controls
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  
  // Modes
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
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

      setQueue: (songs, startIndex = 0) => {
        const { shuffleMode } = get();
        const queue = shuffleMode === 'on' ? shuffleArray(songs) : songs;
        set({ queue, queueIndex: startIndex, currentSong: queue[startIndex] || null });
      },

      playNow: (songs, startIndex = 0) => {
        const { shuffleMode } = get();
        const queue = shuffleMode === 'on' ? shuffleArray(songs) : songs;
        set({ queue, queueIndex: startIndex, currentSong: queue[startIndex] || null, isPlaying: true });
      },

      playNext: (song) =>
        set((state) => {
          const newQueue = [...state.queue];
          newQueue.splice(state.queueIndex + 1, 0, song);
          return { queue: newQueue };
        }),

      addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),

      removeFromQueue: (index) =>
        set((state) => ({
          queue: state.queue.filter((_, i) => i !== index),
          queueIndex: index < state.queueIndex ? state.queueIndex - 1 : state.queueIndex,
        })),

      clearQueue: () => set({ queue: [], queueIndex: 0, currentSong: null, isPlaying: false }),

      playNextTrack: () => {
        const { queue, queueIndex, repeatMode, shuffleMode } = get();
        if (repeatMode === 'one') {
          set({ position: 0 });
          return;
        }
        if (queueIndex < queue.length - 1) {
          const nextIndex = queueIndex + 1;
          set({ queueIndex: nextIndex, currentSong: queue[nextIndex], position: 0 });
        } else if (repeatMode === 'all' && queue.length > 0) {
          const newQueue = shuffleMode === 'on' ? shuffleArray(queue) : queue;
          set({ queue: newQueue, queueIndex: 0, currentSong: newQueue[0], position: 0 });
        }
      },

      playPreviousTrack: () => {
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
        set((state) => {
          const newMode = state.shuffleMode === 'off' ? 'on' : 'off';
          if (newMode === 'on' && state.queue.length > 0) {
            const currentSong = state.currentSong;
            const shuffled = shuffleArray(state.queue);
            const newIndex = currentSong ? shuffled.findIndex((s) => s.id === currentSong.id) : 0;
            return { shuffleMode: newMode, queue: shuffled, queueIndex: Math.max(0, newIndex) };
          }
          return { shuffleMode: newMode };
        }),

      cycleRepeatMode: () =>
        set((state) => {
          const modes: RepeatMode[] = ['off', 'all', 'one'];
          const currentIndex = modes.indexOf(state.repeatMode);
          return { repeatMode: modes[(currentIndex + 1) % modes.length] };
        }),
    }),
    {
      name: 'music-player-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        shuffleMode: state.shuffleMode,
        repeatMode: state.repeatMode,
        volume: state.volume,
      }),
    }
  )
);