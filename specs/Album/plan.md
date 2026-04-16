# Album Feature Implementation Plan

## High-Level Steps

1. Install required dependencies
2. Create data models (Track, Album, Playlist)
3. Build storage layer with AsyncStorage
4. Implement metadata extraction from audio files
5. Implement music album auto-detection
6. Implement playlist CRUD operations
7. Build UI screens (album list, playlist list, detail views)
8. Implement sharing via link
9. Integrate with existing audio player
10. Test on iOS/Android/Web

## Architecture Decisions

- **State Management:** React Context + useReducer for album/playlist state
- **Persistence:** AsyncStorage with keys @tracks, @albums, @playlists
- **ID Generation:** uuid for track/album/playlist IDs
- **Share Links:** Format: musicapp://share/{type}/{id}
- **Metadata:** expo-media-library for audio file scanning and ID3 extraction
- **Sharing:** expo-linking for deep links + Clipboard API

## Risk Assessment

- **Metadata Extraction:** Different audio formats (MP3, M4A, FLAC) have varying metadata support
- **Storage Limits:** AsyncStorage has ~6MB limit on some platforms — monitor playlist sizes
- **Share Link Routing:** Requires deep linking configuration in app.json
- **Track References:** Concurrent updates when removing tracks from multiple playlists

## Success Metrics

- Music albums auto-populate from scanned audio files
- Users can create, edit, and delete playlists
- Share links open correctly and display album/playlist on all platforms
- Data persists across app restarts
- No data loss when audio files are moved/deleted

## Files to Create/Modify

### Dependencies
- expo-media-library
- @react-native-async-storage/async-storage
- uuid

### New Files
- types/album.ts
- constants/storage-keys.ts
- hooks/use-storage.ts
- hooks/use-tracks.ts
- hooks/use-albums.ts
- hooks/use-playlists.ts
- services/metadata-scanner.ts
- services/album-generator.ts
- components/album-card.tsx
- components/playlist-card.tsx
- components/track-list-item.tsx
- components/album-cover.tsx
- app/albums.tsx
- app/playlists.tsx
- app/album/[id].tsx
- app/playlist/[id].tsx
- app/share/[type]/[id].tsx

### Modified Files
- app.json (deep linking config)
- app/_layout.tsx (context providers)
- app/(tabs)/_layout.tsx (add Albums/Playlists tabs)
