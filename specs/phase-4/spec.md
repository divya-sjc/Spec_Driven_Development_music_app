# Phase 4 Specification: Advanced Features

## Overview
Implement advanced music app features including liked songs, albums CRUD, error handling, repeat/shuffle, queue actions, and system albums.

## Requirements

### Liked Songs
- Persist liked songs after app restart
- Use Zustand with persist middleware
- Toggle like/unlike in now-playing

### Albums CRUD
- Create new album
- Rename album
- Delete album
- Full functional in store

### Error Handling
- Handle missing audio files gracefully
- Handle corrupt files without crashing
- Skip invalid files, log errors

### Repeat & Shuffle
- Repeat off / all / one
- Shuffle on / off
- Correct state management

### Queue Actions
- Play Now (replace queue)
- Play Next (insert at current position)
- Add to Queue (append to end)

### System Albums
- Group by artist metadata
- Group by album metadata
- Display system-generated albums

## Acceptance Criteria
- Liked songs persist across restarts
- Albums can be created/renamed/deleted
- App doesn't crash on missing files
- Repeat/shuffle work correctly
- All queue actions function properly
- System albums grouped by metadata

## Technical Details
- Use Zustand persist with AsyncStorage
- Add error boundaries in audio player
- Queue actions in usePlayerStore
- Album metadata grouping in services

## Files to Create/Modify
- specs/phase-4/spec.md
- stores/usePlayerStore.ts
- stores/useLibraryStore.ts
- services/album-generator.ts
- app/now-playing.tsx
- docs/implementation.md