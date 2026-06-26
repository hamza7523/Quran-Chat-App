import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ChatMode } from '../../store/useChatStore';
import GlassCard from '../ui/GlassCard';
import { colors, typography, spacing, shadow } from '../../lib/theme';

const MODE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  ask: 'book-outline',
  comfort: 'heart-outline',
  dua: 'hand-left-outline',
};

type ChatModeCardProps = {
  title: string;
  ayahReference: string;
  modeKey?: ChatMode | string;
  index: number;
  onPress: () => void;
};

export default function ChatModeCard({
  title,
  ayahReference,
  modeKey,
  index,
  onPress,
}: ChatModeCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const pressScale = useSharedValue(1);
  const iconName = (modeKey && MODE_ICONS[modeKey]) || 'chatbubble-ellipses-outline';

  useEffect(() => {
    const delay = 200 + index * 100;
    opacity.value = withDelay(delay, withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 460, easing: Easing.out(Easing.cubic) }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <Animated.View style={[containerStyle, styles.wrapper]}>
      <Animated.View style={[pressStyle, shadow.card]}>
        <Pressable
          onPress={onPress}
          onPressIn={() => { pressScale.value = withSpring(0.95, { damping: 14, stiffness: 220 }); }}
          onPressOut={() => { pressScale.value = withSpring(1, { damping: 11, stiffness: 200 }); }}
        >
          <GlassCard variant="white" style={styles.card}>
            <View style={styles.cardInner}>
              <View style={styles.iconWrap}>
                <Ionicons name={iconName} size={18} color={colors.goldPale} />
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.ref} numberOfLines={1}>{ayahReference}</Text>
            </View>
          </GlassCard>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, minWidth: 0 },
  card: { flex: 1 },
  cardInner: {
    padding: spacing.md,
    minHeight: 128,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.sage700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    textAlign: 'center',
    flex: 1,
  },
  ref: {
    ...typography.bodySmall,
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
