import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useAlbumContext } from '@/context/AlbumContext';
import { AlbumCover } from '@/components/album-cover';
import { TrackListItem } from '@/components/track-list-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    getPlaylistById,
    getTracksByIds,
    removeTrackFromPlaylist,
    deletePlaylist,
    generateShareLink,
    loading,
  } = useAlbumContext();

  const playlist = id ? getPlaylistById(id) : undefined;
  const tracks = playlist ? getTracksByIds(playlist.trackIds) : [];

  const handleRemoveTrack = (trackId: string, trackTitle: string) => {
    if (!id) return;
    Alert.alert(
      'Remove Track',
      `Remove "${trackTitle}" from this playlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeTrackFromPlaylist(id, trackId),
        },
      ]
    );
  };

  const handleDeletePlaylist = () => {
    if (!id || !playlist) return;
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePlaylist(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!id) return;
    const shareLink = await generateShareLink(id);
    if (shareLink) {
      await Clipboard.setStringAsync(shareLink);
      Alert.alert('Link Copied', 'Share link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!playlist) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Playlist not found</ThemedText>
      </ThemedView>
    );
  }

  const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <AlbumCover uri={playlist.coverImage} size={200} style={styles.cover} />
          <View style={styles.headerInfo}>
            <ThemedText type="title" numberOfLines={2} style={styles.title}>
              {playlist.title}
            </ThemedText>
            {playlist.description && (
              <ThemedText
                type="default"
                lightColor="#687076"
                darkColor="#9BA1A6"
                style={styles.description}
              >
                {playlist.description}
              </ThemedText>
            )}
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" style={styles.meta}>
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'} ·{' '}
              {formatDuration(totalDuration)}
            </ThemedText>

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                onPress={handleShare}
              >
                <ThemedText type="link">Share</ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                onPress={handleDeletePlaylist}
              >
                <ThemedText type="link" style={styles.deleteText}>
                  Delete
                </ThemedText>
              </Pressable>
            </View>
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
              onAddToPlaylist={(track) => {
                Alert.alert('Remove', `Remove "${track.title}" from this playlist?`, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeTrackFromPlaylist(id!, track.id),
                  },
                ]);
              }}
            />
          ))}
        </View>

        {tracks.length === 0 && (
          <View style={styles.emptyContainer}>
            <ThemedText lightColor="#687076" darkColor="#9BA1A6">
              No tracks in this playlist
            </ThemedText>
            <ThemedText type="link" onPress={() => router.push('/playlists')}>
              Add tracks from your library
            </ThemedText>
          </View>
        )}
      </ScrollView>
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
  description: {
    marginTop: 4,
  },
  meta: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  deleteText: {
    color: '#dc3545',
  },
  trackList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
});
