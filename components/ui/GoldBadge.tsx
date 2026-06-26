import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors, typography, radius, spacing } from '../../lib/theme';

type GoldBadgeProps = {
  label: string;
  style?: StyleProp<TextStyle>;
  small?: boolean;
};

export default function GoldBadge({ label, style, small }: GoldBadgeProps) {
  return (
    <Text style={[styles.badge, small && styles.badgeSmall, style]}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    ...typography.label,
    fontSize: 10,
    color: colors.goldDeep,
    backgroundColor: 'rgba(201, 168, 76, 0.10)',
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  badgeSmall: {
    fontSize: 9,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
});
