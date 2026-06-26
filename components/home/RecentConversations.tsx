import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';
import { ListRow, Conversation } from '../ui/ListRow';
import { colors, typography, spacing, radius } from '../../lib/theme';

export type { Conversation };

type RecentConversationsProps = {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onSeeAll?: () => void;
  emptyMessage?: string;
};

function ConversationRow({
  item,
  index,
  onPress,
  isLast,
}: {
  item: Conversation;
  index: number;
  onPress: () => void;
  isLast: boolean;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    const delay = 480 + index * 80;
    opacity.value = withDelay(delay, withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={containerStyle}>
      <ListRow
        title={item.title}
        subtitle={item.lastMessagePreview}
        meta={item.updatedAt}
        icon="chatbubble-outline"
        onPress={onPress}
        bordered={!isLast}
      />
    </Animated.View>
  );
}

export default function RecentConversations({
  conversations,
  onSelect,
  onSeeAll,
  emptyMessage = 'Your conversations will appear here once you start chatting.',
}: RecentConversationsProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Recent Conversations"
        actionLabel={conversations.length > 0 ? 'See All' : undefined}
        onAction={conversations.length > 0 ? onSeeAll : undefined}
      />

      <GlassCard variant="sage">
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubbles-outline" size={22} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          conversations.map((item, index) => (
            <ConversationRow
              key={item.id}
              item={item}
              index={index}
              onPress={() => onSelect(item.id)}
              isLast={index === conversations.length - 1}
            />
          ))
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.xl },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
