import { useCallback, useEffect, useState } from 'react';
import { Track } from '@/types/album';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { getItem, setItem, removeItem } from './use-storage';

export function useTracks() {
  const [tracks, setTracks] = useState<Record<string, Track>>({});
  const [loading, setLoading] = useState(true);

  const loadTracks = useCallback(async () => {
    setLoading(true);
    const stored = await getItem<Record<string, Track>>(STORAGE_KEYS.TRACKS);
    setTracks(stored || {});
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const saveTracks = useCallback(async (newTracks: Record<string, Track>) => {
    const success = await setItem(STORAGE_KEYS.TRACKS, newTracks);
    if (success) {
      setTracks(newTracks);
    }
    return success;
  }, []);

  const addTrack = useCallback(
    async (track: Track): Promise<boolean> => {
      const newTracks = { ...tracks, [track.id]: track };
      return saveTracks(newTracks);
    },
    [tracks, saveTracks]
  );

  const addTracks = useCallback(
    async (newTrackList: Track[]): Promise<boolean> => {
      const newTracks = { ...tracks };
      for (const track of newTrackList) {
        newTracks[track.id] = track;
      }
      return saveTracks(newTracks);
    },
    [tracks, saveTracks]
  );

  const updateTrack = useCallback(
    async (id: string, updates: Partial<Track>): Promise<boolean> => {
      const existing = tracks[id];
      if (!existing) return false;
      const newTracks = { ...tracks, [id]: { ...existing, ...updates } };
      return saveTracks(newTracks);
    },
    [tracks, saveTracks]
  );

  const deleteTrack = useCallback(
    async (id: string): Promise<boolean> => {
      const { [id]: _, ...remaining } = tracks;
      return saveTracks(remaining);
    },
    [tracks, saveTracks]
  );

  const getTrackById = useCallback(
    (id: string): Track | undefined => {
      return tracks[id];
    },
    [tracks]
  );

  const getTracksByIds = useCallback(
    (ids: string[]): Track[] => {
      return ids.map((id) => tracks[id]).filter(Boolean);
    },
    [tracks]
  );

  const getAllTracks = useCallback((): Track[] => {
    return Object.values(tracks);
  }, [tracks]);

  return {
    tracks,
    loading,
    addTrack,
    addTracks,
    updateTrack,
    deleteTrack,
    getTrackById,
    getTracksByIds,
    getAllTracks,
    reload: loadTracks,
  };
}
