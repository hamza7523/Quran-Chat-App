import { Pressable, View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import GlassCard from './GlassCard';

import GoldBadge from './GoldBadge';

import { colors, typography, spacing, radius, shadow, surfaces } from '../../lib/theme';



export type Conversation = {

  id: string;

  title: string;

  lastMessagePreview: string;

  updatedAt: string;

};



type ListRowProps = {

  title: string;

  subtitle?: string;

  meta?: string;

  icon?: keyof typeof Ionicons.glyphMap;

  iconLetter?: string;

  onPress: () => void;

  bordered?: boolean;

};



export function ListRow({

  title,

  subtitle,

  meta,

  icon,

  iconLetter,

  onPress,

  bordered,

}: ListRowProps) {

  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));



  return (

    <Animated.View style={pressStyle}>

      <Pressable

        onPress={onPress}

        onPressIn={() => { scale.value = withSpring(0.98, { damping: 15, stiffness: 220 }); }}

        onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}

        style={[styles.row, bordered && styles.rowBorder]}

      >

        <View style={styles.iconWrap}>

          {icon ? (

            <Ionicons name={icon} size={16} color={colors.sage600} />

          ) : (

            <Text style={styles.iconLetter}>{iconLetter}</Text>

          )}

        </View>

        <View style={styles.text}>

          <View style={styles.titleRow}>

            <Text style={styles.title} numberOfLines={1}>{title}</Text>

            {meta ? <Text style={styles.meta}>{meta}</Text> : null}

          </View>

          {subtitle ? (

            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>

          ) : null}

        </View>

        <View style={styles.chevronWrap}>

          <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />

        </View>

      </Pressable>

    </Animated.View>

  );

}



type ModeListCardProps = {

  title: string;

  subtitle: string;

  ayahRef: string;

  icon: keyof typeof Ionicons.glyphMap;

  onPress: () => void;

};



export function ModeListCard({ title, subtitle, ayahRef, icon, onPress }: ModeListCardProps) {

  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));



  return (

    <Animated.View style={[pressStyle, shadow.card]}>

      <Pressable

        onPress={onPress}

        onPressIn={() => { scale.value = withSpring(0.98, { damping: 14, stiffness: 220 }); }}

        onPressOut={() => { scale.value = withSpring(1, { damping: 11, stiffness: 200 }); }}

      >

        <GlassCard variant="white">

          <View style={styles.modeRow}>

            <View style={styles.modeIcon}>

              <Ionicons name={icon} size={20} color={colors.goldPale} />

            </View>

            <View style={styles.modeText}>

              <Text style={styles.modeTitle}>{title}</Text>

              <Text style={styles.modeSubtitle}>{subtitle}</Text>

            </View>

            <View style={styles.modeTrailing}>

              <GoldBadge label={ayahRef} small />

              <View style={styles.modeArrow}>

                <Ionicons name="arrow-forward" size={14} color={colors.goldDeep} />

              </View>

            </View>

          </View>

        </GlassCard>

      </Pressable>

    </Animated.View>

  );

}



const styles = StyleSheet.create({

  row: {

    flexDirection: 'row',

    alignItems: 'center',

    padding: spacing.md,

    gap: spacing.md,

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

    borderWidth: 1,

    borderColor: colors.borderLight,

    alignItems: 'center',

    justifyContent: 'center',

  },

  iconLetter: {

    ...typography.bodyMedium,

    fontFamily: 'Inter-SemiBold',

    color: colors.gold,

    textTransform: 'uppercase',

  },

  text: { flex: 1 },

  titleRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: spacing.sm,

  },

  title: {

    ...typography.bodyMedium,

    fontFamily: 'Inter-SemiBold',

    color: colors.textPrimary,

    flex: 1,

  },

  meta: {

    ...typography.bodySmall,

    color: colors.textTertiary,

  },

  subtitle: {

    ...typography.bodySmall,

    color: colors.textSecondary,

    marginTop: 2,

  },

  chevronWrap: {

    width: 24,

    height: 24,

    borderRadius: 12,

    backgroundColor: 'rgba(255,255,255,0.45)',

    alignItems: 'center',

    justifyContent: 'center',

  },

  modeRow: {

    flexDirection: 'row',

    alignItems: 'center',

    padding: spacing.md,

    gap: spacing.md,

  },

  modeIcon: {

    width: 46,

    height: 46,

    borderRadius: radius.sm,

    backgroundColor: colors.sage700,

    alignItems: 'center',

    justifyContent: 'center',

  },

  modeText: { flex: 1, gap: 3 },

  modeTitle: {

    ...typography.bodyMedium,

    fontFamily: 'Inter-SemiBold',

    color: colors.textPrimary,

  },

  modeSubtitle: {

    ...typography.bodySmall,

    color: colors.textSecondary,

  },

  modeTrailing: {

    alignItems: 'flex-end',

    gap: spacing.sm,

  },

  modeArrow: {

    width: 28,

    height: 28,

    borderRadius: 14,

    backgroundColor: 'rgba(201,168,76,0.14)',

    borderWidth: 1,

    borderColor: colors.borderGold,

    alignItems: 'center',

    justifyContent: 'center',

  },

});

