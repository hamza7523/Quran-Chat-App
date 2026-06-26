import { View, Text, StyleSheet, Pressable } from 'react-native';

import GoldBadge from './GoldBadge';

import { colors, typography, spacing } from '../../lib/theme';



type SectionHeaderProps = {

  title: string;

  badge?: string;

  actionLabel?: string;

  onAction?: () => void;

  meta?: string;

  style?: object;

};



export default function SectionHeader({

  title,

  badge,

  actionLabel,

  onAction,

  meta,

  style,

}: SectionHeaderProps) {

  return (

    <View style={[styles.wrap, style]}>

      <View style={styles.left}>

        <Text style={styles.title}>{title}</Text>

        {meta ? <Text style={styles.metaInline}> · {meta}</Text> : null}

      </View>

      <View style={styles.right}>

        {badge ? <GoldBadge label={badge} small /> : null}

        {actionLabel && onAction ? (

          <Pressable onPress={onAction} hitSlop={8} style={styles.actionBtn}>

            <Text style={styles.action}>{actionLabel}</Text>

          </Pressable>

        ) : null}

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  wrap: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: spacing.md,

    width: '100%',

  },

  left: {

    flexDirection: 'row',

    alignItems: 'baseline',

    flex: 1,

    flexWrap: 'wrap',

  },

  title: {

    ...typography.sectionHeading,

    color: colors.textPrimary,

  },

  metaInline: {

    ...typography.bodySmall,

    color: colors.textTertiary,

  },

  right: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,

    marginLeft: spacing.sm,

  },

  actionBtn: {

    paddingVertical: 2,

  },

  action: {

    ...typography.bodySmall,

    fontFamily: 'Inter-SemiBold',

    color: colors.gold,

  },

});

