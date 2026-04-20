import * as MediaLibrary from 'expo-media-library';
import { Song } from '@/types/Song';
import { v4 as uuidv4 } from 'uuid';

export interface ScanResult {
  songs: Song[];
  totalScanned: number;
  hasMore: boolean;
  errors: string[];
}

export interface ScanOptions {
  first?: number;
  after?: string;
  filterShort?: boolean;
}

const MIN_DURATION = 30;

export async function requestPermissions(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

export async function checkPermissions(): Promise<boolean> {
  const { status } = await MediaLibrary.getPermissionsAsync();
  return status === 'granted';
}

export async function requestPermissionsWithAlert(): Promise<boolean> {
  const { status } = await MediaLibrary.getPermissionsAsync();
  
  if (status === 'granted') {
    return true;
  }
  
  const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
  return newStatus === 'granted';
}

export async function scanDeviceForAudio(options: ScanOptions = {}): Promise<ScanResult> {
  const { first = 50, after, filterShort = true } = options;
  const songs: Song[] = [];
  const errors: string[] = [];
  let totalScanned = 0;
  let hasMore = false;

  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      errors.push('Media library permission denied');
      return { songs, totalScanned, hasMore, errors };
    }

    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first,
      after,
    });

    totalScanned = result.assets.length;
    hasMore = result.hasNextPage || false;

    for (const asset of result.assets) {
      try {
        const song = await assetToSong(asset);
        if (song) {
          if (filterShort && song.duration < MIN_DURATION) {
            continue;
          }
          songs.push(song);
        }
      } catch (err) {
        errors.push(`Failed to process asset ${asset.id}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Scan failed: ${err}`);
  }

  return { songs, totalScanned, hasMore, errors };
}

export async function loadAllSongs(filterShort = true): Promise<{ songs: Song[]; errors: string[] }> {
  const allSongs: Song[] = [];
  const errors: string[] = [];
  let hasMore = true;
  let cursor: string | undefined;

  while (hasMore) {
    const result = await scanDeviceForAudio({ first: 100, after: cursor, filterShort });
    allSongs.push(...result.songs);
    errors.push(...result.errors);
    hasMore = result.hasMore;
    cursor = hasMore ? `${allSongs.length}` : undefined;
  }

  return { songs: allSongs, errors };
}

export async function assetToSong(asset: MediaLibrary.Asset): Promise<Song | null> {
  if (!asset.uri || !asset.filename) {
    return null;
  }

  const filename = asset.filename || 'Unknown';
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const supportedFormats = ['mp3', 'm4a', 'wav', 'flac', 'aac', 'ogg'];

  if (!supportedFormats.includes(extension)) {
    return null;
  }

  const title = filename.replace(/\.[^/.]+$/, '');
  const duration = asset.duration ? Math.round(asset.duration) : 0;

  return {
    id: uuidv4(),
    title,
    artist: 'Unknown Artist',
    duration,
    audioUri: asset.uri,
    createdAt: Date.now(),
  };
}

export async function getAssetInfo(assetId: string): Promise<MediaLibrary.AssetInfo | null> {
  try {
    return await MediaLibrary.getAssetInfoAsync(assetId);
  } catch {
    return null;
  }
}