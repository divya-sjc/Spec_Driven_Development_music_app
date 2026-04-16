import { Pressable, StyleSheet, View } from 'react-native';
import { Playlist } from '@/types/album';
import { ThemedText } from './themed-text';
import { AlbumCover } from './album-cover';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress?: (playlist: Playlist) => void;
}

export function PlaylistCard({ playlist, onPress }: PlaylistCardProps) {
  const handlePress = () => {
    onPress?.(playlist);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <AlbumCover uri={playlist.coverImage} size={150} />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
          {playlist.title}
        </ThemedText>
        {playlist.description && (
          <ThemedText
            type="default"
            lightColor="#687076"
            darkColor="#9BA1A6"
            numberOfLines={1}
            style={styles.description}
          >
            {playlist.description}
          </ThemedText>
        )}
        <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" style={styles.trackCount}>
          {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'track' : 'tracks'}
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
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  trackCount: {
    fontSize: 12,
    marginTop: 2,
  },
});
