# Album Feature Task List

## Phase 1: Setup & Dependencies

[P]
- [ ] Install expo-media-library dependency
- [ ] Install @react-native-async-storage/async-storage dependency
- [ ] Install uuid package
- [ ] Configure permissions for media library access (iOS Info.plist, Android Manifest)

## Phase 2: Types & Constants

[P]
- [ ] Create types/album.ts with Track, MusicAlbum, Playlist, SharedAlbum interfaces
- [ ] Create constants/storage-keys.ts with STORAGE_KEYS constants

## Phase 3: Storage Layer

- [ ] Create hooks/use-storage.ts (base AsyncStorage CRUD utilities)
- [ ] Create hooks/use-tracks.ts (track CRUD: load from files, save, delete, getById)
- [ ] Create hooks/use-albums.ts (music album: load, getById, getAll)
- [ ] Create hooks/use-playlists.ts (playlist CRUD: create, update, delete, getById)

## Phase 4: Context Provider

- [ ] Create context/AlbumContext.tsx (album/playlist state with useReducer)
- [ ] Wrap app/_layout.tsx with AlbumContext provider

## Phase 5: Metadata Services

[P]
- [ ] Create services/metadata-scanner.ts (scan device for audio files, extract ID3 tags)
- [ ] Create services/album-generator.ts (group tracks by album metadata)

## Phase 6: UI Components

[P]
- [ ] Create components/album-cover.tsx (artwork with fallback logic)
- [ ] Create components/album-card.tsx (music album card for list view)
- [ ] Create components/playlist-card.tsx (playlist card for list view)
- [ ] Create components/track-list-item.tsx (track row with play/add actions)

## Phase 7: Screens

- [ ] Create app/albums/index.tsx (music albums list screen)
- [ ] Create app/playlists/index.tsx (playlists list screen)
- [ ] Create app/album/[id].tsx (music album detail with track list)
- [ ] Create app/playlist/[id].tsx (playlist detail with editable track list)
- [ ] Add "Create Playlist" modal with title/description inputs

## Phase 8: Playlist Editing

- [ ] Add "Add Track to Playlist" action sheet
- [ ] Add "Remove Track from Playlist" swipe action
- [ ] Add "Reorder Tracks" drag-and-drop (react-native-reanimated gesture handler)

## Phase 9: Deep Linking & Sharing

- [ ] Configure app.json with scheme: "musicapp" and linkPrefixes
- [ ] Create app/share/[type]/[id].tsx (shared album/playlist view screen)
- [ ] Add "Share" button to album/playlist detail screens
- [ ] Generate shareable link with Clipboard API
- [ ] Add "Revoke Link" option in playlist settings

## Phase 10: Navigation

- [ ] Add "Albums" tab to app/(tabs)/_layout.tsx
- [ ] Add "Playlists" tab to app/(tabs)/_layout.tsx
- [ ] Add "Add to Playlist" action from now-playing screen

## Phase 11: Integration

- [ ] Wire album scanning on app first launch
- [ ] Connect playlist creation/modification to audio player
- [ ] Test "Now Playing" queue from album/playlist

## Phase 12: Testing & Polish

[P]
- [ ] Test metadata extraction (MP3, M4A, FLAC files)
- [ ] Test playlist CRUD on iOS simulator
- [ ] Test playlist CRUD on Android emulator
- [ ] Test playlist CRUD on Web browser
- [ ] Test share link opening on each platform
- [ ] Test deep link routing (musicapp://share/...)
- [ ] Verify data persistence across app restarts
- [ ] Handle AsyncStorage quota errors gracefully

---

## Dependency Chain

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
                                      ↓
                                   Phase 8 (requires Phase 7)
                                      ↓
                                   Phase 9 (requires Phase 4, 7)
                                      ↓
                                   Phase 10 (requires Phase 7)
                                      ↓
                                   Phase 11 (requires Phase 4, 7, 10)
                                      ↓
                                   Phase 12
```
