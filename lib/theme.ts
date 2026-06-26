// lib/theme.ts — Premium sage-green design system with Fluent glass depth.

export const colors = {
  sage50:  '#F4F8F4',
  sage100: '#E4EEE4',
  sage200: '#D0E4D0',
  sage300: '#A8CCA8',
  sage400: '#7AAE7A',
  sage500: '#4A8A4A',
  sage600: '#2D6B2D',
  sage700: '#1A3D1E',
  sage800: '#122614',

  goldPale:      '#F5EACC',
  gold:          '#C9A84C',
  goldDeep:      '#9C7A2E',
  goldGlowColor: '#E8C868',
  goldMuted:     '#D4B86A',

  cream:     '#FAF8F3',
  creamDark: '#F0EDE4',

  textPrimary:   '#1A3D1E',
  textSecondary: '#4A6B4A',
  textTertiary:  '#7A9A7A',
  textOnDark:    '#F4F8F4',
  textOnGold:    '#1A3D1E',

  glassWhite:  'rgba(255, 255, 255, 0.55)',
  glassSage:   'rgba(236, 247, 236, 0.45)',
  glassDark:   'rgba(18, 46, 20, 0.55)',
  glassTab:    'rgba(255, 255, 255, 0.65)',
  glassGold:   'rgba(201, 168, 76, 0.18)',

  borderLight:      'rgba(255, 255, 255, 0.65)',
  borderSage:       'rgba(168, 204, 168, 0.45)',
  borderGold:       'rgba(201, 168, 76, 0.45)',
  borderGoldBright: 'rgba(201, 168, 76, 0.75)',

  bubbleUser: '#C9A84C',
  bubbleAI:   'rgba(255, 255, 255, 0.88)',

  error:   '#C0392B',
  success: '#2D6B2D',
  flame:   '#E8923A',

  navy: '#1A3D1E', navy900: '#0A1E0C', navy800: '#122614',
  navy700: '#1A3D1E', navy600: '#234F27', navy500: '#2A5E2F', navy400: '#3A7040',
  cream_legacy: '#EDF4ED',
  border: 'rgba(168, 204, 168, 0.60)',
  borderSubtle: 'rgba(255, 255, 255, 0.50)',
  textOnGoldLegacy: '#1A3D1E',
} as const;

export const blur = {
  light:  28,
  medium: 40,
  heavy:  60,
  tabBar: 50,
} as const;

export const gradients = {
  sageBg:     ['#E8F0E8', '#D4E6D4', '#E8F2E8', '#F4F8F4'] as const,
  heroCard:   ['#1A3D1E', '#234F27', '#2A5E2F'] as const,
  goldButton: [colors.gold, colors.goldDeep] as const,
  goldText:   [colors.goldPale, colors.gold] as const,
  modeCard:   ['rgba(255,255,255,0.45)', 'rgba(250,248,243,0.35)'] as const,
  ctaCard:    ['rgba(232,228,200,0.55)', 'rgba(212,216,176,0.45)', 'rgba(200,212,168,0.40)'] as const,
  chatBg:     ['#E4EEE4', '#ECF4EC', '#F4F8F4'] as const,
  streak:     ['rgba(232,146,58,0.15)', 'rgba(201,168,76,0.10)'] as const,
  engagement: ['rgba(255,255,255,0.50)', 'rgba(236,247,236,0.35)'] as const,
} as const;

export const fonts = {
  display:         'Fraunces-Regular',
  displaySemiBold: 'Fraunces-SemiBold',
  displayItalic:   'Fraunces-Italic',
  body:            'Inter-Regular',
  bodyMedium:      'Inter-Medium',
  bodySemiBold:    'Inter-SemiBold',
  arabic:          'Amiri-Regular',
  arabicBold:      'Amiri-Bold',
} as const;

export const typography = {
  arabicHero:  { fontFamily: fonts.arabicBold, fontSize: 36, lineHeight: 58, textAlign: 'center' as const },
  arabicBody:  { fontFamily: fonts.arabic,     fontSize: 26, lineHeight: 44 },
  arabicSmall: { fontFamily: fonts.arabic,     fontSize: 16, lineHeight: 30 },

  displayLarge:  { fontFamily: fonts.displaySemiBold, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  displayMedium: { fontFamily: fonts.displaySemiBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  displaySmall:  { fontFamily: fonts.display, fontSize: 17, lineHeight: 24 },

  bodyLarge:  { fontFamily: fonts.body,         fontSize: 16, lineHeight: 25 },
  bodyMedium: { fontFamily: fonts.body,         fontSize: 14, lineHeight: 21 },
  bodySmall:  { fontFamily: fonts.body,         fontSize: 12, lineHeight: 17 },
  button:     { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20, letterSpacing: 0.2 },
  label:      { fontFamily: fonts.bodySemiBold, fontSize: 10, lineHeight: 14, letterSpacing: 1.8 },

  sectionHeading: { fontFamily: fonts.displaySemiBold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  caption:        { fontFamily: fonts.displayItalic, fontSize: 13, lineHeight: 19, fontStyle: 'italic' as const },
  overline:       { fontFamily: fonts.bodySemiBold, fontSize: 10, lineHeight: 14, letterSpacing: 2.0 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 12, md: 20, lg: 28, xl: 36, full: 999 } as const;

export const surfaces = {
  divider: 'rgba(168, 204, 168, 0.22)',
  dividerStrong: 'rgba(168, 204, 168, 0.30)',
  rowHover: 'rgba(255, 255, 255, 0.55)',
  inputBg: 'rgba(255, 255, 255, 0.45)',
} as const;

export const shadow = {
  card: {
    shadowColor: '#1A3D1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  cardStrong: {
    shadowColor: '#1A3D1E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
  floating: {
    shadowColor: '#1A3D1E',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.10,
    shadowRadius: 36,
    elevation: 16,
  },
  goldGlow: {
    shadowColor: colors.goldGlowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  goldGlowSoft: {
    shadowColor: colors.goldGlowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    elevation: 4,
  },
  tabBar: {
    shadowColor: '#1A3D1E',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 12,
  },
  glass: {
    shadowColor: '#1A3D1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;

const theme = { colors, blur, gradients, fonts, typography, spacing, radius, surfaces, shadow };
export default theme;
