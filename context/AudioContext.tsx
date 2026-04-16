import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Track } from '@/types/album';

interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  queueIndex: number;
}

interface AudioContextValue extends AudioState {
  setCurrentTrack: (track: Track | null) => void;
  play: () => void;
  pause: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    queueIndex: 0,
  });

  const setCurrentTrack = useCallback((track: Track | null) => {
    setState((prev) => ({ ...prev, currentTrack: track }));
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setState((prev) => ({
      ...prev,
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
    }));
  }, []);

  const playNext = useCallback(() => {
    setState((prev) => {
      if (prev.queueIndex < prev.queue.length - 1) {
        const nextIndex = prev.queueIndex + 1;
        return {
          ...prev,
          queueIndex: nextIndex,
          currentTrack: prev.queue[nextIndex],
        };
      }
      return prev;
    });
  }, []);

  const playPrevious = useCallback(() => {
    setState((prev) => {
      if (prev.queueIndex > 0) {
        const prevIndex = prev.queueIndex - 1;
        return {
          ...prev,
          queueIndex: prevIndex,
          currentTrack: prev.queue[prevIndex],
        };
      }
      return prev;
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
        ...state,
        setCurrentTrack,
        play,
        pause,
        setQueue,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
