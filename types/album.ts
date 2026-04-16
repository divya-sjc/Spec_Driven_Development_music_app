export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUri: string;
  artworkUri?: string;
}

export interface MusicAlbum {
  id: string;
  type: 'music';
  title: string;
  artist: string;
  releaseYear?: number;
  coverImage: string;
  trackIds: string[];
  createdAt: number;
  shareLink?: string;
}

export interface Playlist {
  id: string;
  type: 'playlist';
  title: string;
  description?: string;
  coverImage: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
  shareLink?: string;
}

export type AlbumType = 'music' | 'playlist';

export interface SharedAlbum {
  type: AlbumType;
  title: string;
  artist?: string;
  description?: string;
  coverImage: string;
  tracks: Pick<Track, 'id' | 'title' | 'artist' | 'duration'>[];
}

export type Album = MusicAlbum | Playlist;
