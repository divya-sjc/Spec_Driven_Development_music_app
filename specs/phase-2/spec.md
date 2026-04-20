# Phase 2 Specification: Music Library

## Overview
Implement music library scanning and loading from device storage with permission handling and pagination.

## Requirements

### Permission Service
- Use expo-media-library for cross-platform support (iOS & Android)
- Request permissions with useable UX flow
- Handle denied permission state with full-screen UI

### Music Scanning
- Fetch local audio files from device
- Implement pagination for large libraries (50 items per page)
- Filter out songs under 30 seconds

### Data Model
- ScanResult interface with pagination metadata
- ScanOptions for configurable scanning
- Song type alignment with types/Song.ts

## Acceptance Criteria
- Permission request flow works on iOS and Android
- Full-screen permission denied UI when access revoked
- Music loads with pagination (no blocking UI)
- Short songs (<30s) excluded from library

## Technical Details
- Use MediaLibrary.getAssetsAsync() with first/after cursor
- Implement loadAllSongs() for full library loading
- Filter by duration in asset processing
- Error handling with console.error pattern

## Files to Modify
- services/metadata-scanner.ts (add pagination, filtering)
- components/permission-denied.tsx (create permission UI)
- app/(tabs)/songs.tsx (integrate permission check)
- Update useLibraryStore.ts for scanning state