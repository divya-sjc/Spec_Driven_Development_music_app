# Music App - Project Summary

## Overview

A cross-platform music app built with Expo for iOS, Android, and Web.

## Project Structure

```
music-app/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── songs.tsx            # Songs tab
│   │   └── library.tsx          # Library tab
│   ├── album/[id].tsx            # Album detail
│   ├── playlist/[id].tsx         # Playlist detail
│   ├── now-playing.tsx           # Now Playing modal
│   └── _layout.tsx               # Root layout
│
├── components/                    # Reusable UI components
│   ├── album-card.tsx
│   ├── album-cover.tsx
│   ├── playlist-card.tsx
│   ├── track-list-item.tsx
│   ├── mini-player.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
│
├── context/                       # React Context providers
│   ├── AlbumContext.tsx
│   └── AudioContext.tsx
│
├── hooks/                         # Custom React hooks
│   ├── use-albums.ts
│   ├── use-playlists.ts
│   ├── use-storage.ts
│   └── use-tracks.ts
│
├── services/                      # Business logic
│   ├── album-generator.ts
│   └── metadata-scanner.ts
│
├── stores/                        # Zustand stores
│   ├── usePlayerStore.ts
│   └── useLibraryStore.ts
│
├── types/                         # TypeScript types
│   ├── Song.ts
│   └── album.ts
│
├── utils/                         # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
│
├── constants/                     # App constants
│   ├── storage-keys.ts
│   └── theme.ts
│
├── specs/                         # Feature specs (SDD)
│   ├── Album/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   └── data-model.md
│   └── phase-1/
│
└── agent.md                       # Project documentation
```

## Tech Stack

| Category | Technology |
|---------|------------|
| Framework | Expo SDK 54 |
| Runtime | React 19.1, React Native 0.81.5 |
| Routing | Expo Router (file-based) |
| State | Zustand + React Context |
| Persistence | AsyncStorage |
| Audio | expo-av |
| Media | expo-media-library |
| Language | TypeScript (strict mode) |

## Features Implemented

### Phase 1: Audio Integration
- Audio playback with expo-av
- AudioPlayer component
- Play/pause controls

### Album Feature
- Albums auto-generated from device audio metadata
- Playlist CRUD operations
- Track management
- Add to Playlist functionality
- Share link generation (deep links)
- Media library permissions configured

### Design System
- Color tokens (light/dark mode)
- Typography scale
- Spacing scale
- Border radius, icon sizes
- Themed components (ThemedText, ThemedView)

### Navigation
- Bottom tabs: Songs, Library
- Now Playing modal
- Album/Playlist detail screens

## Dependencies

### Core
- expo@54.0.33
- react@19.1.0
- react-native@0.81.5

### Audio & Media
- expo-av@16.0.8
- expo-media-library@18.2.1
- @react-native-async-storage/async-storage@2.2.0

### Navigation
- expo-router@6.0.23
- @react-navigation/native@7.2.2
- @react-navigation/bottom-tabs@7.15.9

### UI & Utilities
- expo-image, expo-haptics, expo-clipboard
- react-native-reanimated
- react-native-gesture-handler
- zustand (state management)
- lodash

## Coding Conventions

### Components
- Named exports: `export function ComponentName()`
- Props interface: `<ComponentName>Props`
- StyleSheet.create() for styles

### State Management
- Zustand stores for global state
- React Context for dependency injection
- `use<EntityName>` hook pattern

### TypeScript
- Strict mode enabled
- Discriminated unions for polymorphic types
- Interface over type for props

### Error Handling
- Try/catch with console.error
- Return null/false on failure
- User errors via Alert.alert()

## Path Aliases

```typescript
// Use:
import { Song } from '@/types/Song';

// Instead of:
import { Song } from '../../types/Song';
```

## Quick Start

```bash
npm install
npx expo start

# Platform-specific
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## Platform Configuration

### iOS
- Bundle ID: com.musicapp
- Background modes: audio
- Music library permissions

### Android
- Package: com.musicapp
- Permissions: READ_EXTERNAL_STORAGE, READ_MEDIA_AUDIO
- Deep linking: musicapp://

## GitHub Repository

https://github.com/divya-sjc/Spec_Driven_Development_music_app

## Development Notes

- Hot reload enabled in app/ directory
- Dark mode support built-in
- Path alias `@/*` maps to project root
- SDD pipeline: Spec → Clarify → Plan → Tasks → Implement
