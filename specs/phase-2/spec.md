# Phase 2 Specification: Device Access & Music Discovery

## Overview
Implement complete device media permission handling and a full pipeline to scan, normalize, and store local audio files as structured Song data for playback.

## Requirements

### 1. Permission Service
- **Platform Support:** Use expo-media-library for both iOS & Android
- **Permission Flow:**
  - Request on first app launch
  - Handle all states: 'granted', 'denied', 'undetermined'
  - Detect permanently blocked permissions
  - Provide settings redirect for blocked access
- **UX:** Full-screen permission denied UI when access revoked
- **API:** requestPermissionsAsync(), getPermissionsAsync()

### 2. Music Discovery Pipeline
- **Scanning:** Use MediaLibrary.getAssetsAsync() with mediaType: MediaLibrary.MediaType.audio
- **Pagination:** Implement cursor-based pagination (first/after parameters)
  - Default batch size: 50 items
  - Support hasNextPage for infinite libraries
- **Normalization:**
  - Extract title from filename (remove extension)
  - Default artist to "Unknown Artist" if missing
  - Extract duration in seconds
  - Get file:// URI for audio playback
- **Filtering:** Exclude songs under 30 seconds (voice memos, ringtones)

### 3. Data Processing
- **Asset to Song Conversion:**
  - Map MediaLibrary.Asset to Song type
  - Handle missing metadata gracefully
  - Deduplicate by file URI
- **Error Handling:**
  - Skip corrupt/unreadable files
  - Log errors with console.error
  - Continue processing on individual file failures

### 4. Storage Integration
- **Persistence:** Store scanned songs in useLibraryStore
- **Schema:** Record<string, Song> for O(1) lookups
- **Persisted State:** Survives app restarts via Zustand persist

## Technical Implementation

### interfaces
```typescript
interface ScanResult {
  songs: Song[];
  totalScanned: number;
  hasMore: boolean;
  errors: string[];
}

interface ScanOptions {
  first?: number;      // Items per page (default: 50)
  after?: string;    // Pagination cursor
  filterShort?: boolean;  // Filter <30s songs
}
```

### Functions Required
```typescript
// Permission handling
requestPermissions(): Promise<boolean>
checkPermissions(): Promise<boolean>

// Music scanning
scanDeviceForAudio(options: ScanOptions): Promise<ScanResult>
loadAllSongs(filterShort?: boolean): Promise<{ songs: Song[], errors: string[] }>

// Asset conversion
assetToSong(asset: MediaLibrary.Asset): Song | null
```

### File Structure
- services/metadata-scanner.ts - Main scanning service
- components/permission-denied.tsx - Permission denied UI
- stores/useLibraryStore.ts - Song storage with persistence

## Platform Configuration

### iOS (app.json)
```json
{
  "infoPlist": {
    "NSAppleMusicUsageDescription": "Access music library to display and play songs",
    "UIBackgroundModes": ["audio"]
  }
}
```

### Android (app.json)
```json
{
  "permissions": ["READ_EXTERNAL_STORAGE", "READ_MEDIA_AUDIO"]
}
```

## Acceptance Criteria

1. ✅ Permission request works on first launch
2. ✅ Permission denied UI shows when access revoked
3. ✅ Music loads with pagination (no UI blocking)
4. ✅ Songs under 30 seconds filtered from library
5. ✅ All songs have structured data: id, title, artist, duration, audioUri
6. ✅ Data persists across app restarts
7. ✅ Graceful error handling for corrupt/missing files

## Files to Create/Modify
- services/metadata-scanner.ts - Complete scanning implementation
- components/permission-denied.tsx - Permission UI component
- app/(tabs)/songs.tsx - Integrate permission flow
- stores/useLibraryStore.ts - Add scanning state actions