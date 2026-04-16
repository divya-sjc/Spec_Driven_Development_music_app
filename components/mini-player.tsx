import { useState } from 'react';
import { Alert, Modal, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAudio } from '@/context/AudioContext';
import { useAlbumContext } from '@/context/AlbumContext';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { AlbumCover } from './album-cover';
import { IconSymbol } from './ui/icon-symbol';
import { Track } from '@/types/album';

interface AddToPlaylistModalProps {
  visible: boolean;
  track: Track | null;
  onClose: () => void;
}

function AddToPlaylistModal({ visible, track, onClose }: AddToPlaylistModalProps) {
  const router = useRouter();
  const { getAllPlaylists, addTrackToPlaylist, createPlaylist } = useAlbumContext();
  const playlists = getAllPlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!track) return;
    await addTrackToPlaylist(playlistId, track.id);
    Alert.alert('Added', `"${track.title}" added to playlist`);
    onClose();
  };

  const handleCreateAndAdd = async () => {
    if (!track || !newPlaylistName.trim()) return;
    const playlist = await createPlaylist(newPlaylistName.trim());
    if (playlist) {
      await addTrackToPlaylist(playlist.id, track.id);
      Alert.alert('Created', `"${track.title}" added to new playlist`);
      setNewPlaylistName('');
      onClose();
      router.push(`/playlist/${playlist.id}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">Add to Playlist</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="#687076" />
            </Pressable>
          </ThemedView>

          {track && (
            <View style={styles.trackPreview}>
              <AlbumCover uri={track.artworkUri} size={48} />
              <View style={styles.trackInfo}>
                <ThemedText numberOfLines={1} style={styles.trackTitle}>
                  {track.title}
                </ThemedText>
                <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" numberOfLines={1}>
                  {track.artist}
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.createSection}>
            <TextInput
              style={styles.createInput}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="New playlist name..."
              placeholderTextColor="#687076"
              maxLength={100}
            />
            <Pressable
              style={[styles.createButton, !newPlaylistName.trim() && styles.createButtonDisabled]}
              onPress={handleCreateAndAdd}
              disabled={!newPlaylistName.trim()}
            >
              <ThemedText style={styles.createButtonText}>Create</ThemedText>
            </Pressable>
          </View>

          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            style={styles.playlistList}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.playlistItem, pressed && styles.playlistItemPressed]}
                onPress={() => handleAddToPlaylist(item.id)}
              >
                <AlbumCover uri={item.coverImage} size={44} />
                <View style={styles.playlistInfo}>
                  <ThemedText numberOfLines={1}>{item.title}</ThemedText>
                  <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6">
                    {item.trackIds.length} tracks
                  </ThemedText>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <ThemedText style={styles.emptyText}>No playlists yet</ThemedText>
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function MiniPlayer() {
  const router = useRouter();
  const { currentTrack, isPlaying, play, pause } = useAudio();
  const [showAddModal, setShowAddModal] = useState(false);

  if (!currentTrack) return null;

  return (
    <>
      <ThemedView style={styles.container}>
        <Pressable style={styles.content} onPress={() => router.push('/now-playing')}>
          <AlbumCover uri={currentTrack.artworkUri} size={48} style={styles.artwork} />
          <View style={styles.info}>
            <ThemedText numberOfLines={1} style={styles.title}>
              {currentTrack.title}
            </ThemedText>
            <ThemedText type="default" lightColor="#687076" darkColor="#9BA1A6" numberOfLines={1}>
              {currentTrack.artist}
            </ThemedText>
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => setShowAddModal(true)}
          >
            <IconSymbol name="plus" size={24} color="#687076" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={isPlaying ? pause : play}
          >
            <IconSymbol
              name={isPlaying ? 'pause.fill' : 'play.fill'}
              size={28}
              color="#0a7ea4"
            />
          </Pressable>
        </View>
      </ThemedView>

      <AddToPlaylistModal
        visible={showAddModal}
        track={currentTrack}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  trackPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    gap: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontWeight: '600',
  },
  createSection: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  createInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#687076',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#687076',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  playlistList: {
    maxHeight: 300,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  playlistItemPressed: {
    backgroundColor: '#F5F5F5',
  },
  playlistInfo: {
    flex: 1,
    gap: 2,
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#687076',
  },
});
