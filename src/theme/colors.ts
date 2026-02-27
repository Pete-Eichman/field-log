export const Colors = {
  light: {
    background: '#F5F5F0',
    surface: '#FFFFFF',
    primary: '#2D6A4F',
    primaryLight: '#52B788',
    text: '#1B1B1B',
    textSecondary: '#6B6B6B',
    border: '#E0E0D8',
    danger: '#C0392B',
    badge: {
      inspection: '#2D6A4F',
      observation: '#2980B9',
      issue: '#C0392B',
      general: '#7F8C8D',
    },
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#52B788',
    primaryLight: '#74C69D',
    text: '#F0F0F0',
    textSecondary: '#A0A0A0',
    border: '#2C2C2C',
    danger: '#E74C3C',
    badge: {
      inspection: '#52B788',
      observation: '#3498DB',
      issue: '#E74C3C',
      general: '#95A5A6',
    },
  },
};

export type ColorScheme = typeof Colors.light;
