import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import NotesListScreen from '../screens/NotesListScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors } from '../theme/colors';

// --- Param lists ---

export type NotesStackParamList = {
  NotesList: undefined;
  CreateNote: undefined;
  NoteDetail: { noteId: string };
  EditNote: { noteId: string };
};

export type RootTabParamList = {
  NotesTab: { screen: keyof NotesStackParamList; params?: object } | undefined;
  MapTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const NotesStack = createNativeStackNavigator<NotesStackParamList>();

function NotesNavigator() {
  return (
    <NotesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.light.surface },
        headerTintColor: Colors.light.primary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <NotesStack.Screen
        name="NotesList"
        component={NotesListScreen}
        options={{ title: 'Field Log' }}
      />
      <NotesStack.Screen
        name="CreateNote"
        component={CreateNoteScreen}
        options={{ title: 'New Note' }}
      />
      <NotesStack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
        options={{ title: '' }}
      />
      <NotesStack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{ title: 'Edit Note' }}
      />
    </NotesStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.light.primary,
          tabBarInactiveTintColor: Colors.light.textSecondary,
          tabBarStyle: { backgroundColor: Colors.light.surface },
        }}
      >
        <Tab.Screen
          name="NotesTab"
          component={NotesNavigator}
          options={{
            title: 'Notes',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📋</Text>,
          }}
        />
        <Tab.Screen
          name="MapTab"
          component={MapScreen}
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🗺️</Text>,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
