export const colors = {
  primary: '#0a7ea4',
  primaryDark: '#0a5a7a',
  primaryLight: '#3aa7d4',

  secondary: '#687076',
  secondaryDark: '#4a5055',
  secondaryLight: '#9BA1A6',

  background: {
    light: '#ffffff',
    dark: '#151718',
  },

  surface: {
    light: '#f5f5f5',
    dark: '#1D1D1D',
  },

  text: {
    primary: {
      light: '#11181C',
      dark: '#ECEDEE',
    },
    secondary: {
      light: '#687076',
      dark: '#9BA1A6',
    },
  },

  tint: {
    light: '#0a7ea4',
    dark: '#ffffff',
  },

  icon: {
    light: '#687076',
    dark: '#9BA1A6',
  },

  border: {
    light: '#E5E5E5',
    dark: '#333333',
  },

  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',

  placeholder: {
    light: '#E5E5E5',
    dark: '#333333',
  },

  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorKey = keyof typeof colors;
