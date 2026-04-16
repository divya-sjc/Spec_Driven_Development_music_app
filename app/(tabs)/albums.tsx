import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlbumContext } from '@/context/AlbumContext';
import { AlbumCard } from '@/components/album-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MusicAlbum } from '@/types/album';

export default function AlbumsScreen() {
  const router = useRouter();
  const { getAllAlbums, loading } = useAlbumContext();
  const albums = getAllAlbums();

  const handleAlbumPress = (album: MusicAlbum) => {
    router.push(`/album/${album.id}`);
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading albums...</ThemedText>
      </ThemedView>
    );
  }

  if (albums.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No albums found</ThemedText>
        <ThemedText lightColor="#687076" darkColor="#9BA1A6" style={styles.hint}>
          Add music to your device to see albums here
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <AlbumCard album={item} onPress={handleAlbumPress} />
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
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'flex-start',
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
