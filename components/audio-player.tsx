import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

export function AudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPauseAudio = async () => {
    if (!sound) {
      setIsLoading(true);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }, // Sample audio URL
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        setIsLoading(false);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
          }
        });
      } catch (error) {
        console.error('Error loading audio:', error);
        setIsLoading(false);
      }
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Audio Player
      </ThemedText>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPauseAudio} disabled={isLoading}>
          <IconSymbol
            name={isPlaying ? 'pause.fill' : 'play.fill'}
            size={48}
            color={isLoading ? textColor : tintColor}
          />
        </TouchableOpacity>
        <ThemedText style={styles.status}>
          {isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Paused'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
  },
  status: {
    marginTop: 10,
    fontSize: 14,
  },
});