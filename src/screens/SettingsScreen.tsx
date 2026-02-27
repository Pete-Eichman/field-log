import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { Colors } from '../theme/colors';

export default function SettingsScreen() {
  const { autoTagLocation, darkMode, setAutoTagLocation, setDarkMode } = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Preferences</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Auto-tag location</Text>
            <Text style={styles.rowSubtitle}>Attach GPS coordinates when creating a note</Text>
          </View>
          <Switch
            value={autoTagLocation}
            onValueChange={setAutoTagLocation}
            trackColor={{ true: Colors.light.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Dark mode</Text>
            <Text style={styles.rowSubtitle}>Coming soon</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: Colors.light.primary }}
            disabled
          />
        </View>
      </View>

      <Text style={styles.sectionHeader}>About</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Field Log</Text>
          <Text style={styles.rowSubtitle}>Version 1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.aboutBlock}>
          <Text style={styles.aboutText}>
            A lightweight field notebook for logging observations, inspections, and site notes —
            with photos and GPS tagging, stored entirely on your device.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 6,
  },
  section: {
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.light.text,
  },
  rowSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: 16,
  },
  aboutBlock: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
