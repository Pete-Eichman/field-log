import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreateNoteScreen() {
  return (
    <View style={styles.container}>
      <Text>Create Note</Text>
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
