import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Track, MusicAlbum, Playlist } from '@/types/album';
import { useTracks } from '@/hooks/use-tracks';
import { useAlbums } from '@/hooks/use-albums';
import { usePlaylists } from '@/hooks/use-playlists';

interface AlbumState {
  tracks: Record<string, Track>;
  albums: Record<string, MusicAlbum>;
  playlists: Record<string, Playlist>;
  loading: boolean;
}

type AlbumAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SYNC_STATE'; payload: { tracks: Record<string, Track>; albums: Record<string, MusicAlbum>; playlists: Record<string, Playlist> } };

function albumReducer(state: AlbumState, action: AlbumAction): AlbumState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SYNC_STATE':
      return {
        ...state,
        tracks: action.payload.tracks,
        albums: action.payload.albums,
        playlists: action.payload.playlists,
      };
    default:
      return state;
  }
}

interface AlbumContextValue extends AlbumState {
  addTrack: (track: Track) => Promise<boolean>;
  addTracks: (tracks: Track[]) => Promise<boolean>;
  updateTrack: (id: string, updates: Partial<Track>) => Promise<boolean>;
  deleteTrack: (id: string) => Promise<boolean>;
  getTrackById: (id: string) => Track | undefined;
  getTracksByIds: (ids: string[]) => Track[];

  addAlbum: (album: MusicAlbum) => Promise<boolean>;
  addAlbums: (albums: MusicAlbum[]) => Promise<boolean>;
  deleteAlbum: (id: string) => Promise<boolean>;
  getAlbumById: (id: string) => MusicAlbum | undefined;
  getAllAlbums: () => MusicAlbum[];

  createPlaylist: (title: string, description?: string, coverImage?: string) => Promise<Playlist | null>;
  updatePlaylist: (id: string, updates: Partial<Pick<Playlist, 'title' | 'description' | 'coverImage'>>) => Promise<boolean>;
  deletePlaylist: (id: string) => Promise<boolean>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
  reorderTracks: (playlistId: string, trackIds: string[]) => Promise<boolean>;
  getPlaylistById: (id: string) => Playlist | undefined;
  getAllPlaylists: () => Playlist[];
  generateShareLink: (playlistId: string) => Promise<string | null>;
  revokeShareLink: (playlistId: string) => Promise<boolean>;

  reload: () => Promise<void>;
}

const AlbumContext = createContext<AlbumContextValue | null>(null);

export function AlbumProvider({ children }: { children: ReactNode }) {
  const tracksHook = useTracks();
  const albumsHook = useAlbums();
  const playlistsHook = usePlaylists();

  const [state, dispatch] = useReducer(albumReducer, {
    tracks: {},
    albums: {},
    playlists: {},
    loading: true,
  });

  useEffect(() => {
    const isLoading = tracksHook.loading || albumsHook.loading || playlistsHook.loading;
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, [tracksHook.loading, albumsHook.loading, playlistsHook.loading]);

  useEffect(() => {
    dispatch({
      type: 'SYNC_STATE',
      payload: {
        tracks: tracksHook.tracks,
        albums: albumsHook.albums,
        playlists: playlistsHook.playlists,
      },
    });
  }, [tracksHook.tracks, albumsHook.albums, playlistsHook.playlists]);

  const value: AlbumContextValue = {
    ...state,
    addTrack: tracksHook.addTrack,
    addTracks: tracksHook.addTracks,
    updateTrack: tracksHook.updateTrack,
    deleteTrack: tracksHook.deleteTrack,
    getTrackById: tracksHook.getTrackById,
    getTracksByIds: tracksHook.getTracksByIds,
    addAlbum: albumsHook.addAlbum,
    addAlbums: albumsHook.addAlbums,
    deleteAlbum: albumsHook.deleteAlbum,
    getAlbumById: albumsHook.getAlbumById,
    getAllAlbums: albumsHook.getAllAlbums,
    createPlaylist: playlistsHook.createPlaylist,
    updatePlaylist: playlistsHook.updatePlaylist,
    deletePlaylist: playlistsHook.deletePlaylist,
    addTrackToPlaylist: playlistsHook.addTrackToPlaylist,
    removeTrackFromPlaylist: playlistsHook.removeTrackFromPlaylist,
    reorderTracks: playlistsHook.reorderTracks,
    getPlaylistById: playlistsHook.getPlaylistById,
    getAllPlaylists: playlistsHook.getAllPlaylists,
    generateShareLink: playlistsHook.generateShareLink,
    revokeShareLink: playlistsHook.revokeShareLink,
    reload: async () => {
      await Promise.all([tracksHook.reload(), albumsHook.reload(), playlistsHook.reload()]);
    },
  };

  return <AlbumContext.Provider value={value}>{children}</AlbumContext.Provider>;
}

export function useAlbumContext(): AlbumContextValue {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error('useAlbumContext must be used within an AlbumProvider');
  }
  return context;
}
