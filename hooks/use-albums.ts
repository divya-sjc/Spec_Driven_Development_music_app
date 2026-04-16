import { useCallback, useEffect, useState } from 'react';
import { MusicAlbum } from '@/types/album';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { getItem, setItem } from './use-storage';

export function useAlbums() {
  const [albums, setAlbums] = useState<Record<string, MusicAlbum>>({});
  const [loading, setLoading] = useState(true);

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    const stored = await getItem<Record<string, MusicAlbum>>(STORAGE_KEYS.ALBUMS);
    setAlbums(stored || {});
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const saveAlbums = useCallback(async (newAlbums: Record<string, MusicAlbum>) => {
    const success = await setItem(STORAGE_KEYS.ALBUMS, newAlbums);
    if (success) {
      setAlbums(newAlbums);
    }
    return success;
  }, []);

  const addAlbum = useCallback(
    async (album: MusicAlbum): Promise<boolean> => {
      const newAlbums = { ...albums, [album.id]: album };
      return saveAlbums(newAlbums);
    },
    [albums, saveAlbums]
  );

  const addAlbums = useCallback(
    async (newAlbumList: MusicAlbum[]): Promise<boolean> => {
      const newAlbums = { ...albums };
      for (const album of newAlbumList) {
        newAlbums[album.id] = album;
      }
      return saveAlbums(newAlbums);
    },
    [albums, saveAlbums]
  );

  const deleteAlbum = useCallback(
    async (id: string): Promise<boolean> => {
      const { [id]: _, ...remaining } = albums;
      return saveAlbums(remaining);
    },
    [albums, saveAlbums]
  );

  const getAlbumById = useCallback(
    (id: string): MusicAlbum | undefined => {
      return albums[id];
    },
    [albums]
  );

  const getAllAlbums = useCallback((): MusicAlbum[] => {
    return Object.values(albums).sort((a, b) => a.title.localeCompare(b.title));
  }, [albums]);

  const getAlbumsByArtist = useCallback(
    (artist: string): MusicAlbum[] => {
      return Object.values(albums)
        .filter((album) => album.artist.toLowerCase() === artist.toLowerCase())
        .sort((a, b) => a.title.localeCompare(b.title));
    },
    [albums]
  );

  return {
    albums,
    loading,
    addAlbum,
    addAlbums,
    deleteAlbum,
    getAlbumById,
    getAllAlbums,
    getAlbumsByArtist,
    reload: loadAlbums,
  };
}
