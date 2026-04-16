import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAudio } from '@/context/AudioContext';
import { AlbumCover } from '@/components/album-cover';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function NowPlayingScreen() {
  const router = useRouter();
  const { currentTrack, isPlaying, play, pause, playNext, playPrevious } = useAudio();

  if (!currentTrack) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText>No track playing</ThemedText>
          <ThemedText type="link" onPress={() => router.back()}>
            Go back
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.down" size={28} color="#687076" />
        </Pressable>
        <ThemedText type="defaultSemiBold">Now Playing</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.coverContainer}>
        <AlbumCover uri={currentTrack.artworkUri} size={300} style={styles.cover} />
      </View>

      <View style={styles.trackInfo}>
        <ThemedText type="title" numberOfLines={1}>
          {currentTrack.title}
        </ThemedText>
        <ThemedText type="subtitle" lightColor="#687076" darkColor="#9BA1A6">
          {currentTrack.artist}
        </ThemedText>
        <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" style={styles.duration}>
          {formatDuration(currentTrack.duration)}
        </ThemedText>
      </View>

      <View style={styles.controls}>
        <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}>
          <IconSymbol name="backward.fill" size={32} color="#687076" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          onPress={isPlaying ? pause : play}
        >
          <IconSymbol name={isPlaying ? 'pause.fill' : 'play.fill'} size={48} color="#fff" />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}>
          <IconSymbol name="forward.fill" size={32} color="#687076" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  coverContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  cover: {
    borderRadius: 12,
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 4,
  },
  duration: {
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingVertical: 32,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
