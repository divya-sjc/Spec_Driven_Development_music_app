import * as MediaLibrary from 'expo-media-library';
import { Track } from '@/types/album';
import { v4 as uuidv4 } from 'uuid';

export interface ScanResult {
  tracks: Track[];
  totalScanned: number;
  errors: string[];
}

export async function requestPermissions(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

export async function checkPermissions(): Promise<boolean> {
  const { status } = await MediaLibrary.getPermissionsAsync();
  return status === 'granted';
}

export async function scanDeviceForAudio(): Promise<ScanResult> {
  const tracks: Track[] = [];
  const errors: string[] = [];
  let totalScanned = 0;

  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      errors.push('Media library permission denied');
      return { tracks, totalScanned, errors };
    }

    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 1000,
    });

    totalScanned = assets.assets.length;

    for (const asset of assets.assets) {
      try {
        const track = assetToTrack(asset);
        if (track) {
          tracks.push(track);
        }
      } catch (err) {
        errors.push(`Failed to process asset ${asset.id}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Scan failed: ${err}`);
  }

  return { tracks, totalScanned, errors };
}

export function assetToTrack(asset: MediaLibrary.Asset): Track | null {
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
  };
}

export async function getAssetInfo(assetId: string): Promise<MediaLibrary.AssetInfo | null> {
  try {
    return await MediaLibrary.getAssetInfoAsync(assetId);
  } catch {
    return null;
  }
}
