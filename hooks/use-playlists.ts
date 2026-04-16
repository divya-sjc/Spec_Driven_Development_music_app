import { useCallback, useEffect, useState } from 'react';
import { Playlist } from '@/types/album';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { getItem, setItem } from './use-storage';
import { v4 as uuidv4 } from 'uuid';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Record<string, Playlist>>({});
  const [loading, setLoading] = useState(true);

  const loadPlaylists = useCallback(async () => {
    setLoading(true);
    const stored = await getItem<Record<string, Playlist>>(STORAGE_KEYS.PLAYLISTS);
    setPlaylists(stored || {});
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const savePlaylists = useCallback(async (newPlaylists: Record<string, Playlist>) => {
    const success = await setItem(STORAGE_KEYS.PLAYLISTS, newPlaylists);
    if (success) {
      setPlaylists(newPlaylists);
    }
    return success;
  }, []);

  const createPlaylist = useCallback(
    async (title: string, description?: string, coverImage?: string): Promise<Playlist | null> => {
      const now = Date.now();
      const playlist: Playlist = {
        id: uuidv4(),
        type: 'playlist',
        title: title.slice(0, 100),
        description,
        coverImage: coverImage || '',
        trackIds: [],
        createdAt: now,
        updatedAt: now,
      };
      const newPlaylists = { ...playlists, [playlist.id]: playlist };
      const success = await savePlaylists(newPlaylists);
      return success ? playlist : null;
    },
    [playlists, savePlaylists]
  );

  const updatePlaylist = useCallback(
    async (id: string, updates: Partial<Pick<Playlist, 'title' | 'description' | 'coverImage'>>): Promise<boolean> => {
      const existing = playlists[id];
      if (!existing) return false;
      const updated: Playlist = {
        ...existing,
        ...updates,
        title: updates.title ? updates.title.slice(0, 100) : existing.title,
        updatedAt: Date.now(),
      };
      const newPlaylists = { ...playlists, [id]: updated };
      return savePlaylists(newPlaylists);
    },
    [playlists, savePlaylists]
  );

  const deletePlaylist = useCallback(
    async (id: string): Promise<boolean> => {
      const { [id]: _, ...remaining } = playlists;
      return savePlaylists(remaining);
    },
    [playlists, savePlaylists]
  );

  const addTrackToPlaylist = useCallback(
    async (playlistId: string, trackId: string): Promise<boolean> => {
      const playlist = playlists[playlistId];
      if (!playlist) return false;
      if (playlist.trackIds.includes(trackId)) return true;
      const updated: Playlist = {
        ...playlist,
        trackIds: [...playlist.trackIds, trackId],
        updatedAt: Date.now(),
      };
      const newPlaylists = { ...playlists, [playlistId]: updated };
      return savePlaylists(newPlaylists);
    },
    [playlists, savePlaylists]
  );

  const removeTrackFromPlaylist = useCallback(
    async (playlistId: string, trackId: string): Promise<boolean> => {
      const playlist = playlists[playlistId];
      if (!playlist) return false;
      const updated: Playlist = {
        ...playlist,
        trackIds: playlist.trackIds.filter((id) => id !== trackId),
        updatedAt: Date.now(),
      };
      const newPlaylists = { ...playlists, [playlistId]: updated };
      return savePlaylists(newPlaylists);
    },
    [playlists, savePlaylists]
  );

  const reorderTracks = useCallback(
    async (playlistId: string, trackIds: string[]): Promise<boolean> => {
      const playlist = playlists[playlistId];
      if (!playlist) return false;
      const updated: Playlist = {
        ...playlist,
        trackIds,
        updatedAt: Date.now(),
      };
      const newPlaylists = { ...playlists, [playlistId]: updated };
      return savePlaylists(newPlaylists);
    },
    [playlists, savePlaylists]
  );

  const getPlaylistById = useCallback(
    (id: string): Playlist | undefined => {
      return playlists[id];
    },
    [playlists]
  );

  const getAllPlaylists = useCallback((): Playlist[] => {
    return Object.values(playlists).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [playlists]);

  const generateShareLink = useCallback(
    async (playlistId: string): Promise<string | null> => {
      const playlist = playlists[playlistId];
      if (!playlist) return null;
      const shareLink = `musicapp://share/playlist/${playlistId}`;
      const updated: Playlist = {
        ...playlist,
        shareLink,
        updatedAt: Date.now(),
      };
      const newPlaylists = { ...playlists, [playlistId]: updated };
      const success = await savePlaylists(newPlaylists);
      return success ? shareLink : null;
    },
    [playlists, savePlaylists]
  );

  const revokeShareLink = useCallback(
    async (playlistId: string): Promise<boolean> => {
      const playlist = playlists[playlistId];
      if (!playlist) return false;
      const { shareLink: _, ...updated } = playlist;
      const newPlaylists = { ...playlists, [playlistId]: updated };
      return savePlaylists(newPlaylists);
    },
    [playlists, savePlaylists]
  );

  return {
    playlists,
    loading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracks,
    getPlaylistById,
    getAllPlaylists,
    generateShareLink,
    revokeShareLink,
    reload: loadPlaylists,
  };
}
