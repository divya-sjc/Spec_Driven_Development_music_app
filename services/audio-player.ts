import { Audio, AVPlaybackStatus } from 'expo-av';
import { Song } from '@/types/Song';

let sound: Audio.Sound | null = null;

export async function configureAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.error('Error configuring audio:', error);
  }
}

export async function playSound(song: Song): Promise<Audio.Sound | null> {
  try {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: song.audioUri },
      { shouldPlay: true }
    );

    sound = newSound;

    newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        return;
      }
    });

    return newSound;
  } catch (error) {
    console.error('Error playing sound:', error);
    return null;
  }
}

export async function pauseSound(): Promise<void> {
  if (sound) {
    await sound.pauseAsync();
  }
}

export async function resumeSound(): Promise<void> {
  if (sound) {
    await sound.playAsync();
  }
}

export async function stopSound(): Promise<void> {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
}

export async function seekSound(position: number): Promise<void> {
  if (sound) {
    await sound.setPositionAsync(position * 1000);
  }
}

export async function getPosition(): Promise<number> {
  if (sound) {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      return status.positionMillis / 1000;
    }
  }
  return 0;
}

export async function getDuration(): Promise<number> {
  if (sound) {
    const status = await sound.getStatusAsync();
    if (status.isLoaded && status.durationMillis) {
      return status.durationMillis / 1000;
    }
  }
  return 0;
}

export function getSoundInstance(): Audio.Sound | null {
  return sound;
}
