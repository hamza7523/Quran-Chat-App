// ─── Palette ─────────────────────────────────────────────────────────────────
export const colors = {
  // Sage greens
  sage100: '#EEF5EE',
  sage200: '#D4E8D4',
  sage300: '#B8D8B8',
  sage400: '#A8CCA8',
  sage500: '#6B9E6B',
  sage600: '#4A7C4A',
  sage700: '#2D5A2D',
  sage800: '#1A3D1A',
  sage900: '#0D2B0D',

  // Gold accents
  gold: '#C9A84C',
  goldMuted: '#D4B96A',
  goldDeep: '#A07828',
  goldLight: '#F0D98A',

  // Backgrounds
  bgBase: '#E8F0E8',
  bgCard: 'rgba(255,255,255,0.82)',
  bgCardSage: 'rgba(212,232,212,0.55)',
  bubbleAI: 'rgba(255,255,255,0.88)',

  // Text
  textPrimary: '#1A2E1A',
  textSecondary: '#4A6B4A',
  textTertiary: '#7A9B7A',
  textOnDark: '#F4F8F4',
  textOnGold: '#FFFFFF',

  // Borders
  borderLight: 'rgba(255,255,255,0.85)',
  borderSage: 'rgba(168,204,168,0.35)',
  borderGold: 'rgba(201,168,76,0.40)',

  // Semantic
  error: '#C0392B',
  success: '#27AE60',
};
// ─── Surfaces (NEW) ──────────────────────────────────────────────────────────
export const surfaces = {
  divider: 'rgba(26,61,30,0.08)',     // Very subtle sage line
  glassLight: 'rgba(255,255,255,0.7)',
  glassDark: 'rgba(26,61,30,0.05)',
  overlay: 'rgba(0,0,0,0.2)',
};
// ─── Typography ──────────────────────────────────────────────────────────────
export const typography = {
  displayLarge: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 18,
    lineHeight: 24,
  },
  sectionHeading: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: 'DMSans-Regular',
    fontSize: 17,
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  arabicHero: {
    fontFamily: 'Amiri-Regular',
    fontSize: 28,
    lineHeight: 48,
  },
  arabicBody: {
    fontFamily: 'Amiri-Regular',
    fontSize: 20,
    lineHeight: 36,
  },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ─── Border Radius ───────────────────────────────────────────────────────────
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const shadow = {
  card: {
    shadowColor: '#1A3D1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardStrong: {
    shadowColor: '#0D2B0D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  glass: {
    shadowColor: '#1A3D1A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  goldGlowSoft: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
};

// ─── Gradients ───────────────────────────────────────────────────────────────
export const gradients = {
  screenBg: ['#E8F0E8', '#D4E8D4', '#ECF4EC'] as const,
  chatBg: ['#EDF4ED', '#E0EDE0', '#EBF3EB'] as const,
  sageBg: ['#E8F0E8', '#D4E8D4', '#ECF4EC'] as const, // <-- ADD THIS LINE
  heroCard: [colors.sage700, colors.sage800, '#0A1E0C'] as const,
  goldBtn: [colors.gold, colors.goldDeep] as const,
};

// ─── Blur ────────────────────────────────────────────────────────────────────
export const blur = {
  light: 20,
  medium: 40,
  heavy: 60,
};