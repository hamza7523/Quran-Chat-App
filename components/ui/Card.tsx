// components/ui/Card.tsx
// v3 — glass-white surface on sage green background.
// The glass effect (white + blur) is the signature of this design system.

import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, shadow, spacing } from '../../lib/theme';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  // elevated = glass-white card (default, most surfaces)
  // sage     = sage-tinted glass card (secondary surfaces)
  // outlined = transparent with gold border (ayah chips, tags)
  // flat     = plain white, no shadow (list rows)
  variant?: 'elevated' | 'sage' | 'outlined' | 'flat';
  padding?: keyof typeof spacing;
};

export default function Card({
  children,
  style,
  variant = 'elevated',
  padding = 'lg',
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding: spacing[padding] },
        variant === 'elevated' && styles.elevated,
        variant === 'sage'     && styles.sage,
        variant === 'outlined' && styles.outlined,
        variant === 'flat'     && styles.flat,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  // Glass white — primary card surface
  elevated: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.88)',
    ...shadow.card,
  },
  // Glass sage — secondary card surface
  sage: {
    backgroundColor: 'rgba(236, 247, 236, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    ...shadow.card,
  },
  // Gold outlined — for chips and tags
  outlined: {
    backgroundColor: 'rgba(201, 168, 76, 0.08)',
    borderWidth: 1.5,
    borderColor: colors.borderGold,
  },
  // Flat white — for list rows inside a card
  flat: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.70)',
  },
});