import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '@/types/Song';
import { Playlist } from '@/types/album';

interface LibraryState {
  songs: Record<string, Song>;
  playlists: Record<string, Playlist>;
  albums: Record<string, { id: string; title: string; artist: string; artwork?: string }>;
  isLoading: boolean;
  isScanning: boolean;
  lastScanDate: number | null;
}

interface LibraryActions {
  setSongs: (songs: Record<string, Song>) => void;
  addSong: (song: Song) => void;
  addSongs: (songs: Song[]) => void;
  removeSong: (id: string) => void;
  updateSong: (id: string, updates: Partial<Song>) => void;
  getSongById: (id: string) => Song | undefined;
  getSongsByIds: (ids: string[]) => Song[];
  getAllSongs: () => Song[];

  setPlaylists: (playlists: Record<string, Playlist>) => void;
  addPlaylist: (playlist: Playlist) => void;
  removePlaylist: (id: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  getAllPlaylists: () => Playlist[];

  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;

  setLoading: (loading: boolean) => void;
  setScanning: (scanning: boolean) => void;
  setLastScanDate: (date: number) => void;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryState & LibraryActions>()(
  persist(
    (set, get) => ({
      songs: {},
      playlists: {},
      albums: {},
      isLoading: true,
      isScanning: false,
      lastScanDate: null,

      setSongs: (songs) => set({ songs }),

      addSong: (song) =>
        set((state) => ({
          songs: { ...state.songs, [song.id]: song },
        })),

      addSongs: (songList) =>
        set((state) => {
          const newSongs = { ...state.songs };
          for (const song of songList) {
            newSongs[song.id] = song;
          }
          return { songs: newSongs };
        }),

      removeSong: (id) =>
        set((state) => {
          const { [id]: _, ...remaining } = state.songs;
          return { songs: remaining };
        }),

      updateSong: (id, updates) =>
        set((state) => ({
          songs: {
            ...state.songs,
            [id]: { ...state.songs[id], ...updates },
          },
        })),

      getSongById: (id) => get().songs[id],

      getSongsByIds: (ids) => {
        const songs = get().songs;
        return ids.map((id) => songs[id]).filter(Boolean);
      },

      getAllSongs: () => Object.values(get().songs),

      setPlaylists: (playlists) => set({ playlists }),

      addPlaylist: (playlist) =>
        set((state) => ({
          playlists: { ...state.playlists, [playlist.id]: playlist },
        })),

      removePlaylist: (id) =>
        set((state) => {
          const { [id]: _, ...remaining } = state.playlists;
          return { playlists: remaining };
        }),

      getPlaylistById: (id) => get().playlists[id],

      getAllPlaylists: () => Object.values(get().playlists),

      addToPlaylist: (playlistId, songId) =>
        set((state) => {
          const playlist = state.playlists[playlistId];
          if (!playlist || playlist.trackIds.includes(songId)) return state;
          return {
            playlists: {
              ...state.playlists,
              [playlistId]: {
                ...playlist,
                trackIds: [...playlist.trackIds, songId],
              },
            },
          };
        }),

      removeFromPlaylist: (playlistId, songId) =>
        set((state) => {
          const playlist = state.playlists[playlistId];
          if (!playlist) return state;
          return {
            playlists: {
              ...state.playlists,
              [playlistId]: {
                ...playlist,
                trackIds: playlist.trackIds.filter((id) => id !== songId),
              },
            },
          };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setScanning: (scanning) => set({ isScanning: scanning }),

      setLastScanDate: (date) => set({ lastScanDate: date }),

      clearLibrary: () =>
        set({
          songs: {},
          playlists: {},
          albums: {},
          lastScanDate: null,
        }),
    }),
    {
      name: 'music-library-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        songs: state.songs,
        playlists: state.playlists,
        lastScanDate: state.lastScanDate,
      }),
    }
  )
);
