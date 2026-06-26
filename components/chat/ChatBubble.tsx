import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../../lib/theme';
import AyahCitationChip from './AyahCitationChip';

type ChatBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
  citations?: { surah: string; ayah: number }[];
};

export default function ChatBubble({ role, content, citations }: ChatBubbleProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <LinearGradient
          colors={[colors.gold, colors.goldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.userBubble, shadow.goldGlowSoft]}
        >
          <Text style={styles.userText}>{content}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.aiRow}>
      <View style={styles.avatar}>
        <Ionicons name="sparkles" size={14} color={colors.gold} />
      </View>
      <View style={[styles.aiBubble, shadow.card]}>
        <Text style={styles.aiText}>{content}</Text>
        {citations && citations.length > 0 && (
          <View style={styles.citations}>
            {citations.map((c, i) => (
              <AyahCitationChip key={i} surah={c.surah} ayah={c.ayah} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
    paddingLeft: spacing.xxl,
  },
  userBubble: {
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
    maxWidth: '85%',
  },
  userText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingRight: spacing.xl,
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.sage700,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: colors.bubbleAI,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
  },
  aiText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  citations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
