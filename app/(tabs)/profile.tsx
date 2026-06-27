import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ui/ScreenContainer';
import ScreenHeader from '@/components/ui/ScreenHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import { ListRow } from '@/components/ui/ListRow';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { colors, typography, spacing, radius } from '@/lib/theme';

export default function ProfileTab() {
  const router = useRouter();
  const conversations = useChatStore((s) => s.conversations);
  const { user, signOut, isLoading } = useAuthStore();

  // Prefer auth user's name, fall back to Guest
  const displayName = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'Guest';
  const displayEmail = user?.email ?? '';

  const stats = {
    conversations: conversations.length,
    versesExplored: conversations.length * 3,
    daysActive: Math.max(1, Math.ceil(conversations.length / 2)),
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <ScreenContainer scroll={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ScreenHeader
          title="Profile"
          actionIcon="settings-outline"
          onAction={() => {}}
        />

        {/* ── 3D Profile Hero Card ──────────────────────────────────────── */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
            style={styles.profileCard}
          >
            <View style={styles.heroRow}>
              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <Image
                  source={require('../../assets/images/arab-man.png')}
                  style={styles.avatarImage}
                />
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {displayName}
                </Text>
                {displayEmail ? (
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {displayEmail}
                  </Text>
                ) : null}
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
                { value: stats.daysActive, label: 'Active Days' },
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
          </LinearGradient>
        </View>

        {/* ── Past Conversations ────────────────────────────────────────── */}
        <SectionHeader
          title="Past Conversations"
          meta={`${conversations.length} ${conversations.length === 1 ? 'chat' : 'chats'}`}
        />

        <View style={styles.cardWrapper}>
          <View style={[styles.profileCard, { padding: 0 }]}>
            {conversations.length === 0 ? (
              <View style={styles.emptyConversations}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="chatbubbles-outline" size={28} color={colors.textTertiary} />
                </View>
                <Text style={styles.emptyConversationsText}>No conversations yet</Text>
              </View>
            ) : (
              conversations.map((conv, index) => (
                <ListRow
                  key={conv.id}
                  title={conv.title}
                  meta={conv.updatedAt}
                  icon="chatbubble-outline"
                  onPress={() => router.push(`/chat/${conv.id}` as never)}
                  bordered={index < conversations.length - 1}
                />
              ))
            )}
          </View>
        </View>

        {/* ── Sign Out ──────────────────────────────────────────────────── */}
        <Pressable
          onPress={handleSignOut}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.signOutBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={styles.signOutInner}>
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={styles.signOutText}>
              {isLoading ? 'Signing out…' : 'Sign Out'}
            </Text>
          </View>
        </Pressable>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // ── Card shell — same 3D bevel as tab bar ──
  cardWrapper: {
    marginBottom: spacing.lg,
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  profileCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderTopWidth: 2,
    borderTopColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  // ── Hero row ──
  heroRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF',
    padding: 2,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    resizeMode: 'cover',
  },
  userInfo: { flex: 1, justifyContent: 'center' },
  userName: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    marginBottom: 2,
    fontSize: 22,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: 2,
    fontSize: 11,
  },
  userIntent: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  learnerBadge: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.goldDeep,
    fontFamily: 'DMSans-Medium',
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(168,204,168,0.2)',
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(168,204,168,0.2)',
  },
  statValue: {
    ...typography.displayMedium,
    fontSize: 24,
    color: colors.sage800,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'DMSans-SemiBold',
  },

  // ── Empty conversations ──
  emptyConversations: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyConversationsText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'DMSans-SemiBold',
  },

  // ── Sign out ──
  signOutBtn: {
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    // Same bevel shell as profileCard
    borderTopWidth: 2,
    borderTopColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  signOutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(192,57,43,0.07)',
    paddingVertical: spacing.md + 4,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.18)',
    borderRadius: radius.lg,
  },
  signOutText: {
    ...typography.button,
    color: colors.error,
  },
});