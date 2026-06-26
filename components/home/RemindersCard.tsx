import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';
import { useEngagementStore, Reminder } from '../../store/useEngagementStore';
import { colors, typography, spacing, radius, surfaces } from '../../lib/theme';

const ICON_MAP: Record<Reminder['icon'], keyof typeof Ionicons.glyphMap> = {
  sunny: 'sunny-outline',
  moon: 'moon-outline',
  book: 'book-outline',
  heart: 'heart-outline',
};

type RemindersCardProps = {
  compact?: boolean;
};

export default function RemindersCard({ compact }: RemindersCardProps) {
  const reminders = useEngagementStore((s) => s.reminders);
  const toggleReminder = useEngagementStore((s) => s.toggleReminder);
  const visible = compact ? reminders.slice(0, 2) : reminders;
  const activeCount = reminders.filter((r) => r.enabled).length;

  return (
    <View style={styles.container}>
      <SectionHeader
        title={compact ? 'Reminders' : 'Your Reminders'}
        badge={`${activeCount} active`}
      />

      <GlassCard variant="sage">
        {visible.map((reminder, index) => (
          <View
            key={reminder.id}
            style={[styles.row, index < visible.length - 1 && styles.rowBorder]}
          >
            <View style={[styles.iconWrap, reminder.enabled && styles.iconWrapActive]}>
              <Ionicons
                name={ICON_MAP[reminder.icon]}
                size={18}
                color={reminder.enabled ? colors.goldDeep : colors.textTertiary}
              />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, !reminder.enabled && styles.rowTitleOff]}>
                {reminder.title}
              </Text>
              <Text style={styles.rowSub}>
                {reminder.time} · {reminder.subtitle}
              </Text>
            </View>
            <Switch
              value={reminder.enabled}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleReminder(reminder.id);
              }}
              trackColor={{ false: colors.sage200, true: 'rgba(201,168,76,0.45)' }}
              thumbColor={reminder.enabled ? colors.gold : colors.cream}
              ios_backgroundColor={colors.sage200}
            />
          </View>
        ))}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: surfaces.divider,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: surfaces.rowHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderColor: colors.borderGold,
  },
  rowText: { flex: 1 },
  rowTitle: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  rowTitleOff: { color: colors.textTertiary },
  rowSub: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
