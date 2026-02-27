import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FieldNote } from '../db/db';
import { Colors } from '../theme/colors';

const BADGE_COLORS: Record<FieldNote['category'], string> = {
  inspection: Colors.light.badge.inspection,
  observation: Colors.light.badge.observation,
  issue: Colors.light.badge.issue,
  general: Colors.light.badge.general,
};

type Props = {
  category: FieldNote['category'];
};

export default function CategoryBadge({ category }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: BADGE_COLORS[category] }]}>
      <Text style={styles.label}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
