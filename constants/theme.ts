import { TextStyle } from "react-native";

export const colors = {
  primary: '#3366FF',
  primaryLight: '#E6EBFF',
  primaryDark: '#0039CB',
  
  secondary: '#4ECDC4',
  secondaryLight: '#E7F9F7',
  secondaryDark: '#00A396',
  
  accent: '#00C853',
  accentLight: '#E5F8ED',
  accentDark: '#009624',
  
  success: '#00C853',
  warning: '#FFC107',
  error: '#FF3B30',
  
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    light: '#FFFFFF',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights: {[key: string]: TextStyle['fontWeight']} = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
};