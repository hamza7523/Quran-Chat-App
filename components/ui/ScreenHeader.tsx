import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import IconButton from './IconButton';

import { colors, typography, spacing } from '../../lib/theme';



type ScreenHeaderProps = {

  overline?: string;

  title: string;

  subtitle?: string;

  actionIcon?: keyof typeof Ionicons.glyphMap;

  onAction?: () => void;

  action?: React.ReactNode;

  style?: object;

};



export default function ScreenHeader({

  overline,

  title,

  subtitle,

  actionIcon = 'person-outline',

  onAction,

  action,

  style,

}: ScreenHeaderProps) {

  return (

    <View style={[styles.wrap, style]}>

      <View style={styles.textBlock}>

        {overline ? (

          <View style={styles.overlineRow}>

            <View style={styles.overlineDot} />

            <Text style={styles.overline}>{overline}</Text>

          </View>

        ) : null}

        <Text style={styles.title}>{title}</Text>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      </View>

      {action ??

        (onAction ? (

          <IconButton icon={actionIcon} onPress={onAction} accessibilityLabel="Open profile" />

        ) : null)}

    </View>

  );

}



export function ScreenHeaderAction({

  label,

  onPress,

}: {

  label: string;

  onPress: () => void;

}) {

  return (

    <Pressable onPress={onPress} hitSlop={8}>

      <Text style={styles.linkAction}>{label}</Text>

    </Pressable>

  );

}



const styles = StyleSheet.create({

  wrap: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginTop: spacing.xs,

    marginBottom: spacing.lg,

  },

  textBlock: { flex: 1, paddingRight: spacing.md },

  overlineRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    marginBottom: 6,

  },

  overlineDot: {

    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: colors.gold,

  },

  overline: {

    ...typography.bodySmall,

    fontFamily: 'Inter-Medium',

    color: colors.textTertiary,

    letterSpacing: 0.3,

  },

  title: {

    ...typography.displayLarge,

    color: colors.textPrimary,

    letterSpacing: -0.4,

  },

  subtitle: {

    ...typography.bodyMedium,

    color: colors.textSecondary,

    marginTop: spacing.xs,

    maxWidth: '92%',

  },

  linkAction: {

    ...typography.bodySmall,

    fontFamily: 'Inter-SemiBold',

    color: colors.gold,

  },

});

