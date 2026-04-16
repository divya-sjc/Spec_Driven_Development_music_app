# Music App - Project Agent Documentation

## Project Overview

**Name:** music-app  
**Type:** Expo React Native Application  
**Version:** 1.0.0  
**Platform:** Cross-platform (iOS, Android, Web)  
**Architecture:** File-based routing with Expo Router

---

## Project Structure

```
music-app/
├── app/                          # Main application code (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab navigation layout
│   │   ├── index.tsx             # Home screen
│   │   └── explore.tsx           # Explore screen
│   ├── _layout.tsx               # Root layout with navigation stack
│   └── modal.tsx                 # Modal screen
├── components/                   # Reusable UI components
│   ├── ui/                       # UI component library
│   │   └── icon-symbol.tsx       # Icon component
│   ├── external-link.tsx         # External link handler
│   ├── haptic-tab.tsx            # Haptic feedback tab button
│   ├── hello-wave.tsx            # Animated wave component
│   ├── parallax-scroll-view.tsx  # Parallax scroll container
│   ├── themed-text.tsx           # Theme-aware text component
│   └── themed-view.tsx           # Theme-aware view component
├── constants/                    # App constants
│   └── theme.ts                  # Theme colors and styling
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts       # Color scheme detection (native)
│   ├── use-color-scheme.web.ts   # Color scheme detection (web)
│   └── use-theme-color.ts        # Theme color accessor
├── assets/                       # Static assets
│   └── images/                   # Image assets
├── docs/                         # Documentation directory
├── scripts/                      # Utility scripts
│   └── reset-project.js          # Project reset script
├── package.json                  # Project dependencies
├── app.json                      # Expo configuration
├── tsconfig.json                 # TypeScript configuration
└── eslint.config.js              # ESLint configuration
```

---

## Tech Stack

### Core Technologies
- **React:** 19.1.0
- **React Native:** 0.81.5
- **Expo:** ~54.0.33
- **TypeScript:** ~5.9.2

### Navigation & Routing
- **Expo Router:** ~6.0.23 (File-based routing)
- **React Navigation:**
  - @react-navigation/native: 7.1.8
  - @react-navigation/bottom-tabs: 7.4.0
  - @react-navigation/elements: 2.6.3

### UI & Styling
- **Expo Image:** ~3.0.11
- **Expo Vector Icons:** ^15.0.3
- **React Native Reanimated:** ~4.1.1
- **React Native Gesture Handler:** ~2.28.0
- **React Native Screens:** ~4.16.0
- **React Native Safe Area Context:** ~5.6.0

### Platform Support
- **Web:** React Native Web ~0.21.0
- **Android:** Adaptive icons, edge-to-edge enabled
- **iOS:** Tablet support enabled

### Development Tools
- **ESLint:** ^9.25.0 with expo config
- **Expo CLI:** Built-in development server
- **TypeScript:** Strict mode enabled

---

## Key Features

### Navigation Architecture
1. **Root Stack Navigator**
   - `(tabs)` - Main tab navigation (hidden header)
   - `modal` - Modal presentation screen

2. **Tab Navigator (Bottom Tabs)**
   - **Home Tab:** `index.tsx` - Welcome screen with parallax effect
   - **Explore Tab:** `explore.tsx` - Exploration content
   - Icons: SF Symbols via IconSymbol component
   - Haptic feedback on tab press

### Theme System
- **Automatic Color Scheme Detection:** Light/Dark mode support
- **ThemeProvider:** React Navigation theme integration
- **Themed Components:** ThemedText, ThemedView with automatic styling
- **Color Constants:** Centralized theme colors in constants/theme.ts

### UI Components
1. **ParallaxScrollView:** Scroll container with parallax header image
2. **ThemedText:** Text component with theme variants (title, subtitle, link, etc.)
3. **ThemedView:** View component with theme background colors
4. **IconSymbol:** Cross-platform icon component using SF Symbols
5. **HapticTab:** Tab button with haptic feedback
6. **HelloWave:** Animated waving hand component

---

## Development Commands

