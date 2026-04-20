import { useState, useEffect, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { checkPermissions, scanDeviceForAudio } from '@/services/metadata-scanner';
import { configureAudio, playSound } from '@/services/audio-player';
import { PermissionDeniedScreen } from '@/components/permission-denied';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Song } from '@/types/Song';

type SortOption = 'title' | 'artist' | 'createdAt';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SongsScreen() {
  const router = useRouter();
  const { getAllSongs, addSongs, isLoading, isScanning, setLoading, setScanning, setLastScanDate } = useLibraryStore();
  const { setQueue, setCurrentSong, play } = usePlayerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }
      
      setPermissionDenied(false);
      setScanning(true);
      
      await configureAudio();
      
      const result = await scanDeviceForAudio({ first: 100, filterShort: true });
      addSongs(result.songs);
      setLastScanDate(Date.now());
      setScanning(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = getAllSongs().filter(song => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return song.title.toLowerCase().includes(query) || 
           song.artist.toLowerCase().includes(query);
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'createdAt':
        return b.createdAt - a.createdAt;
      default:
        return 0;
    }
  });

  const handleSongPress = async (song: Song, index: number) => {
    setQueue(filteredSongs, index);
    setCurrentSong(song);
    await playSound(song);
    play();
    router.push('/now-playing');
  };

  const handleSort = () => {
    const options: SortOption[] = ['title', 'artist', 'createdAt'];
    const currentIndex = options.indexOf(sortBy);
    setSortBy(options[(currentIndex + 1) % options.length]);
  };

  if (permissionDenied) {
    return <PermissionDeniedScreen />;
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="title">Loading...</ThemedText>
        <ThemedText lightColor="#687076" darkColor="#9BA1A6">
          {isScanning ? 'Scanning your music library...' : 'Preparing...'}
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Error</ThemedText>
        <ThemedText lightColor="#dc3545" darkColor="#dc3545">{error}</ThemedText>
        <Pressable style={styles.retryButton} onPress={loadSongs}>
          <ThemedText type="link">Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (filteredSongs.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="title">No Songs Found</ThemedText>
        <ThemedText lightColor="#687076" darkColor="#9BA1A6" style={styles.hint}>
          {searchQuery ? 'No songs match your search' : 'Add music to your device'}
        </ThemedText>
        {searchQuery && (
          <Pressable onPress={() => setSearchQuery('')}>
            <ThemedText type="link">Clear search</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#687076" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs..."
            placeholderTextColor="#687076"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#687076" />
            </Pressable>
          ) : null}
        </View>
        <Pressable style={styles.sortButton} onPress={handleSort}>
          <ThemedText type="link">Sort: {sortBy}</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) => [styles.songItem, pressed && styles.pressed]}
            onPress={() => handleSongPress(item, index)}
          >
            <View style={styles.songInfo}>
              <ThemedText numberOfLines={1}>{item.title}</ThemedText>
              <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" numberOfLines={1}>
                {item.artist}
              </ThemedText>
            </View>
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
              {formatDuration(item.duration)}
            </ThemedText>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 16 },
  sortButton: { padding: 8 },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  pressed: { opacity: 0.7 },
  songInfo: { flex: 1, gap: 2 },
  hint: { marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
  retryButton: { marginTop: 16, padding: 12 },
});