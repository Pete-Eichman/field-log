import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { FieldNote } from '../db/db';
import CategoryBadge from './CategoryBadge';
import { formatDate } from '../utils/formatDate';
import { Colors } from '../theme/colors';

type Props = {
  note: FieldNote;
  onPress: () => void;
  onDelete: () => void;
};

export default function NoteCard({ note, onPress, onDelete }: Props) {
  const swipeableRef = useRef<Swipeable>(null);

  function handleDelete() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    swipeableRef.current?.close();
    onDelete();
  }

  function renderRightAction() {
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  }

  const thumbnail = note.photos[0];

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightAction} overshootRight={false}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.content}>
          <View style={styles.header}>
            <CategoryBadge category={note.category} />
            <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
          {note.body.length > 0 && (
            <Text style={styles.body} numberOfLines={2}>{note.body}</Text>
          )}
        </View>
        {thumbnail && (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        )}
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  body: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginLeft: 12,
    backgroundColor: Colors.light.border,
  },
  deleteAction: {
    backgroundColor: Colors.light.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
