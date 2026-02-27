import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';
import { FieldNote, getAllNotes } from '../db/db';
import { Colors } from '../theme/colors';

type NavProp = BottomTabNavigationProp<RootTabParamList>;
type NoteWithCoords = FieldNote & { latitude: number; longitude: number };

function getInitialRegion(notes: NoteWithCoords[]): Region {
  if (notes.length === 0) {
    return { latitude: 41.878, longitude: -87.63, latitudeDelta: 0.05, longitudeDelta: 0.05 };
  }
  const lats = notes.map((n) => n.latitude);
  const lngs = notes.map((n) => n.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padding = 0.02;
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + padding, 0.01),
    longitudeDelta: Math.max(maxLng - minLng + padding, 0.01),
  };
}

export default function MapScreen() {
  const navigation = useNavigation<NavProp>();
  const [notes, setNotes] = useState<NoteWithCoords[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllNotes().then((all) => {
        const withCoords = all.filter(
          (n): n is NoteWithCoords => n.latitude !== null && n.longitude !== null
        );
        setNotes(withCoords);
      });
    }, [])
  );

  if (notes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No mapped notes</Text>
        <Text style={styles.emptySubtitle}>Notes with location data will appear here</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={getInitialRegion(notes)}>
      {notes.map((note) => (
        <Marker
          key={note.id}
          coordinate={{ latitude: note.latitude, longitude: note.longitude }}
          pinColor={Colors.light.primary}
        >
          <Callout
            onPress={() =>
              navigation.navigate('NotesTab', {
                screen: 'NoteDetail',
                params: { noteId: note.id },
              })
            }
          >
            <TouchableOpacity style={styles.callout}>
              <Text style={styles.calloutTitle} numberOfLines={2}>{note.title}</Text>
              {note.address && (
                <Text style={styles.calloutAddress} numberOfLines={1}>{note.address}</Text>
              )}
              <Text style={styles.calloutAction}>Tap to open →</Text>
            </TouchableOpacity>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background, gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.light.text },
  emptySubtitle: { fontSize: 14, color: Colors.light.textSecondary, textAlign: 'center' },
  callout: { width: 200, padding: 4, gap: 2 },
  calloutTitle: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  calloutAddress: { fontSize: 12, color: Colors.light.textSecondary },
  calloutAction: { fontSize: 12, color: Colors.light.primary, marginTop: 4 },
});