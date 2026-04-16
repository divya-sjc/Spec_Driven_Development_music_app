import { Pressable, StyleSheet, View } from 'react-native';
import { MusicAlbum } from '@/types/album';
import { ThemedText } from './themed-text';
import { AlbumCover } from './album-cover';

interface AlbumCardProps {
  album: MusicAlbum;
  onPress?: (album: MusicAlbum) => void;
}

export function AlbumCard({ album, onPress }: AlbumCardProps) {
  const handlePress = () => {
    onPress?.(album);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <AlbumCover uri={album.coverImage} size={150} />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
          {album.title}
        </ThemedText>
        <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" numberOfLines={1}>
          {album.artist}
        </ThemedText>
        {album.releaseYear && (
          <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" style={styles.year}>
            {album.releaseYear}
          </ThemedText>
        )}
        <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" style={styles.trackCount}>
          {album.trackIds.length} {album.trackIds.length === 1 ? 'track' : 'tracks'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    width: 180,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    marginTop: 8,
    gap: 2,
  },
  title: {
    fontSize: 14,
  },
  year: {
    fontSize: 12,
    marginTop: 2,
  },
  trackCount: {
    fontSize: 12,
    marginTop: 2,
  },
});
