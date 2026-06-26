import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';
import ProgressBar from '../ui/ProgressBar';
import { useEngagementStore, Achievement } from '../../store/useEngagementStore';
import { colors, typography, spacing, radius, surfaces } from '../../lib/theme';

function AchievementBadge({ item }: { item: Achievement }) {
  const hasProgress = item.progress !== undefined && item.target !== undefined;
  const pct = hasProgress ? Math.min(item.progress! / item.target!, 1) : 1;

  return (
    <View style={[styles.badge, !item.unlocked && styles.badgeLocked]}>
      <Text style={[styles.badgeIcon, !item.unlocked && styles.badgeIconLocked]}>
        {item.icon}
      </Text>
      <Text style={[styles.badgeTitle, !item.unlocked && styles.badgeTitleLocked]} numberOfLines={1}>
        {item.title}
      </Text>
      {hasProgress && !item.unlocked && (
        <ProgressBar progress={pct} height={3} style={styles.badgeProgress} />
      )}
      {item.unlocked && (
        <Ionicons name="checkmark-circle" size={12} color={colors.success} style={styles.unlockedCheck} />
      )}
    </View>
  );
}

export default function AchievementsSection() {
  const achievements = useEngagementStore((s) => s.achievements);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <View style={styles.container}>
      <SectionHeader title="Achievements" meta={`${unlocked}/${achievements.length} earned`} />
      <GlassCard variant="white">
        <View style={styles.grid}>
          {achievements.map((item) => (
            <AchievementBadge key={item.id} item={item} />
          ))}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  badge: {
    width: '30%',
    flexGrow: 1,
    minWidth: 96,
    backgroundColor: surfaces.rowHover,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm + 2,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  badgeLocked: {
    opacity: 0.65,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  badgeIcon: { fontSize: 26 },
  badgeIconLocked: { opacity: 0.5 },
  badgeTitle: {
    ...typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeTitleLocked: { color: colors.textTertiary },
  badgeProgress: { marginTop: 2 },
  unlockedCheck: { position: 'absolute', top: 6, right: 6 },
});
