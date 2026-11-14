import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const Palette = {
  primary: '#3730A3',
  primaryDark: '#312E81',
  secondary: '#6365F0',
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  accentSubtle: '#EFF6FF',
  accentBorder: 'rgba(37, 99, 235, 0.18)',
  accentRing: 'rgba(37, 99, 235, 0.25)',
  primaryRing: 'rgba(55, 48, 163, 0.18)',
  successRing: 'rgba(16, 185, 129, 0.28)',
  lavender: '#EEF2FF',
  surface: '#FFFFFF',
  background: '#F8FAFC',
  surfaceMuted: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  success: '#10B981',
  successSoft: '#ECFDF5',
  successBorder: '#A7F3D0',
  successText: '#064E3B',
  warning: '#D97706',
  warningSoft: '#FFFBEB',
  warningBorder: '#FDE68A',
  warningText: '#78350F',
  teachBg: '#EEF2FF',
  teachSoft: '#F7F9FF',
  teachText: '#3730A3',
  teachBorder: '#E0E7FF',
  learnBg: '#FDF4FF',
  learnSoft: '#FFF7FE',
  learnText: '#86198F',
  learnBorder: '#FAE8FF',
  danger: '#F43F5E',
  dangerSoft: '#FFF1F2',
  white: '#FFFFFF',
  shadow: '#0F172A',
  overlay: 'rgba(255, 255, 255, 0.14)',
  overlaySoft: 'rgba(255, 255, 255, 0.10)',
  overlayBorder: 'rgba(255, 255, 255, 0.12)',
  transparent: 'transparent',
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

export const Typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.3 },
  headline: { fontSize: 24, lineHeight: 32, fontWeight: '600', letterSpacing: -0.2 },
  headlineSmall: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  title: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
  subtitle: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '500' },
  overline: { fontSize: 10, lineHeight: 14, fontWeight: '600', letterSpacing: 1 },
} as const satisfies Record<string, TextStyle>;

export const Shadows = {
  card: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  raised: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const satisfies Record<string, ViewStyle>;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  seven: 40,
  eight: 48,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
