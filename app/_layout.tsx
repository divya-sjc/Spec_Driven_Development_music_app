import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AlbumProvider } from '@/context/AlbumContext';
import { AudioProvider } from '@/context/AudioContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AlbumProvider>
      <AudioProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="now-playing"
              options={{
                presentation: 'modal',
                title: 'Now Playing',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AudioProvider>
    </AlbumProvider>
  );
}
