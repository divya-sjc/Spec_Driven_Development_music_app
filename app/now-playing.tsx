import { useState, useEffect, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { playSound, pauseSound, resumeSound, seekSound, stopSound } from '@/services/audio-player';
import { AlbumCover } from '@/components/album-cover';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function NowPlayingScreen() {
  const router = useRouter();
  const { 
    currentSong, 
    isPlaying, 
    queue, 
    queueIndex,
    play, 
    pause, 
    setCurrentSong,
    playNextTrack,
    playPreviousTrack 
  } = usePlayerStore();
  
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (currentSong) {
      setPosition(0);
      setDuration(currentSong.duration);
    }
  }, [currentSong]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseSound();
      pause();
    } else {
      if (position === 0) {
        await playSound(currentSong!);
      } else {
        await resumeSound();
      }
      play();
    }
  };

const handleNext = async () => {
  playNextTrack();
  const nextSong = queue[queueIndex + 1];
  if (nextSong) {
    await playSound(nextSong);
    setPosition(0);
    setDuration(nextSong.duration);
  }
};

const handlePrevious = async () => {
    if (position > 3) {
      setPosition(0);
      await seekSound(0);
      return;
    }
    if (queueIndex > 0) {
      playPreviousTrack();
      const prevSong = queue[queueIndex - 1];
      if (prevSong) {
        await playSound(prevSong);
        setPosition(0);
        setDuration(prevSong.duration);
      }
    }
  };

  const handleSeek = async (value: number) => {
    setIsSeeking(true);
    await seekSound(value);
    setPosition(value);
    setIsSeeking(false);
  };

  const handleClose = async () => {
    await stopSound();
    router.back();
  };

  if (!currentSong) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText>No song playing</ThemedText>
          <Pressable onPress={handleClose}>
            <ThemedText type="link">Go back</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <IconSymbol name="chevron.down" size={28} color="#687076" />
        </Pressable>
        <ThemedText type="defaultSemiBold">Now Playing</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.coverContainer}>
        <AlbumCover uri={currentSong.artworkUri} size={280} style={styles.cover} />
      </View>

      <View style={styles.songInfo}>
        <ThemedText type="title" numberOfLines={1}>{currentSong.title}</ThemedText>
        <ThemedText type="subtitle" lightColor="#687076" darkColor="#9BA1A6">
          {currentSong.artist}
        </ThemedText>
      </View>

      <View style={styles.seekBarContainer}>
        <View style={styles.seekBarBackground}>
          <View style={[styles.seekBarProgress, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
            {formatTime(position)}
          </ThemedText>
          <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
            {formatTime(duration)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable 
          style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}
          onPress={handlePrevious}
        >
          <IconSymbol name="backward.fill" size={32} color="#687076" />
        </Pressable>
        
        <Pressable
          style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          onPress={handlePlayPause}
        >
          <IconSymbol 
            name={isPlaying ? 'pause.fill' : 'play.fill'} 
            size={40} 
            color="#fff" 
          />
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}
          onPress={handleNext}
          disabled={queueIndex >= queue.length - 1}
        >
          <IconSymbol 
            name="forward.fill" 
            size={32} 
            color={queueIndex >= queue.length - 1 ? '#ccc' : '#687076'} 
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: { padding: 4 },
  placeholder: { width: 32 },
  coverContainer: { alignItems: 'center', paddingVertical: 24 },
  cover: { borderRadius: 12 },
  songInfo: { alignItems: 'center', paddingHorizontal: 24, gap: 4 },
  seekBarContainer: { paddingHorizontal: 24, paddingVertical: 16 },
  seekBarBackground: {
    height: 4,
    backgroundColor: '#e5e5e5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  seekBarProgress: {
    height: '100%',
    backgroundColor: '#0a7ea4',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingVertical: 24,
  },
  controlButton: { padding: 12 },
  pressed: { opacity: 0.7 },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});