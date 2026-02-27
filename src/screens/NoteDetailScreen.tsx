import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { NotesStackParamList } from '../navigation';
import { FieldNote, getNoteById, deleteNote } from '../db/db';
import CategoryBadge from '../components/CategoryBadge';
import LocationTag from '../components/LocationTag';
import { formatDate } from '../utils/formatDate';
import { Colors } from '../theme/colors';

type NavProp = NativeStackNavigationProp<NotesStackParamList, 'NoteDetail'>;
type RoutePropType = RouteProp<NotesStackParamList, 'NoteDetail'>;

export default function NoteDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { noteId } = route.params;

  const [note, setNote] = useState<FieldNote | null>(null);

  useLayoutEffect(() => {
    if (!note) return;
    navigation.setOptions({
      title: note.title,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('EditNote', { noteId })}>
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, note]);

  useFocusEffect(
    useCallback(() => {
      getNoteById(noteId).then(setNote);
    }, [noteId])
  );

  function handleDelete() {
    Alert.alert('Delete note', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(noteId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          navigation.goBack();
        },
      },
    ]);
  }

  if (!note) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.metaRow}>
        <CategoryBadge category={note.category} />
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
      </View>

      {note.body.length > 0 && (
        <Text style={styles.body}>{note.body}</Text>
      )}

      {note.photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
          {note.photos.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.photo} />
          ))}
        </ScrollView>
      )}

      <LocationTag
        latitude={note.latitude}
        longitude={note.longitude}
        address={note.address}
      />

      {note.updatedAt !== note.createdAt && (
        <Text style={styles.updated}>Edited {formatDate(note.updatedAt)}</Text>
      )}

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Delete Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  body: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  photoScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  updated: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  editBtn: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  deleteBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.danger,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.light.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
