import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import GlassCard from '../ui/GlassCard';
import ProgressBar from '../ui/ProgressBar';
import SectionHeader from '../ui/SectionHeader';
import { useEngagementStore, DailyGoal } from '../../store/useEngagementStore';
import { colors, typography, spacing, radius, gradients, shadow } from '../../lib/theme';

const GOAL_ICONS: Record<DailyGoal['key'], keyof typeof Ionicons.glyphMap> = {
  reflection: 'sparkles-outline',
  conversation: 'chatbubble-ellipses-outline',
  verse: 'book-outline',
};

function GoalTile({
  goal,
  onComplete,
}: {
  goal: DailyGoal;
  onComplete: () => void;
}) {
  const done = goal.current >= goal.target;
  const partial = goal.current > 0 && !done;
  const icon = GOAL_ICONS[goal.key];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.goalTile,
        done && styles.goalTileDone,
        pressed && !done && styles.goalTilePressed,
      ]}
      onPress={() => {
        if (!done) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onComplete();
        }
      }}
    >
      <View style={[styles.goalIconRing, done && styles.goalIconRingDone]}>
        <View style={[styles.goalIconWrap, done && styles.goalIconWrapDone]}>
          <Ionicons
            name={done ? 'checkmark' : icon}
            size={done ? 16 : 18}
            color={done ? colors.textOnDark : colors.goldDeep}
          />
        </View>
        {partial && (
          <View style={styles.partialBadge}>
            <Text style={styles.partialText}>
              {goal.current}/{goal.target}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.goalLabel, done && styles.goalLabelDone]} numberOfLines={1}>
        {goal.label}
      </Text>
    </Pressable>
  );
}

export default function EngagementHub() {
  const streak = useEngagementStore((s) => s.streak);
  const longestStreak = useEngagementStore((s) => s.longestStreak);
  const dailyGoals = useEngagementStore((s) => s.dailyGoals);
  const completeGoal = useEngagementStore((s) => s.completeGoal);

  const completed = dailyGoals.filter((g) => g.current >= g.target).length;
  const total = dailyGoals.length;
  const allDone = completed === total;
  const progress = completed / total;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 520, easing: Easing.out(Easing.cubic) });
  }, []);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, enterStyle]}>
      <GlassCard variant="gold" style={styles.streakCard}>
        <LinearGradient
          colors={[...gradients.streak]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.streakInner}>
          <View style={styles.streakLeft}>
            <View style={styles.flameRing}>
              <LinearGradient
                colors={['rgba(232,146,58,0.28)', 'rgba(201,168,76,0.14)']}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="flame" size={22} color={colors.flame} />
            </View>
            <View style={styles.streakCopy}>
              <View style={styles.streakTitleRow}>
                <Text style={styles.streakNumber}>{streak}</Text>
                <Text style={styles.streakUnit}>day streak</Text>
              </View>
              <Text style={styles.streakMeta}>Personal best · {longestStreak} days</Text>
            </View>
          </View>

          <View style={styles.goalMeter}>
            <View style={[styles.goalMeterRing, allDone && styles.goalMeterRingDone]}>
              <Text style={[styles.goalMeterValue, allDone && styles.goalMeterValueDone]}>
                {completed}
              </Text>
              <Text style={styles.goalMeterSlash}>/</Text>
              <Text style={styles.goalMeterTotal}>{total}</Text>
            </View>
            <Text style={styles.goalMeterLabel}>Goals</Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <ProgressBar progress={progress} height={6} complete={allDone} />
          <Text style={styles.progressCaption}>
            {allDone ? 'All daily goals complete — mabrook!' : `${total - completed} goal${total - completed === 1 ? '' : 's'} remaining today`}
          </Text>
        </View>
      </GlassCard>

      <SectionHeader title="Today's Journey" badge={allDone ? 'Complete' : `${completed}/${total}`} />

      <View style={styles.goalsGrid}>
        {dailyGoals.map((goal) => (
          <GlassCard key={goal.key} variant="white" style={styles.goalCard}>
            <GoalTile goal={goal} onComplete={() => completeGoal(goal.key)} />
          </GlassCard>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: spacing.lg,
  },
  streakCard: {
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadow.card,
  },
  streakInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  flameRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232,146,58,0.32)',
  },
  streakCopy: { flex: 1 },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  streakNumber: {
    ...typography.displayMedium,
    fontSize: 28,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  streakUnit: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  streakMeta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalMeter: { alignItems: 'center', minWidth: 56 },
  goalMeterRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: colors.borderGold,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  goalMeterRingDone: {
    borderColor: colors.success,
    backgroundColor: 'rgba(45,107,45,0.12)',
  },
  goalMeterValue: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.goldDeep,
  },
  goalMeterValueDone: { color: colors.success },
  goalMeterSlash: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginHorizontal: 1,
  },
  goalMeterTotal: {
    ...typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
    color: colors.textTertiary,
  },
  goalMeterLabel: {
    ...typography.overline,
    fontSize: 9,
    color: colors.textTertiary,
    marginTop: 6,
  },
  progressBlock: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs + 2,
  },
  progressCaption: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  goalsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  goalCard: {
    flex: 1,
    minWidth: 0,
  },
  goalTile: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xs,
    minHeight: 108,
    gap: spacing.sm,
  },
  goalTileDone: {},
  goalTilePressed: {
    opacity: 0.88,
  },
  goalIconRing: {
    position: 'relative',
  },
  goalIconRingDone: {},
  goalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201,168,76,0.14)',
    borderWidth: 1.5,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIconWrapDone: {
    backgroundColor: colors.sage700,
    borderColor: colors.sage600,
  },
  partialBadge: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  partialText: {
    ...typography.bodySmall,
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: colors.goldDeep,
  },
  goalLabel: {
    ...typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  goalLabelDone: { color: colors.success },
});
