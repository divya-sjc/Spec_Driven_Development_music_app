import { Track, MusicAlbum } from '@/types/album';
import { v4 as uuidv4 } from 'uuid';

export interface AlbumGroup {
  title: string;
  artist: string;
  releaseYear?: number;
  tracks: Track[];
}

export function groupTracksByAlbum(tracks: Track[]): AlbumGroup[] {
  const albumMap = new Map<string, AlbumGroup>();

  for (const track of tracks) {
    const key = `${track.artist.toLowerCase()}|${track.title.toLowerCase()}`;

    if (albumMap.has(key)) {
      const album = albumMap.get(key)!;
      album.tracks.push(track);
    } else {
      albumMap.set(key, {
        title: track.title,
        artist: track.artist,
        tracks: [track],
      });
    }
  }

  return Array.from(albumMap.values());
}

export function generateAlbumsFromTracks(tracks: Track[]): MusicAlbum[] {
  const groups = groupTracksByAlbum(tracks);
  const albums: MusicAlbum[] = [];

  for (const group of groups) {
    if (group.tracks.length === 0) continue;

    const sortedTracks = group.tracks.sort((a, b) => {
      const aNum = extractTrackNumber(a.title);
      const bNum = extractTrackNumber(b.title);
      return aNum - bNum;
    });

    const coverImage = sortedTracks[0].artworkUri || '';

    const album: MusicAlbum = {
      id: uuidv4(),
      type: 'music',
      title: group.title,
      artist: group.artist,
      releaseYear: group.releaseYear,
      coverImage,
      trackIds: sortedTracks.map((t) => t.id),
      createdAt: Date.now(),
    };

    albums.push(album);
  }

  return albums.sort((a, b) => a.title.localeCompare(b.title));
}

function extractTrackNumber(title: string): number {
  const match = title.match(/^(\d+)[\s.\-_:]/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

export function getAlbumCover(album: MusicAlbum, tracks: Track[]): string {
  if (album.coverImage) {
    return album.coverImage;
  }

  for (const trackId of album.trackIds) {
    const track = tracks.find((t) => t.id === trackId);
    if (track?.artworkUri) {
      return track.artworkUri;
    }
  }

  return '';
}
