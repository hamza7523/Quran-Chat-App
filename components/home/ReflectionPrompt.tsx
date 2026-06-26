import { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import SectionHeader from '../ui/SectionHeader';
import { useEngagementStore } from '../../store/useEngagementStore';
import { colors, typography, spacing, radius, surfaces } from '../../lib/theme';

export default function ReflectionPrompt() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const hasReflectedToday = useEngagementStore((s) => s.hasReflectedToday);
  const todayReflection = useEngagementStore((s) => s.todayReflection);
  const setReflection = useEngagementStore((s) => s.setReflection);

  const handleSave = () => {
    if (!text.trim()) return;
    setReflection(text.trim());
    setSaved(true);
  };

  if (hasReflectedToday && todayReflection) {
    return (
      <View style={styles.container}>
        <SectionHeader title="Today's Reflection" badge="Saved" />
        <GlassCard variant="white">
          <View style={styles.savedInner}>
            <View style={styles.savedIcon}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <Text style={styles.savedText}>{todayReflection}</Text>
          </View>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader title="Moment of Reflection" meta="Optional" />
      <GlassCard variant="white">
        <View style={styles.inner}>
          <Text style={styles.prompt}>
            How did today&apos;s ayah resonate with your heart?
          </Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Write a few words…"
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={280}
          />
          <View style={styles.footer}>
            <Text style={styles.charCount}>{text.length}/280</Text>
            <GlassButton
              label={saved ? 'Saved ✓' : 'Save Reflection'}
              onPress={handleSave}
              variant="gold"
              compact
              icon="heart-outline"
              disabled={!text.trim()}
            />
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg, marginTop: spacing.lg },
  inner: { padding: spacing.md },
  prompt: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    backgroundColor: surfaces.inputBg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm + 4,
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  savedInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
  },
  savedIcon: { marginTop: 2 },
  savedText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
