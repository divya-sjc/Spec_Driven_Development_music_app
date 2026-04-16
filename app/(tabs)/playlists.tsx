import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlbumContext } from '@/context/AlbumContext';
import { PlaylistCard } from '@/components/playlist-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Playlist } from '@/types/album';

export default function PlaylistsScreen() {
  const router = useRouter();
  const { getAllPlaylists, loading } = useAlbumContext();
  const playlists = getAllPlaylists();

  const handlePlaylistPress = (playlist: Playlist) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handleCreatePress = () => {
    router.push('/playlist/create');
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading playlists...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <Pressable
            style={({ pressed }) => [
              styles.createCard,
              pressed && styles.pressed,
            ]}
            onPress={handleCreatePress}
          >
            <View style={styles.createIcon}>
              <View style={styles.createIconHorizontal} />
              <View style={styles.createIconVertical} />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.createText}>
              New Playlist
            </ThemedText>
          </Pressable>
        }
        renderItem={({ item }) => (
          <PlaylistCard playlist={item} onPress={handlePlaylistPress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>No playlists yet</ThemedText>
            <ThemedText lightColor="#687076" darkColor="#9BA1A6" style={styles.hint}>
              Tap "New Playlist" to create one
            </ThemedText>
          </View>
        }
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
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'flex-start',
  },
  createCard: {
    width: 170,
    height: 198,
    margin: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#687076',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  createIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIconHorizontal: {
    position: 'absolute',
    width: 32,
    height: 4,
    backgroundColor: '#687076',
    borderRadius: 2,
  },
  createIconVertical: {
    position: 'absolute',
    width: 4,
    height: 32,
    backgroundColor: '#687076',
    borderRadius: 2,
  },
  createText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 8,
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
