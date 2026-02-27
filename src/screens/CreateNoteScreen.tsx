import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { v4 as uuidv4 } from 'uuid';
import { FieldNote, insertNote } from '../db/db';
import { getCurrentLocation } from '../utils/location';
import { pickFromLibrary, takePhoto } from '../utils/photos';
import { useSettingsStore } from '../store/useSettingsStore';
import { Colors } from '../theme/colors';

const CATEGORIES: FieldNote['category'][] = ['general', 'inspection', 'observation', 'issue'];

export default function CreateNoteScreen() {
  const navigation = useNavigation();
  const { autoTagLocation } = useSettingsStore();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<FieldNote['category']>('general');
  const [photos, setPhotos] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!autoTagLocation) return;
    setLocating(true);
    getCurrentLocation().then((loc) => {
      if (loc) {
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
        setAddress(loc.address);
      }
      setLocating(false);
    });
  }, []);

  function handleAddPhoto() {
    Alert.alert('Add Photo', '', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const uri = await takePhoto();
          if (uri) setPhotos((prev) => [...prev, uri]);
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const uri = await pickFromLibrary();
          if (uri) setPhotos((prev) => [...prev, uri]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Add a title before saving.');
      return;
    }

    const now = new Date().toISOString();
    const note: FieldNote = {
      id: uuidv4(),
      title: title.trim(),
      body: body.trim(),
      category,
      photos,
      latitude,
      longitude,
      address,
      createdAt: now,
      updatedAt: now,
    };

    await insertNote(note);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.goBack();
  }

  const locationText = locating
    ? 'Tagging location...'
    : address
    ? address
    : latitude
    ? `${latitude.toFixed(5)}, ${longitude?.toFixed(5)}`
    : 'Location unavailable';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor={Colors.light.textSecondary}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
        returnKeyType="next"
      />

      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.bodyInput}
        placeholder="Notes..."
        placeholderTextColor={Colors.light.textSecondary}
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
      />

      {/* Photo strip */}
      <View style={styles.photoRow}>
        {photos.map((uri, index) => (
          <View key={uri} style={styles.photoWrapper}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
          <Text style={styles.addPhotoBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Location tag */}
      {autoTagLocation && (
        <View style={styles.locationRow}>
          {locating && (
            <ActivityIndicator size="small" color={Colors.light.primary} style={{ marginRight: 6 }} />
          )}
          <Text style={styles.locationText}>📍 {locationText}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Note</Text>
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
    gap: 12,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  chipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  bodyInput: {
    minHeight: 120,
    fontSize: 15,
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.light.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  addPhotoBtn: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
  },
  addPhotoBtnText: {
    fontSize: 28,
    color: Colors.light.textSecondary,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
