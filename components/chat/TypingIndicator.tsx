import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withDelay,
  withTiming, withSpring, Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, shadow } from '../../lib/theme';

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(-5, { damping: 8, stiffness: 200 }),
          withSpring(0, { damping: 10, stiffness: 200 })
        ),
        -1
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300, easing: Easing.ease }),
          withTiming(0.4, { duration: 300, easing: Easing.ease })
        ),
        -1
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export default function TypingIndicator() {
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={[colors.sage700, colors.sage800]}
        style={styles.avatar}
      >
        <View style={styles.crescentOuter} />
        <View style={styles.crescentInner} />
      </LinearGradient>
      <View style={[styles.bubble, shadow.glass]}>
        <Dot delay={0} />
        <Dot delay={140} />
        <Dot delay={280} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingRight: 40,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  crescentOuter: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  crescentInner: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: colors.sage700,
    top: 3,
    left: 9,
  },
  bubble: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: radius.lg,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.sage500,
  },
});