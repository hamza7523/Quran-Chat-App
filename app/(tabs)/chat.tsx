import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeInDown, useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '../../store/useChatStore';
import type { ChatMode } from '../../store/useChatStore';
import { colors, typography, spacing, radius, shadow, gradients } from '../../lib/theme';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { ListRow } from '../../components/ui/ListRow';

const MODES: {
  key: ChatMode;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: readonly [string, string];
  accentColor: string;
  ayahRef: string;
}[] = [
  {
    key: 'ask',
    title: "Ask About the Qur'an",
    subtitle: 'Explore meaning, tafsir & context',
    icon: 'book-outline',
    colors: [colors.sage600, colors.sage800] as const,
    accentColor: colors.sage500,
    ayahRef: 'Al-Fatiha 1:1',
  },
  {
    key: 'comfort',
    title: 'Find Comfort',
    subtitle: 'Verses for difficult moments',
    icon: 'heart-outline',
    colors: ['#8B5E3C', '#5C3A1E'] as const,
    accentColor: colors.gold,
    ayahRef: 'Al-Inshirah 94:5',
  },
  {
    key: 'dua',
    title: "Help Me Make Du'a",
    subtitle: 'Guided personal supplication',
    icon: 'hand-left-outline',
    colors: ['#2D5A8E', '#1A3A5C'] as const,
    accentColor: '#4A90D9',
    ayahRef: 'Al-Baqarah 2:186',
  },
];

function ModeCard({
  mode,
  index,
  onPress,
}: {
  mode: (typeof MODES)[0];
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(350).springify().damping(16)}
      style={animStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 300 }); }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.92)', 'rgba(248,252,248,0.82)']}
          style={[styles.modeCard, shadow.card]}
        >
          {/* Left accent stripe */}
          <LinearGradient
            colors={mode.colors}
            style={styles.modeStripe}
          />

          {/* Icon */}
          <LinearGradient
            colors={mode.colors}
            style={[styles.modeIconWrap]}
          >
            <Ionicons name={mode.icon} size={20} color="#FFFFFF" />
          </LinearGradient>

          {/* Text */}
          <View style={styles.modeTextWrap}>
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeSub}>{mode.subtitle}</Text>
            <View style={styles.modeRef}>
              <Text style={styles.modeRefText}>{mode.ayahRef}</Text>
            </View>
          </View>

          {/* Chevron */}
          <View style={[styles.modeChevron, { backgroundColor: `${mode.accentColor}18` }]}>
            <Ionicons name="chevron-forward" size={15} color={mode.accentColor} />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

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
        {MODES.map((mode, index) => (
          <ModeCard
            key={mode.key}
            mode={mode}
            index={index}
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
            <LinearGradient
              colors={[colors.sage700, colors.sage800]}
              style={styles.emptyIconWrap}
            >
              <View style={styles.crescentOuter} />
              <View style={styles.crescentInner} />
              <Text style={styles.emptyStar}>✦</Text>
            </LinearGradient>
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
  modesList: { gap: spacing.sm + 2, marginBottom: spacing.xl },

  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    paddingLeft: 0,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.90)',
  },
  modeStripe: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: 0,
  },
  modeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glass,
  },
  modeTextWrap: { flex: 1, gap: 3 },
  modeTitle: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  modeSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  modeRef: {
    marginTop: 3,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
  },
  modeRefText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.goldDeep,
  },
  modeChevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  crescentOuter: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.gold,
  },
  crescentInner: {
    position: 'absolute',
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: colors.sage700,
    top: 4,
    left: 12,
  },
  emptyStar: {
    position: 'absolute',
    top: 4,
    right: 6,
    fontSize: 10,
    color: colors.gold,
    lineHeight: 14,
  },
  emptyTitle: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  emptyBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 19,
  },
});