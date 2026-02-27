import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NotesStackParamList } from '../navigation';
import { FieldNote, getAllNotes, deleteNote } from '../db/db';
import NoteCard from '../components/NoteCard';
import { Colors } from '../theme/colors';

type NavProp = NativeStackNavigationProp<NotesStackParamList, 'NotesList'>;

export default function NotesListScreen() {
  const navigation = useNavigation<NavProp>();
  const [notes, setNotes] = useState<FieldNote[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateNote')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Reload the list every time this screen comes into focus so edits
  // and new notes show up immediately when navigating back.
  useFocusEffect(
    useCallback(() => {
      getAllNotes().then(setNotes);
    }, [])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await getAllNotes().then(setNotes);
    setRefreshing(false);
  }

  function handleDelete(id: string) {
    Alert.alert('Delete note', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(id);
          setNotes((prev) => prev.filter((n) => n.id !== id));
        },
      },
    ]);
  }

  if (notes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No notes yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap + to log your first field observation
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  addButton: {
    marginRight: 4,
    padding: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: Colors.light.primary,
    lineHeight: 30,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
