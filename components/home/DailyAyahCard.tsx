import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadow } from '../../lib/theme';
import GlassButton from '../ui/GlassButton';

type DailyAyahCardProps = {
  arabicText: string;
  englishText: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  onPress?: () => void;
  onReflect?: () => void;
  loading?: boolean;
};

export default function DailyAyahCard({
  arabicText,
  englishText,
  surahName,
  surahNumber,
  ayahNumber,
  onPress,
  onReflect,
  loading = false,
}: DailyAyahCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.96);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 650, easing: Easing.out(Easing.cubic) });
    scale.value = withSpring(1, { damping: 16, stiffness: 110 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const cardContent = (
    <LinearGradient
      colors={['#1A3D1E', '#234F27', '#2A5E2F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.card}
    >
      <View style={styles.starTopRight} pointerEvents="none">
        <Text style={styles.starGlyph}>✦</Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <View style={styles.skeletonLineArabic} />
          <View style={styles.skeletonLineEnglish} />
        </View>
      ) : (
        <>
          <Text style={styles.arabic}>{arabicText}</Text>

          <View style={styles.dividerRow}>
            <Text style={styles.sparkle}>✦</Text>
          </View>

          <Text style={styles.english}>{englishText}</Text>

          <View style={styles.bottomRow}>
            <LinearGradient
              colors={[colors.gold, colors.goldDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.referencePill, shadow.goldGlowSoft]}
            >
              <Text style={styles.reference}>
                {surahName} {surahNumber}:{ayahNumber}
              </Text>
            </LinearGradient>
            <GlassButton
              label="Reflect →"
              onPress={() => (onReflect ?? onPress)?.()}
              variant="ghost"
              compact
            />
          </View>
        </>
      )}
    </LinearGradient>
  );

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={[pressStyle, shadow.cardStrong]}>
        {onPress ? (
          <Pressable
            onPress={onPress}
            onPressIn={() => { pressScale.value = withSpring(0.97, { damping: 15, stiffness: 200 }); }}
            onPressOut={() => { pressScale.value = withSpring(1, { damping: 12, stiffness: 180 }); }}
          >
            {cardContent}
          </Pressable>
        ) : (
          cardContent
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.35)',
    padding: spacing.xl,
    paddingVertical: spacing.xl + 4,
    alignItems: 'center',
    overflow: 'hidden',
  },
  starTopRight: {
    position: 'absolute',
    top: 16,
    right: 20,
    opacity: 0.15,
  },
  starGlyph: {
    fontSize: 24,
    color: colors.gold,
  },
  arabic: {
    ...typography.arabicHero,
    color: colors.goldPale,
    textAlign: 'center',
  },
  dividerRow: {
    marginVertical: spacing.md,
  },
  sparkle: {
    fontSize: 12,
    color: colors.gold,
  },
  english: {
    ...typography.displaySmall,
    color: colors.textOnDark,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    lineHeight: 26,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xs,
  },
  referencePill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 2,
  },
  reference: {
    ...typography.label,
    fontSize: 10,
    color: '#FFFFFF',
  },
  reflectButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  reflectText: {
    ...typography.bodySmall,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.85)',
  },
  loadingState: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  skeletonLineArabic: {
    width: '70%',
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  skeletonLineEnglish: {
    width: '85%',
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
