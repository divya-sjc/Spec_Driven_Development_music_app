import { Pressable, StyleSheet, View } from 'react-native';
import { Track } from '@/types/album';
import { ThemedText } from './themed-text';

interface TrackListItemProps {
  track: Track;
  index?: number;
  onPress?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
  showIndex?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TrackListItem({
  track,
  index,
  onPress,
  onAddToPlaylist,
  showIndex = true,
}: TrackListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(track)}
    >
      {showIndex && index !== undefined ? (
        <ThemedText
          type="default"
          lightColor="#687076"
          darkColor="#9BA1A6"
          style={styles.index}
        >
          {index + 1}
        </ThemedText>
      ) : (
        <View style={styles.playIcon}>
          <View style={styles.playTriangle} />
        </View>
      )}

      <View style={styles.info}>
        <ThemedText numberOfLines={1} style={styles.title}>
          {track.title}
        </ThemedText>
        <ThemedText
          type="default"
          lightColor="#687076"
          darkColor="#9BA1A6"
          numberOfLines={1}
          style={styles.artist}
        >
          {track.artist}
        </ThemedText>
      </View>

      <ThemedText
        type="default"
        lightColor="#687076"
        darkColor="#9BA1A6"
        style={styles.duration}
      >
        {formatDuration(track.duration)}
      </ThemedText>

      {onAddToPlaylist && (
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={() => onAddToPlaylist(track)}
          hitSlop={8}
        >
          <View style={styles.addIcon}>
            <View style={styles.addIconHorizontal} />
            <View style={styles.addIconVertical} />
          </View>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.7,
  },
  index: {
    width: 28,
    textAlign: 'center',
    fontSize: 14,
  },
  playIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: '#687076',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
  },
  artist: {
    fontSize: 13,
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    marginLeft: 12,
  },
  addButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonPressed: {
    opacity: 0.6,
  },
  addIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconHorizontal: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#687076',
  },
  addIconVertical: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: '#687076',
  },
});
