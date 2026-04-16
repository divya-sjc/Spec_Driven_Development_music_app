import { Image, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface AlbumCoverProps {
  uri?: string;
  size?: number;
  style?: object;
}

export function AlbumCover({ uri, size = 200, style }: AlbumCoverProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'background');

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size }, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, backgroundColor },
        style,
      ]}
    >
      <View style={[styles.iconContainer, { borderColor: tintColor }]}>
        <View style={[styles.musicNote, { backgroundColor: tintColor }]}>
          <View style={[styles.noteHead, { backgroundColor: tintColor }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
  },
  placeholder: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: '50%',
    height: '50%',
    borderWidth: 3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  musicNote: {
    width: 12,
    height: 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    position: 'relative',
  },
  noteHead: {
    width: 14,
    height: 10,
    borderRadius: 7,
    position: 'absolute',
    bottom: -6,
    left: -1,
    transform: [{ rotate: '-20deg' }],
  },
});
