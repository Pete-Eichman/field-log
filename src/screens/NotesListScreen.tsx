import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotesListScreen() {
  return (
    <View style={styles.container}>
      <Text>Notes List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