```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser

# Development tools
npm run lint     # Run ESLint
npm run reset-project  # Reset to fresh project state
```

---

## Configuration Files

### app.json (Expo Configuration)
```json
{
  "expo": {
    "name": "music-app",
    "slug": "music-app",
    "version": "1.0.0",
    "scheme": "musicapp",
    "orientation": "portrait",
    "newArchEnabled": true,
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

### tsconfig.json
- Extends Expo's base TypeScript config
- Path alias: `@/*` maps to project root
- Strict TypeScript mode enabled

---

## Path Aliases

The project uses TypeScript path aliasing for cleaner imports:

```typescript
// Instead of relative paths like:
import { Component } from '../../components/component';

// Use:
import { Component } from '@/components/component';
```

**Configured paths:**
- `@/*` → `./*` (project root)

---

## Current App Screens

### Home Screen (app/(tabs)/index.tsx)
- Parallax scroll view with React logo header
- Welcome message with animated wave
- Step-by-step guide for development
- Interactive Link component with menu actions
- Platform-specific developer tool shortcuts

### Explore Screen (app/(tabs)/explore.tsx)
- Additional content exploration
- Uses same UI components as Home

### Modal Screen (app/modal.tsx)
- Modal presentation
- Simple navigation demo
- Themed container and text

---

## Assets

Located in `assets/images/`:
- `icon.png` - App icon
- `splash-icon.png` - Splash screen icon
- `favicon.png` - Web favicon
- `partial-react-logo.png` - React logo for header
- Android adaptive icons:
  - `android-icon-foreground.png`
  - `android-icon-background.png`
  - `android-icon-monochrome.png`

---

## Dependencies to Note

### Production Dependencies
- React 19.1.0 & React Native 0.81.5 (Latest stable)
- Expo SDK ~54.0.33
- Expo Router for navigation
- React Native Reanimated for animations
- Expo Image for optimized image loading

### Key Expo Packages
- expo-splash-screen: Splash screen management
- expo-status-bar: Status bar styling
- expo-haptics: Haptic feedback
- expo-linking: Deep linking
- expo-web-browser: In-app browser
- expo-system-ui: System UI configuration

---

## Development Notes

### Hot Reload
- Changes in `app/` directory trigger automatic reloads
- File-based routing: create new files to add routes

### Theming
- Dark mode support built-in
- Automatic system preference detection
- Manual theme override possible via useColorScheme

### Reset Project
To start fresh:
```bash
npm run reset-project
```
This moves current `app/` to `app-example/` and creates empty `app/`.

---

## Next Steps / TODO

The project now includes basic audio integration. To further develop it into a full music app:

1. **Audio Integration:** ✅ Basic audio playback implemented with expo-av
   - AudioPlayer component added
   - Play/pause controls functional
   - Integrated into Explore tab

2. **Music Features:**
   - Playlist management
   - Track listing
   - Player controls (play, pause, skip)
   - Progress bar
   - Album art display

3. **Data Management:**
   - Local audio file handling
   - Metadata extraction
   - Playlist persistence

4. **UI Enhancements:**
   - Music-specific UI components
   - Now playing screen
   - Mini player
   - Queue management

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

---

*Generated by AI Assistant - Project scanned on April 16, 2026*

## Spec File Rules (SDD)

- All specs MUST be created under `/specs` directory
- Each phase must have its own folder:
  - `specs/phase-1/`
  - `specs/phase-2/`
  - `specs/phase-3/`
  - `specs/phase-4/`
- Spec file must be named exactly: `spec.md`
- Plan and tasks files must follow:
  - `plan.md`
  - `tasks.md`
- No spec files are allowed in the root directory
- Always create missing folders before writing spec files

## Agent Behavior Rules

- NEVER decide spec file location automatically — always follow `/specs/phase-x/`
- When generating specs, ALWAYS:
  1. Create correct folder structure
  2. Write to `spec.md`
- DO NOT implement code when asked to create a spec
- Follow SDD pipeline strictly:
  - Spec → Clarify → Plan → Tasks → Implement

