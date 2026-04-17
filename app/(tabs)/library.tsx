import { FlatList, StyleSheet, View } from 'react-native';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { AlbumCover } from '@/components/album-cover';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LibraryScreen() {
  const { getAllSongs, getAllPlaylists, isLoading } = useLibraryStore();
  const songs = getAllSongs();
  const playlists = getAllPlaylists();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading library...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Library Stats
        </ThemedText>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <ThemedText type="title">{songs.length}</ThemedText>
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
              Songs
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="title">{playlists.length}</ThemedText>
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
              Playlists
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Playlists
        </ThemedText>
        {playlists.length === 0 ? (
          <ThemedText lightColor="#687076" darkColor="#9BA1A6">
            No playlists yet
          </ThemedText>
        ) : (
          <FlatList
            horizontal
            data={playlists.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.playlistCard}>
                <AlbumCover uri={item.coverImage} size={100} />
                <ThemedText numberOfLines={1} style={styles.playlistTitle}>
                  {item.title}
                </ThemedText>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
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
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  playlistCard: {
    width: 120,
    marginRight: 12,
  },
  playlistTitle: {
    marginTop: 8,
    fontSize: 12,
  },
});
