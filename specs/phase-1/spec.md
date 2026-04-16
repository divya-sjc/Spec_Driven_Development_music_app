# Phase 1 Specification: Basic Audio Integration

## Overview
Implement basic audio playback functionality for the music app using Expo AV.

## Requirements
- Install and configure expo-av package
- Create a basic audio player component
- Add play/pause functionality
- Display current track information
- Handle audio loading states

## Acceptance Criteria
- User can load and play audio files
- Play/pause controls work correctly
- Audio status is displayed (playing/paused/loading)
- Component integrates with existing theme system

## Technical Details
- Use expo-av for cross-platform audio support
- Follow existing component patterns (ThemedView, ThemedText)
- Integrate with Expo Router navigation
- Ensure TypeScript compatibility

## Files to Create/Modify
- Install expo-av dependency
- Create components/audio-player.tsx
- Update package.json
- Test on iOS/Android/Web platforms