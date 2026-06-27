import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow, blur as blurIntensity } from '../../lib/theme';

type ChatInputProps = {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function ChatInput({
  onSend,
  placeholder = "Ask anything about the Qur'an...",
  disabled,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 12);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSend(trimmed);
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
        <View style={[styles.inputOuter, shadow.glass]}>
          <BlurView
            intensity={blurIntensity.light}
            tint="light"
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          />
          <View style={styles.inputRow}>
            <TextInput
          style={styles.input}
          placeholder="Ask anything about the Qur'an..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
          editable={!disabled}
          
          // ─── ADD THESE 3 LINES ───
          returnKeyType="send" 
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={handleSend}
          blurOnSubmit={false} // Keeps keyboard open after sending for rapid-fire chatting
          // ─────────────────────────
        />
            <Pressable
              onPress={handleSend}
              disabled={!text.trim() || disabled}
              style={({ pressed }) => [pressed && styles.sendPressed]}
            >
              <LinearGradient
                colors={text.trim() ? [colors.gold, colors.goldDeep] : [colors.sage200, colors.sage300]}
                style={styles.sendButton}
              >
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
        <Text style={styles.disclaimer}>
          Always verify with a qualified scholar · Not a fatwa service
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  inputOuter: {
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.40)',
    paddingLeft: spacing.md + 4,
    paddingRight: spacing.xs + 2,
    paddingVertical: spacing.xs + 2,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  disclaimer: {
    ...typography.caption,
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 11,
  },
});
