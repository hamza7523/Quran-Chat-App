import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { ListRow } from '../../components/ui/ListRow';
import { useChatStore } from '../../store/useChatStore';
import type { ChatMode } from '../../store/useChatStore';
import { colors, typography, spacing, radius } from '../../lib/theme';

const MODES: {
  key: ChatMode;
  title: string;
  subtitle: string;
  image: any;
  accentColor: string;
}[] = [
  { key: 'ask', title: "Ask About the Qur'an", subtitle: 'Explore meaning, context & wisdom', image: require('../../assets/images/koran.png'), accentColor: colors.sage500 },
  { key: 'comfort', title: 'Find Comfort', subtitle: 'Verses for difficult moments', image: require('../../assets/images/prayer.png'), accentColor: colors.gold },
  { key: 'dua', title: "Help Me Make Du'a", subtitle: 'Guided personal prayer', image: require('../../assets/images/islamic.png'), accentColor: colors.goldDeep },
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
    <ScreenContainer scroll={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader title="Chat" subtitle="Connect with the Qur'an through guided conversation" />

        <SectionHeader title="New Conversation" meta="3 modes" />
        <View style={styles.modesList}>
          {MODES.map((mode) => (
            <Pressable key={mode.key} onPress={() => handleNewChat(mode.key)} style={({ pressed }) => [styles.modeCard, pressed && styles.modeCardPressed]}>
              <LinearGradient colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)']} style={styles.modeCardInner}>
                <View style={[styles.modeIconWrap, { backgroundColor: `${mode.accentColor}18` }]}>
                  <Image source={mode.image} style={styles.modeImage} />
                </View>
                <View style={styles.modeText}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeSub}>{mode.subtitle}</Text>
                </View>
                <View style={styles.modeChevron}>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="All Conversations" meta={`${conversations.length} ${conversations.length === 1 ? 'chat' : 'chats'}`} />

        <View style={styles.historyCard}>
          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Ionicons name="chatbubbles-outline" size={28} color={colors.textTertiary} /></View>
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptyBody}>Choose a mode above to begin your first guided chat</Text>
            </View>
          ) : (
            conversations.map((conv, index) => (
              <ListRow key={conv.id} title={conv.title} subtitle={conv.lastMessagePreview} meta={conv.updatedAt} icon="chatbubble-outline" onPress={() => router.push(`/chat/${conv.id}`)} bordered={index < conversations.length - 1} />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  modesList: { gap: spacing.sm + 4, marginBottom: spacing.xl },
  modeCard: { borderRadius: radius.md, shadowColor: '#0A1E0C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  modeCardPressed: { opacity: 0.95, transform: [{ scale: 0.98 }] },
  modeCardInner: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md, borderRadius: radius.md, borderTopWidth: 2, borderTopColor: '#FFF', borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.7)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  modeIconWrap: { width: 48, height: 48, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  modeImage: { width: 32, height: 32, resizeMode: 'contain' },
  modeText: { flex: 1 },
  modeTitle: { ...typography.displaySmall, color: colors.textPrimary, fontSize: 16, marginBottom: 2 },
  modeSub: { ...typography.bodySmall, color: colors.textSecondary },
  modeChevron: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(168,204,168,0.25)', alignItems: 'center', justifyContent: 'center' },
  
  historyCard: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', shadowColor: '#0A1E0C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, overflow: 'hidden' },
  emptyState: { padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  emptyTitle: { ...typography.bodyMedium, fontFamily: 'Inter-SemiBold', color: colors.textPrimary },
  emptyBody: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', maxWidth: 240 },
});