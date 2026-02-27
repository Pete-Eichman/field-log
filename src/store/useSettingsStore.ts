import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsState = {
  autoTagLocation: boolean;
  darkMode: boolean;
  setAutoTagLocation: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      autoTagLocation: true,
      darkMode: false,
      setAutoTagLocation: (value) => set({ autoTagLocation: value }),
      setDarkMode: (value) => set({ darkMode: value }),
    }),
    {
      name: 'field-log-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
