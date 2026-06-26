import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, shadow, blur as blurIntensity } from '../../lib/theme';

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  border?: boolean;
  /** 'white' | 'sage' | 'gold' | 'dark' */
  variant?: 'white' | 'sage' | 'gold' | 'dark';
};

const OVERLAYS = {
  white: 'rgba(255, 255, 255, 0.45)',
  sage:  'rgba(236, 247, 236, 0.38)',
  gold:  'rgba(201, 168, 76, 0.12)',
  dark:  'rgba(18, 46, 20, 0.35)',
};

const BORDERS = {
  white: colors.borderLight,
  sage:  colors.borderSage,
  gold:  colors.borderGold,
  dark:  'rgba(255,255,255,0.12)',
};

export default function GlassCard({
  children,
  style,
  intensity = blurIntensity.light,
  tint = 'light',
  border = true,
  variant = 'white',
}: GlassCardProps) {
  return (
    <View style={[styles.wrap, shadow.glass, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[StyleSheet.absoluteFill, styles.blur]}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      />
      <View
        style={[
          styles.overlay,
          { backgroundColor: OVERLAYS[variant] },
          border && { borderWidth: 1, borderColor: BORDERS[variant] },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: radius.md,
  },
  overlay: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
});
