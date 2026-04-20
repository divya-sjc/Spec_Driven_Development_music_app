# Music App - Specification Document

## 1. Project Overview

**Project Name:** music-app  
**Type:** Expo React Native Application  
**Platform:** Cross-platform (iOS, Android, Web)  
**Architecture:** File-based routing with Expo Router

---

## 2. Project Structure

```
music-app/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab layout with Songs & Library
│   │   ├── songs.tsx            # Songs list screen
│   │   ├── library.tsx          # Library stats screen
│   │   ├── albums.tsx           # Albums list (legacy)
│   │   └── playlists.tsx      # Playlists list (legacy)
│   ├── _layout.tsx              # Root layout with providers
│   ├── now-playing.tsx         # Now Playing modal
│   ├── album/[id].tsx          # Album detail
│   └── playlist/[id].tsx        # Playlist detail
│
├── components/                   # Reusable UI components
│   ├── album-card.tsx
│   ├── album-cover.tsx
│   ├── permission-denied.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── track-list-item.tsx
│   └── ui/
│
├── context/                       # React Context
│   ├── AlbumContext.tsx
│   └── AudioContext.tsx
│
├── hooks/                         # Custom React hooks
│   ├── use-storage.ts
│   ├── use-albums.ts
│   ├── use-playlists.ts
│   └── use-tracks.ts
│
├── services/                      # Business logic
│   ├── audio-player.ts
│   ├── metadata-scanner.ts
│   └── album-generator.ts
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
│   ├── colors.ts                # Color tokens
│   ├── typography.ts           # Typography scale
│   ├── spacing.ts              # Spacing tokens
│   ├── formatters.ts          # Utility formatters
│   └── index.ts               # Re-exports
│
├── constants/                     # App constants
│   ├── theme.ts
│   └── storage-keys.ts
│
└── specs/                         # Feature specifications
    ├── phase-1/
    ├── phase-2/
    ├── phase-3/
    └── phase-4/
```

---

## 3. Design System

### Colors (`utils/colors.ts`)
```typescript
const colors = {
  primary: '#0a7ea4',
  secondary: '#687076',
  background: { light: '#ffffff', dark: '#151718' },
  surface: { light: '#f5f5f5', dark: '#1D1D1D' },
  text: { primary: { light: '#11181C', dark: '#ECEDEE' }, secondary: {...} },
  tint: { light: '#0a7ea4', dark: '#ffffff' },
  icon: { light: '#687076', dark: '#9BA1A6' },
  border: { light: '#E5E5E5', dark: '#333333' },
  error: '#dc3545',
  success: '#28a745',
};
```

### Typography (`utils/typography.ts`)
```typescript
const fontSizes = { xs: 10, sm: 12, base: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 28, '4xl': 32 };
const fontWeights = { regular: '400', medium: '500', semibold: '600', bold: '700' };
const typography = { h1, h2, h3, h4, body, bodySmall, caption, button };
```

### Spacing (`utils/spacing.ts`)
```typescript
const spacing = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, ... };
const borderRadius = { none: 0, sm: 4, base: 8, md: 12, lg: 16, full: 9999 };
```

---

## 4. Dependencies

### Core
- `expo@~54.0.33` - Framework
- `react@19.1.0` - UI library
- `react-native@0.81.5` - Mobile runtime

### Navigation
- `expo-router@~6.0.23` - File-based routing
- `@react-navigation/native@7.1.8` - Navigation core
- `@react-navigation/bottom-tabs@7.4.0` - Tab navigation

### Audio & Media
- `expo-av@16.0.8` - Audio playback
- `expo-media-library@18.2.1` - Device media access
- `@react-native-async-storage/async-storage@2.2.0` - Persistence

### State Management
- `zustand` - Zustand for global state

### UI & Utilities
- `expo-image`, `expo-haptics`, `expo-clipboard`
- `react-native-reanimated`, `react-native-gesture-handler`

---

## 5. Navigation

### Tab Navigator Structure
```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen name="songs" title="Songs" />
  <Tabs.Screen name="library" title="Library" />
</Tabs>
```

### Screen Routes
- `/songs` - Songs tab (list all songs)
- `/library` - Library tab (stats/playlists)
- `/now-playing` - Modal (Now Playing screen)
- `/album/[id]` - Album detail
- `/playlist/[id]` - Playlist detail

---

## 6. State Management Architecture

### usePlayerStore (Zustand)
```typescript
{
  currentSong: Song | null,
  isPlaying: boolean,
  queue: Song[],
  queueIndex: number,
  shuffleMode: 'off' | 'on',
  repeatMode: 'off' | 'all' | 'one',
  position: number,
  duration: number,
  volume: number,
}
```

### useLibraryStore (Zustand with persistence)
```typescript
{
  songs: Record<string, Song>,
  playlists: Record<string, Playlist>,
  albums: Record<string, Album>,
  likedSongIds: string[],
  isLoading: boolean,
}
```

---

## 7. Platform Configuration

### iOS (app.json)
```json
{
  "ios": {
    "infoPlist": {
      "NSAppleMusicUsageDescription": "...",
      "NSPhotoLibraryUsageDescription": "...",
      "UIBackgroundModes": ["audio"]
    }
  }
}
```

### Plugins
- `expo-media-library` - Media access
- `expo-av` - Audio playback with background mode
- `expo-router` - Navigation

---

## 8. Error Handling Pattern

```typescript
try {
  const value = await asyncOperation();
  return value;
} catch (error) {
  console.error('Error:', error);
  return null; // or false
}
```

---

## 9. Path Alias

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

Usage: `import { Song } from '@/types/Song'`

---

## 10. Quick Start Commands

```bash
npm install           # Install dependencies
npx expo start        # Start dev server
npm run ios           # Run on iOS
npm run android      # Run on Android
npm run web           # Run on web
```

---

*Generated for Spec-Driven Development Music App Project*