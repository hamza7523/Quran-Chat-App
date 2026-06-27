import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import { useChatStore, type Citation } from '../../store/useChatStore';
import {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  gradients,
  blur as blurIntensity,
} from '../../lib/theme';

const MODE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  ask: 'book-outline',
  comfort: 'heart-outline',
  dua: 'hand-left-outline',
};

const EMPTY_STATE_TEXT: Record<string, { title: string; body: string }> = {
  ask: {
    title: 'As-salamu alaykum!',
    body: "I am here to help you explore the Qur'an. Ask me anything — from the meaning of a specific ayah to the stories of the prophets.",
  },
  comfort: {
    title: 'Peace be upon you',
    body: "Whatever you are going through, the Qur'an is a source of healing and comfort. Tell me how you are feeling right now.",
  },
  dua: {
    title: 'Let us pray together',
    body: "Tell me what you are seeking from Allah, and I will help you find the right words from the Qur'an and Sunnah.",
  },
};

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const conversation = useChatStore((s) => s.getConversation(id ?? ''));
  const sendMessage = useChatStore((s) => s.sendMessage);
  const getModeMeta = useChatStore((s) => s.getModeMeta);

  const mode = conversation?.mode ?? 'ask';
  const meta = getModeMeta(mode);

  // isLoading = there is a loading bubble in the messages list
  const isLoading = conversation?.messages.some((m) => m.isLoading) ?? false;

  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    if (conversation?.messages?.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [conversation?.messages?.length, isLoading]);

  const handleSend = async (text: string) => {
    if (!id || isLoading) return;
    await sendMessage(id, text);
  };

  if (!conversation) {
    return (
      <LinearGradient colors={[...gradients.chatBg]} style={styles.flex}>
        <SafeAreaView style={[styles.flex, styles.notFound]}>
          <MaterialCommunityIcons name="star-crescent" size={48} color={colors.gold} />
          <Text style={styles.notFoundText}>Conversation not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLinkBtn}>
            <Text style={styles.backLink}>Go back</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={[...gradients.chatBg]} style={styles.flex}>
        {/* Background dot pattern */}
        <View style={styles.bgPattern} pointerEvents="none">
          {[...Array(16)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.bgDot,
                {
                  top: `${(i % 4) * 25 + 5}%` as `${number}%`,
                  left: `${Math.floor(i / 4) * 28 + 5}%` as `${number}%`,
                },
              ]}
            />
          ))}
        </View>

        <SafeAreaView style={styles.flex} edges={['top']}>
          {/* ── Header ─────────────────────────────────────────────────── */}
          <BlurView
            intensity={blurIntensity.medium}
            tint="light"
            style={styles.headerBlur}
          >
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Ionicons name="chevron-back" size={22} color={colors.sage700} />
              </Pressable>

              <LinearGradient
                colors={[colors.sage700, colors.sage800]}
                style={styles.headerIconWrap}
              >
                <Ionicons
                  name={MODE_ICONS[mode] ?? 'book-outline'}
                  size={18}
                  color={colors.gold}
                />
              </LinearGradient>

              <View style={styles.headerText}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {meta.title}
                </Text>
                <Text style={styles.headerSubtitle}>
                  AI Scholar · Always cite sources
                </Text>
              </View>

              <View style={styles.spiritualIconWrap}>
                <MaterialCommunityIcons
                  name="star-crescent"
                  size={20}
                  color={colors.gold}
                />
              </View>
            </View>
          </BlurView>

          {/* ── Messages + Input ────────────────────────────────────────── */}
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <FlatList
              ref={listRef}
              data={conversation.messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                if (item.isLoading) {
                  // Render TypingIndicator inside the assistant bubble position
                  return <TypingIndicator />;
                }

                return (
                  <ChatBubble
                    role={item.role}
                    content={item.content}
                    // Pass the full Citation objects — ChatBubble uses surah + ayah
                    citations={item.citations?.map((c: Citation) => ({
                      surah: c.surah,
                      ayah: c.ayah,
                    }))}
                  />
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyStateCard}>
                    <View style={styles.emptyIconWrap}>
                      <MaterialCommunityIcons
                        name="star-crescent"
                        size={38}
                        color={colors.gold}
                      />
                    </View>
                    <Text style={styles.emptyTitle}>
                      {EMPTY_STATE_TEXT[mode]?.title ?? 'As-salamu alaykum!'}
                    </Text>
                    <Text style={styles.emptyBody}>
                      {EMPTY_STATE_TEXT[mode]?.body ?? 'How can I help you today?'}
                    </Text>
                  </View>
                </View>
              }
            />

            <ChatInput onSend={handleSend} disabled={isLoading} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
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
    opacity: 0.15,
  },

  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168,204,168,0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glass,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.goldGlowSoft,
  },
  headerText: { flex: 1 },
  headerTitle: {
    // Fixed: use DMSerifDisplay, not Fraunces-SemiBold (not in font stack)
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 16,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.sage600,
    fontSize: 11,
    marginTop: 2,
  },
  spiritualIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 18,
  },

  messageList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyStateCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...shadow.card,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.sage700,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.3)',
    ...shadow.goldGlowSoft,
  },
  emptyTitle: {
    ...typography.displayMedium,
    color: colors.sage800,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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