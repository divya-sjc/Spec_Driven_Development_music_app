# Phase 3 Specification: Song List & Playback

## Overview
Implement song list with all states, audio playback with async configuration, and Now Playing modal with seek controls.

## Requirements

### Song List States
- Loading state while fetching songs
- Empty state when no songs found
- Permission denied state when access revoked
- Error state for failed operations

### Async Audio Configuration
- Configure expo-av with correct flags for iOS and Android
- Enable background audio playback
- Handle audio focus properly

### Queue Management
- Tapping a song loads the full list into queue
- Play from tapped song index

### Now Playing Modal
- Opens as modal presentation
- Seek bar with progress indicator
- Play/pause, next, previous controls
- Display current song info

### Search & Sort
- Search songs by title/artist
- Sort by title, artist, album, date added
- Local state management (useState)

## Acceptance Criteria
- All 4 states displayed correctly in Song List
- Audio plays in background on both platforms
- Tapping song starts playback from that song
- Now Playing shows seek bar and all controls
- Search filters songs in real-time
- Sort orders songs correctly

## Technical Details
- Use Audio.setAudioModeAsync() for configuration
- Queue managed via Zustand store
- Search/sort with useState in component
- Modal route: now-playing.tsx

## Files to Create/Modify
- specs/phase-3/spec.md
- app/(tabs)/songs.tsx (add states)
- app/now-playing.tsx (seek bar, controls)
- stores/usePlayerStore.ts (queue actions)
- services/audio-config.ts (async audio setup)
