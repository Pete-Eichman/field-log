import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation';
import { initDatabase } from './src/db/db';
import { seedIfEmpty } from './src/db/seed';

export default function App() {
  useEffect(() => {
    initDatabase();
    seedIfEmpty();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
