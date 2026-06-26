import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { ModeListCard, ListRow } from '../../components/ui/ListRow';
import { useChatStore } from '../../store/useChatStore';
import type { ChatMode } from '../../store/useChatStore';
import { colors, typography, spacing } from '../../lib/theme';

const MODES: {
  key: ChatMode;
  title: string;
  subtitle: string;
  icon: 'book-outline' | 'heart-outline' | 'hand-left-outline';
  ayahRef: string;
}[] = [
  {
    key: 'ask',
    title: "Ask About the Qur'an",
    subtitle: 'Explore meaning, context & wisdom',
    icon: 'book-outline',
    ayahRef: 'Al-Fatiha 1:1',
  },
  {
    key: 'comfort',
    title: 'Find Comfort',
    subtitle: 'Verses for difficult moments',
    icon: 'heart-outline',
    ayahRef: 'Al-Inshirah 94:5',
  },
  {
    key: 'dua',
    title: "Help Me Make Du'a",
    subtitle: 'Guided personal prayer',
    icon: 'hand-left-outline',
    ayahRef: 'Al-Baqarah 2:186',
  },
];

export default function ChatTab() {
  const router = useRouter();
  const conversations = useChatStore((s) => s.conversations);
  const createConversation = useChatStore((s) => s.createConversation);

  const handleNewChat = (mode: ChatMode) => {
    const id = createConversation(mode);
    router.push(`/chat/${id}`);
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Chat"
        subtitle="Connect with the Qur'an through guided conversation"
      />

      <SectionHeader title="New Conversation" meta="3 modes" />
      <View style={styles.modesList}>
        {MODES.map((mode) => (
          <ModeListCard
            key={mode.key}
            title={mode.title}
            subtitle={mode.subtitle}
            ayahRef={mode.ayahRef}
            icon={mode.icon}
            onPress={() => handleNewChat(mode.key)}
          />
        ))}
      </View>

      <SectionHeader
        title="All Conversations"
        meta={`${conversations.length} ${conversations.length === 1 ? 'chat' : 'chats'}`}
      />

      <GlassCard variant="sage">
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubbles-outline" size={24} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyBody}>
              Choose a mode above to begin your first guided chat
            </Text>
          </View>
        ) : (
          conversations.map((conv, index) => (
            <ListRow
              key={conv.id}
              title={conv.title}
              subtitle={conv.lastMessagePreview}
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
  modesList: { gap: spacing.sm, marginBottom: spacing.xl },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.50)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  emptyBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
  },
});
