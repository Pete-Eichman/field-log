import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

type Props = {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
};

export default function LocationTag({ latitude, longitude, address }: Props) {
  if (!latitude && !longitude) return null;

  const label = address ?? `${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}`;

  return (
    <View style={styles.row}>
      <Text style={styles.text}>📍 {label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
