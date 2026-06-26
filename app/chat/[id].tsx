import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import GlassCard from '../../components/ui/GlassCard';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import { useChatStore } from '../../store/useChatStore';
import { colors, typography, spacing, radius, shadow, gradients, blur as blurIntensity } from '../../lib/theme';

// Spiritual crescent+star icon replacing the Gemini flower
function SpiritualIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={{ width: size + 4, height: size + 4, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: Math.max(2, size * 0.12),
        borderColor: colors.gold,
        position: 'absolute',
      }} />
      <View style={{
        position: 'absolute',
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size * 0.35,
        backgroundColor: colors.sage700,
        top: size * 0.05,
        left: size * 0.24,
      }} />
      <Text style={{
        position: 'absolute',
        top: -2,
        right: -2,
        fontSize: size * 0.3,
        color: colors.gold,
        lineHeight: size * 0.36,
      }}>✦</Text>
    </View>
  );
}

const MODE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  ask: 'book-outline',
  comfort: 'heart-outline',
  dua: 'hand-left-outline',
};

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const [isTyping, setIsTyping] = useState(false);

  const conversation = useChatStore((s) => s.getConversation(id ?? ''));
  const sendMessage = useChatStore((s) => s.sendMessage);
  const addAssistantMessage = useChatStore((s) => s.addAssistantMessage);
  const getModeMeta = useChatStore((s) => s.getModeMeta);

  const mode = conversation?.mode ?? 'ask';
  const meta = getModeMeta(mode);

  useEffect(() => {
    if (conversation?.messages?.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [conversation?.messages?.length, isTyping]);

  const handleSend = async (text: string) => {
    if (!id || isTyping) return;
    sendMessage(id, text);
    setIsTyping(true);

    try {
      const history = (conversation?.messages ?? []).slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
          process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: meta.systemPrompt }] },
            contents: [
              ...history.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              })),
              { role: 'user', parts: [{ text }] },
            ],
            generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
          }),
        }
      );

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        'I apologize, I was unable to generate a response. Please try again.';
      addAssistantMessage(id, reply);
    } catch {
      addAssistantMessage(id, 'Something went wrong. Please check your connection and try again.');
    } finally {
      setIsTyping(false);
    }
  };

  if (!conversation) {
    return (
      <LinearGradient colors={[...gradients.chatBg]} style={styles.flex}>
        <SafeAreaView style={[styles.flex, styles.notFound]}>
          <SpiritualIcon size={40} />
          <Text style={styles.notFoundText}>Conversation not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLinkBtn}>
            <Text style={styles.backLink}>Go back</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[...gradients.chatBg]} style={styles.flex}>
      {/* Subtle dot pattern */}
      <View style={styles.bgPattern} pointerEvents="none">
        {[...Array(16)].map((_, i) => (
          <View key={i} style={[styles.bgDot, {
            top: `${(i % 4) * 25 + 5}%` as any,
            left: `${Math.floor(i / 4) * 28 + 5}%` as any,
          }]} />
        ))}
      </View>

      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* Header */}
        <BlurView intensity={blurIntensity.light} tint="light" style={styles.headerBlur}>
          <View style={styles.header}>
            {/* Back button */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="chevron-back" size={22} color={colors.sage600} />
            </Pressable>

            {/* Mode icon */}
            <LinearGradient
              colors={[colors.sage700, colors.sage800]}
              style={styles.headerIconWrap}
            >
              <Ionicons name={MODE_ICONS[mode] ?? 'book-outline'} size={18} color={colors.gold} />
            </LinearGradient>

            {/* Title */}
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{meta.title}</Text>
              <Text style={styles.headerSubtitle}>AI Scholar · Always cite sources</Text>
            </View>

            {/* Spiritual icon (replaces Gemini flower) */}
            <View style={styles.spiritualIconWrap}>
              <SpiritualIcon size={18} />
            </View>
          </View>
        </BlurView>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ChatBubble
              role={item.role}
              content={item.content}
              citations={item.citations}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <SpiritualIcon size={32} />
              </View>
              <Text style={styles.emptyTitle}>As-salamu alaykum!</Text>
              <Text style={styles.emptyBody}>
                I'm here to help you explore the Qur'an. Ask me anything — from the meaning of a specific ayah to the stories of the prophets. What would you like to know?
              </Text>
            </View>
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        <ChatInput onSend={handleSend} disabled={isTyping} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  bgPattern: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  bgDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.sage400,
    opacity: 0.12,
  },

  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168,204,168,0.25)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glass,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.goldGlowSoft,
  },
  headerText: { flex: 1 },
  headerTitle: {
    ...typography.displaySmall,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Fraunces-SemiBold',
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  spiritualIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messageList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexGrow: 1,
  },

  // Empty state (greeting)
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.sage700,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadow.goldGlowSoft,
  },
  emptyTitle: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  notFound: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  notFoundText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  },
  backLinkBtn: {
    backgroundColor: colors.sage100,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backLink: {
    ...typography.button,
    color: colors.sage600,
  },
});