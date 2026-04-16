---
Album Feature Specification

Overview
Enable users to organize and share music content through traditional music albums and user-curated playlists.

What It Solves
- Users need to group tracks for listening sessions or themes
- Sharing favorite music collections with friends
- Distinguishing between official album releases and personal mixes

Types

Music Albums
- Source: Imported metadata from audio files (artist, release year, artwork)
- Contents: Fixed track list from metadata
- Editable: No (tracks are determined by audio metadata)

Playlists
- Source: User-created collections
- Contents: Any tracks, user-defined order
- Editable: Yes (add, remove, reorder tracks)

Data Model

Album Entity
- id: Unique identifier
- type: "music" | "playlist"
- title: Display name
- description: Optional description (playlists only)
- coverImage: Album artwork
- trackIds: Ordered list of track references
- createdAt: Creation timestamp
- updatedAt: Last modified timestamp
- shareLink: Optional public sharing identifier

Constraints
- Title: Required, max 100 characters
- Tracks per album: No hard limit
- Duplicate tracks in same playlist: Allowed

Sharing

Share via Link
- Generate unique shareable URL
- Recipients can view/listen, not edit
- Link can be copied to clipboard
- Shareable from album detail screen

User Interactions
User Interactions
Action	Music Album	Playlist
Create	No (auto-generated from metadata)	Yes
Rename	No	Yes
Add tracks	No	Yes
Remove tracks	No	Yes
Reorder tracks	No	Yes
Delete	No	Yes
Share	Yes	Yes

Storage & Persistence
- Playlist data stored locally using AsyncStorage
- Local-only (no cross-device sync in Phase 1)
- Data persists between app sessions

Music Album Source
- Albums auto-generated from local audio file metadata
- Album persists even if source file is moved (metadata cached)
- If album metadata is deleted, album is removed

Track Entity
- Track properties: id, title, artist, duration, audioUri, artworkUri
- Tracks are references — shared between albums, not copied
- Deleting a track removes it from all albums

Cover Images
- Source: Embedded in audio file metadata
- Fallback: First track's artwork, then genre default, then app placeholder

Sharing
- Anyone with the link can view (no account required)
- Links do not expire
- Links can be revoked by the owner
- Shared content includes metadata only (audio streaming handled separately)

Deletion
- Deleting a playlist removes only the playlist reference
- Tracks remain in library
- Shared links are invalidated when owner deletes account

Out of Scope (Phase 1)
- Collaboration editing
- Nested folders/categories
- Offline sync
- Album search/filter
- Bulk operations
---