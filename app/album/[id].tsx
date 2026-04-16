import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAlbumContext } from '@/context/AlbumContext';
import { useAudio } from '@/context/AudioContext';
import { AlbumCover } from '@/components/album-cover';
import { TrackListItem } from '@/components/track-list-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getAlbumById, getTracksByIds, loading } = useAlbumContext();

  const album = id ? getAlbumById(id) : undefined;
  const tracks = album ? getTracksByIds(album.trackIds) : [];

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!album) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Album not found</ThemedText>
      </ThemedView>
    );
  }

  const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <AlbumCover uri={album.coverImage} size={200} style={styles.cover} />
        <View style={styles.headerInfo}>
          <ThemedText type="title" numberOfLines={2} style={styles.title}>
            {album.title}
          </ThemedText>
          <ThemedText type="subtitle" lightColor="#687076" darkColor="#9BA1A6">
            {album.artist}
          </ThemedText>
          {album.releaseYear && (
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
              {album.releaseYear}
            </ThemedText>
          )}
          <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" style={styles.meta}>
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'} · {formatDuration(totalDuration)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.trackList}>
        {tracks.map((track, index) => (
          <TrackListItem
            key={track.id}
            track={track}
            index={index}
            onPress={(track) => {
              console.log('Play track:', track.title);
            }}
          />
        ))}
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
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  cover: {
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontSize: 22,
  },
  meta: {
    marginTop: 8,
  },
  trackList: {
    flex: 1,
  },
});
