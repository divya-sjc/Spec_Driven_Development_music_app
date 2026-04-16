# Album Feature Data Model

## Track

```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;     // seconds
  audioUri: string;     // local file URI
  artworkUri?: string;  // embedded artwork URI
}
```

## MusicAlbum

```typescript
interface MusicAlbum {
  id: string;
  type: 'music';
  title: string;
  artist: string;
  releaseYear?: number;
  coverImage: string;   // artwork URI
  trackIds: string[];  // ordered track references
  createdAt: number;    // Unix timestamp
  shareLink?: string;
}
```

## Playlist

```typescript
interface Playlist {
  id: string;
  type: 'playlist';
  title: string;        // max 100 characters
  description?: string;
  coverImage: string;   // artwork URI
  trackIds: string[];  // ordered, duplicates allowed
  createdAt: number;
  updatedAt: number;
  shareLink?: string;
}
```

## SharedAlbum (for share links)

```typescript
interface SharedAlbum {
  type: 'music' | 'playlist';
  title: string;
  artist?: string;      // only for music albums
  description?: string; // only for playlists
  coverImage: string;
  tracks: Pick<Track, 'id' | 'title' | 'artist' | 'duration'>[];
}
```

## Storage Schema

```typescript
// AsyncStorage keys
const STORAGE_KEYS = {
  TRACKS: '@tracks',        // Record<string, Track>
  ALBUMS: '@albums',        // Record<string, MusicAlbum>
  PLAYLISTS: '@playlists',  // Record<string, Playlist>
};
```

## Relationships

```
Track (1) ←—————→ (many) MusicAlbum
Track (1) ←—————→ (many) Playlist

- Tracks are references (shared), not copied
- Deleting a Track removes it from all Albums/Playlists
- Deleting an Album/Playlist does NOT delete the Tracks
```
