import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '@/types/Song';
import { Playlist } from '@/types/album';
import { v4 as uuidv4 } from 'uuid';

interface Album {
  id: string;
  title: string;
  description?: string;
  songIds: string[];
  createdAt: number;
  isSystem?: boolean;
}

interface LibraryState {
  songs: Record<string, Song>;
  playlists: Record<string, Playlist>;
  albums: Record<string, Album>;
  likedSongIds: string[];
  isLoading: boolean;
  isScanning: boolean;
  lastScanDate: number | null;
}

interface LibraryActions {
  // Songs
  setSongs: (songs: Record<string, Song>) => void;
  addSong: (song: Song) => void;
  addSongs: (songs: Song[]) => void;
  removeSong: (id: string) => void;
  getSongById: (id: string) => Song | undefined;
  getSongsByIds: (ids: string[]) => Song[];
  getAllSongs: () => Song[];

  // Playlists
  setPlaylists: (playlists: Record<string, Playlist>) => void;
  addPlaylist: (playlist: Playlist) => void;
  removePlaylist: (id: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  getAllPlaylists: () => Playlist[];
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;

  // Albums CRUD
  createAlbum: (title: string, description?: string) => Album;
  renameAlbum: (id: string, title: string) => boolean;
  deleteAlbum: (id: string) => boolean;
  getAlbumById: (id: string) => Album | undefined;
  getAllAlbums: () => Album[];
  addSongToAlbum: (albumId: string, songId: string) => void;
  removeSongFromAlbum: (albumId: string, songId: string) => void;

  // Liked Songs
  toggleLikeSong: (songId: string) => void;
  isSongLiked: (songId: string) => boolean;
  getLikedSongs: () => Song[];

  // System Albums
  generateSystemAlbums: (songs: Song[]) => Album[];

  // UI State
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
      likedSongIds: [],
      isLoading: true,
      isScanning: false,
      lastScanDate: null,

      setSongs: (songs) => set({ songs }),

      addSong: (song) => set((state) => ({ songs: { ...state.songs, [song.id]: song } })),

      addSongs: (songList) =>
        set((state) => {
          const newSongs = { ...state.songs };
          for (const song of songList) {
            if (song && song.id) {
              newSongs[song.id] = song;
            }
          }
          return { songs: newSongs };
        }),

      removeSong: (id) =>
        set((state) => {
          const { [id]: _, ...remaining } = state.songs;
          return { songs: remaining };
        }),

      getSongById: (id) => get().songs[id],

      getSongsByIds: (ids) => {
        const songs = get().songs;
        return ids.map((id) => songs[id]).filter(Boolean);
      },

      getAllSongs: () => Object.values(get().songs),

      setPlaylists: (playlists) => set({ playlists }),

      addPlaylist: (playlist) => set((state) => ({ playlists: { ...state.playlists, [playlist.id]: playlist } })),

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
              [playlistId]: { ...playlist, trackIds: [...playlist.trackIds, songId] },
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
              [playlistId]: { ...playlist, trackIds: playlist.trackIds.filter((id) => id !== songId) },
            },
          };
        }),

      // Albums CRUD
      createAlbum: (title, description) => {
        const album: Album = {
          id: uuidv4(),
          title,
          description,
          songIds: [],
          createdAt: Date.now(),
          isSystem: false,
        };
        set((state) => ({ albums: { ...state.albums, [album.id]: album } }));
        return album;
      },

      renameAlbum: (id, title) => {
        const album = get().albums[id];
        if (!album || album.isSystem) return false;
        set((state) => ({
          albums: { ...state.albums, [id]: { ...album, title } },
        }));
        return true;
      },

      deleteAlbum: (id) => {
        const album = get().albums[id];
        if (!album || album.isSystem) return false;
        set((state) => {
          const { [id]: _, ...remaining } = state.albums;
          return { albums: remaining };
        });
        return true;
      },

      getAlbumById: (id) => get().albums[id],

      getAllAlbums: () => Object.values(get().albums),

      addSongToAlbum: (albumId, songId) =>
        set((state) => {
          const album = state.albums[albumId];
          if (!album || album.songIds.includes(songId)) return state;
          return {
            albums: {
              ...state.albums,
              [albumId]: { ...album, songIds: [...album.songIds, songId] },
            },
          };
        }),

      removeSongFromAlbum: (albumId, songId) =>
        set((state) => {
          const album = state.albums[albumId];
          if (!album) return state;
          return {
            albums: {
              ...state.albums,
              [albumId]: { ...album, songIds: album.songIds.filter((id) => id !== songId) },
            },
          };
        }),

      // Liked Songs
      toggleLikeSong: (songId) =>
        set((state) => {
          const isLiked = state.likedSongIds.includes(songId);
          return {
            likedSongIds: isLiked
              ? state.likedSongIds.filter((id) => id !== songId)
              : [...state.likedSongIds, songId],
          };
        }),

      isSongLiked: (songId) => get().likedSongIds.includes(songId),

      getLikedSongs: () => {
        const songs = get().songs;
        return get().likedSongIds.map((id) => songs[id]).filter(Boolean);
      },

      // System Albums
      generateSystemAlbums: (songs) => {
        const artistAlbums = new Map<string, string[]>();
        const albumGroups = new Map<string, string[]>();

        for (const song of songs) {
          const artist = song.artist || 'Unknown Artist';
          const albumName = song.album || 'Unknown Album';

          if (!artistAlbums.has(artist)) {
            artistAlbums.set(artist, []);
          }
          artistAlbums.get(artist)!.push(song.id);

          if (!albumGroups.has(albumName)) {
            albumGroups.set(albumName, []);
          }
          albumGroups.get(albumName)!.push(song.id);
        }

        const systemAlbums: Album[] = [];
        const albums = get().albums;

        artistAlbums.forEach((songIds, artist) => {
          const existingAlbumId = Object.keys(albums).find(
            (id) => albums[id].isSystem && albums[id].title === `All from ${artist}`
          );
          if (existingAlbumId) {
            systemAlbums.push({ ...albums[existingAlbumId], songIds });
          } else {
            systemAlbums.push({
              id: uuidv4(),
              title: `All from ${artist}`,
              songIds,
              createdAt: Date.now(),
              isSystem: true,
            });
          }
        });

        albumGroups.forEach((songIds, title) => {
          const existingAlbumId = Object.keys(albums).find(
            (id) => albums[id].isSystem && albums[id].title === title
          );
          if (existingAlbumId) {
            systemAlbums.push({ ...albums[existingAlbumId], songIds });
          } else {
            systemAlbums.push({
              id: uuidv4(),
              title,
              songIds,
              createdAt: Date.now(),
              isSystem: true,
            });
          }
        });

        const newAlbums = { ...albums };
        for (const album of systemAlbums) {
          newAlbums[album.id] = album;
        }
        set({ albums: newAlbums });

        return systemAlbums;
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setScanning: (scanning) => set({ isScanning: scanning }),
      setLastScanDate: (date) => set({ lastScanDate: date }),
      clearLibrary: () =>
        set({
          songs: {},
          playlists: {},
          albums: {},
          likedSongIds: [],
          lastScanDate: null,
        }),
    }),
    {
      name: 'music-library-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        songs: state.songs,
        playlists: state.playlists,
        albums: state.albums,
        likedSongIds: state.likedSongIds,
        lastScanDate: state.lastScanDate,
      }),
    }
  )
);