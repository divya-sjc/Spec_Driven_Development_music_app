import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { requestPermissionsWithAlert } from '@/services/metadata-scanner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLibraryStore } from '@/stores/useLibraryStore';

export function PermissionDeniedScreen() {
  const router = useRouter();
  const { setScanning, setLoading } = useLibraryStore();

  const handleRequestPermission = async () => {
    setLoading(true);
    const granted = await requestPermissionsWithAlert();
    setLoading(false);

    if (granted) {
      setScanning(true);
      router.replace('/(tabs)/songs');
    } else {
      Alert.alert(
        'Permission Required',
        'Please enable music library access in your device settings to use this app.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Music Access Required
        </ThemedText>
        <ThemedText style={styles.description}>
          This app needs access to your music library to display and play your songs.
        </ThemedText>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>🎵</ThemedText>
        </View>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleRequestPermission}
        >
          <ThemedText style={styles.buttonText}>Grant Access</ThemedText>
        </Pressable>
        <ThemedText type="link" style={styles.link}>
          Open Settings
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#687076',
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
  },
});