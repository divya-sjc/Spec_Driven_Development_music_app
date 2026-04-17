export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audioUri: string;
  artworkUri?: string;
  releaseYear?: number;
  genre?: string;
  trackNumber?: number;
  createdAt: number;
}

export type SongSortBy = 'title' | 'artist' | 'album' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
