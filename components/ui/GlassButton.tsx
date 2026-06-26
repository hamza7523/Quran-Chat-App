import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, radius, shadow, spacing, blur as blurIntensity } from '../../lib/theme';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof Ionicons.glyphMap;
  /** glass = frosted | gold = gradient CTA | dark = on hero cards | ghost = minimal */
  variant?: 'glass' | 'gold' | 'dark' | 'ghost';
  compact?: boolean;
};

export default function GlassButton({
  label,
  onPress,
  loading,
  disabled,
  style,
  icon,
  variant = 'glass',
  compact,
}: GlassButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === 'gold') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [pressed && styles.pressed, style]}
      >
        <LinearGradient
          colors={[colors.gold, colors.goldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.goldBtn, compact && styles.compact, shadow.goldGlow]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.labelRow}>
              {icon && <Ionicons name={icon} size={16} color="#fff" />}
              <Text style={styles.goldLabel}>{label}</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  const isDark = variant === 'dark';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.glassWrap,
        compact && styles.compact,
        isGhost && styles.ghostWrap,
        shadow.glass,
        pressed && styles.pressed,
        style,
      ]}
    >
      {!isGhost && (
        <BlurView
          intensity={isDark ? blurIntensity.medium : blurIntensity.light}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        />
      )}
      <View
        style={[
          styles.glassInner,
          isDark && styles.darkInner,
          isGhost && styles.ghostInner,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isDark ? colors.gold : colors.sage600} size="small" />
        ) : (
          <View style={styles.labelRow}>
            {icon && (
              <Ionicons
                name={icon}
                size={15}
                color={isDark ? colors.goldPale : colors.sage600}
              />
            )}
            <Text style={[styles.glassLabel, isDark && styles.darkLabel, isGhost && styles.ghostLabel]}>
              {label}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glassWrap: {
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  ghostWrap: {
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  glassInner: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkInner: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  ghostInner: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  goldBtn: {
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md + 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  glassLabel: {
    ...typography.button,
    fontSize: 14,
    color: colors.textPrimary,
  },
  darkLabel: {
    color: 'rgba(255,255,255,0.90)',
  },
  ghostLabel: {
    color: 'rgba(255,255,255,0.80)',
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  goldLabel: {
    ...typography.button,
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
});
