import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { ListRow } from '../../components/ui/ListRow';
import { useChatStore } from '../../store/useChatStore';
import { colors, typography, spacing, radius, gradients, surfaces } from '../../lib/theme';


export default function ProfileTab() {
  const router = useRouter();
  const conversations = useChatStore((s) => s.conversations);

  // Derived stats from real conversation data
  const stats = {
    conversations: conversations.length,
    versesExplored: conversations.length * 3, // rough estimate
    daysActive: Math.max(1, Math.ceil(conversations.length / 2)),
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Profile"
        actionIcon="settings-outline"
        onAction={() => {}}
      />

      {/* Profile Hero Card */}
      <GlassCard variant="white" style={styles.profileCard}>
        <LinearGradient
          colors={['rgba(26,61,30,0.05)', 'rgba(201,168,76,0.08)', 'rgba(255,255,255,0)']}
          style={styles.profileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.heroRow}>
          <LinearGradient colors={[...gradients.heroCard]} style={styles.avatar}>
            <Ionicons name="person" size={28} color={colors.gold} />
          </LinearGradient>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Guest</Text>
            <Text style={styles.userIntent}>Muslim · Exploring</Text>
            <View style={styles.badgeRow}>
              <Ionicons name="star" size={12} color={colors.gold} />
              <Text style={styles.learnerBadge}>Dedicated Learner</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { value: stats.conversations, label: 'Chats' },
            { value: stats.versesExplored, label: 'Verses' },
            { value: stats.daysActive,     label: 'Active Days' },
          ].map((stat, index) => (
            <View
              key={stat.label}
              style={[styles.statItem, index < 2 && styles.statItemBorder]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

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
  profileCard: { marginBottom: spacing.lg, overflow: 'hidden' },
  profileGradient: { ...StyleSheet.absoluteFillObject },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, justifyContent: 'center' },
  userName: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userIntent: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  learnerBadge: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.goldDeep,
    fontFamily: 'Inter-Medium',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: surfaces.divider,
    paddingVertical: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: surfaces.divider,
  },
  statValue: {
    ...typography.displayMedium,
    fontSize: 24,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  emptyConversations: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyConversationsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});