import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { ListRow } from '../../components/ui/ListRow';
import { useChatStore } from '../../store/useChatStore';
import { colors, typography, spacing, radius, gradients, surfaces, shadow } from '../../lib/theme';

const ACHIEVEMENTS = [
  { icon: 'book-outline' as const, label: 'First Chat', unlocked: true },
  { icon: 'flame-outline' as const, label: '3-Day Streak', unlocked: false },
  { icon: 'star-outline' as const, label: '10 Verses', unlocked: false },
  { icon: 'heart-outline' as const, label: 'Found Comfort', unlocked: false },
];

function StatCard({ value, label, index }: { value: number; label: string; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 60).duration(300).springify()}
      style={styles.statItem}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function ProfileTab() {
  const router = useRouter();
  const conversations = useChatStore((s) => s.conversations);

  const stats = {
    conversations: conversations.length,
    versesExplored: conversations.length * 3,
    daysActive: Math.max(1, Math.ceil(conversations.length / 2)),
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Profile"
        actionIcon="settings-outline"
        onAction={() => {}}
      />

      {/* Profile Hero */}
      <Animated.View entering={FadeInDown.duration(350).springify()}>
        <LinearGradient
          colors={[colors.sage700, colors.sage800, '#091A0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.profileCard, shadow.cardStrong]}
        >
          {/* Decorative pattern */}
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.cardDot, {
              top: `${20 + (i % 3) * 30}%` as any,
              right: `${(i / 8) * 60}%` as any,
              opacity: 0.06 + (i % 2) * 0.03,
            }]} />
          ))}

          <View style={styles.heroRow}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={['rgba(201,168,76,0.25)', 'rgba(201,168,76,0.10)']}
                style={styles.avatar}
              >
                <Ionicons name="person" size={30} color={colors.gold} />
              </LinearGradient>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>Guest User</Text>
              <Text style={styles.userIntent}>Muslim · Seeker of Knowledge</Text>
              <View style={styles.badgeRow}>
                {[1,2,3,4,5].map((s) => (
                  <Ionicons key={s} name={s <= 4 ? "star" : "star-outline"} size={12} color={colors.gold} />
                ))}
                <Text style={styles.learnerBadge}>Dedicated Learner</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard value={stats.conversations} label="Conversations" index={0} />
            <View style={styles.statDivider} />
            <StatCard value={stats.versesExplored} label="Verses Explored" index={1} />
            <View style={styles.statDivider} />
            <StatCard value={stats.daysActive} label="Days Active" index={2} />
          </View>

          {/* CTA */}
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Save your conversations</Text>
            <Pressable style={styles.signInBtn}>
              <Text style={styles.signInText}>Sign In / Register</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Save prompt card */}
      <Animated.View entering={FadeInDown.delay(150).duration(300).springify()}>
        <LinearGradient
          colors={['rgba(255,248,225,0.95)', 'rgba(255,243,200,0.85)']}
          style={[styles.ctaCard, shadow.glass]}
        >
          <View style={styles.ctaCardInner}>
            <View style={styles.ctaCardIcon}>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.goldDeep} />
            </View>
            <View style={styles.ctaCardText}>
              <Text style={styles.ctaCardTitle}>Save your conversations</Text>
              <Text style={styles.ctaCardBody}>
                Sign in to sync your history across devices and never lose a conversation.
              </Text>
            </View>
          </View>
          <Pressable style={styles.goldBtn}>
            <LinearGradient
              colors={[colors.gold, colors.goldDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.goldBtnGradient}
            >
              <Text style={styles.goldBtnText}>Sign In / Register</Text>
            </LinearGradient>
          </Pressable>
        </LinearGradient>
      </Animated.View>

      {/* Achievements */}
      <SectionHeader title="Achievements" meta={`${ACHIEVEMENTS.filter(a => a.unlocked).length}/${ACHIEVEMENTS.length}`} />
      <View style={styles.achievementsRow}>
        {ACHIEVEMENTS.map((a, i) => (
          <Animated.View
            key={a.label}
            entering={FadeInDown.delay(300 + i * 50).duration(280).springify()}
            style={[styles.achievementItem, !a.unlocked && styles.achievementLocked]}
          >
            <LinearGradient
              colors={a.unlocked
                ? [colors.sage700, colors.sage800]
                : ['rgba(168,204,168,0.30)', 'rgba(148,184,148,0.20)']
              }
              style={styles.achievementIcon}
            >
              <Ionicons
                name={a.icon}
                size={20}
                color={a.unlocked ? colors.gold : colors.textTertiary}
              />
            </LinearGradient>
            <Text style={[styles.achievementLabel, !a.unlocked && styles.achievementLabelLocked]}>
              {a.label}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Past Conversations */}
      <SectionHeader
        title="Past Conversations"
        meta={`${conversations.length} ${conversations.length === 1 ? 'chat' : 'chats'}`}
      />

      <GlassCard variant="sage">
        {conversations.length === 0 ? (
          <View style={styles.emptyConversations}>
            <Ionicons name="chatbubbles-outline" size={22} color={colors.textTertiary} />
            <Text style={styles.emptyConversationsText}>No conversations yet</Text>
          </View>
        ) : (
          conversations.map((conv, index) => (
            <ListRow
              key={conv.id}
              title={conv.title}
              meta={conv.updatedAt}
              icon="chatbubble-outline"
              onPress={() => router.push(`/chat/${conv.id}`)}
              bordered={index < conversations.length - 1}
            />
          ))
        )}
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Profile card
  profileCard: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadow.cardStrong,
  },
  cardDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.40)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.sage800,
  },
  userInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  userName: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 20,
    color: colors.textOnDark,
    lineHeight: 26,
  },
  userIntent: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(244,248,244,0.70)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  learnerBadge: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.goldMuted,
    marginLeft: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignSelf: 'stretch',
  },
  statValue: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 26,
    color: colors.textOnDark,
    lineHeight: 32,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'rgba(244,248,244,0.55)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // CTA inside card
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  ctaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(244,248,244,0.55)',
  },
  signInBtn: {
    backgroundColor: 'rgba(201,168,76,0.20)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
  },
  signInText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.gold,
  },

  // CTA card below
  ctaCard: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    ...shadow.glass,
  },
  ctaCardInner: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  ctaCardIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCardText: { flex: 1, gap: 4 },
  ctaCardTitle: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 15,
    color: colors.goldDeep,
  },
  ctaCardBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  goldBtn: { borderRadius: radius.full, overflow: 'hidden' },
  goldBtnGradient: {
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  goldBtnText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Achievements
  achievementsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
  },
  achievementItem: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    ...shadow.glass,
  },
  achievementLocked: { opacity: 0.55 },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
  achievementLabelLocked: { color: colors.textTertiary },

  // Conversations
  emptyConversations: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyConversationsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});