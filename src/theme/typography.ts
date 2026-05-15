import { Platform } from 'react-native';

export const typography = {
  fonts: {
    regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    medium: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' }),
    bold: Platform.select({ ios: 'System', android: 'Roboto-Bold', default: 'System' }),
    mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'Courier' })
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  weights: {
    thin: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};
