import { FlatList, StyleSheet, View } from 'react-native';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SongsScreen() {
  const { getAllSongs, isLoading } = useLibraryStore();
  const songs = getAllSongs();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading songs...</ThemedText>
      </ThemedView>
    );
  }

  if (songs.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No songs found</ThemedText>
        <ThemedText lightColor="#687076" darkColor="#9BA1A6" style={styles.hint}>
          Add music to your device to see songs here
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <View style={styles.songInfo}>
              <ThemedText numberOfLines={1}>{item.title}</ThemedText>
              <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" numberOfLines={1}>
                {item.artist}
              </ThemedText>
            </View>
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
              {formatDuration(item.duration)}
            </ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  songInfo: {
    flex: 1,
    gap: 2,
  },
});
