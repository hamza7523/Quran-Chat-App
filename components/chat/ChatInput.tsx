import { useState, useRef } from 'react';
import {
  View, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, Text,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, interpolateColor,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadow, blur as blurIntensity } from '../../lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 12);

  // Animations
  const sendScale = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const focusProgress = useSharedValue(0);

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Button pop animation
    sendScale.value = withSpring(0.85, { damping: 8, stiffness: 400 }, () => {
      sendScale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });

    onSend(text.trim());
    setText('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: 200 });
    containerScale.value = withSpring(1.01, { damping: 15, stiffness: 300 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: 200 });
    containerScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const sendBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      ['rgba(168,204,168,0.40)', 'rgba(201,168,76,0.55)']
    ),
  }));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
        <Animated.View style={[styles.inputOuter, shadow.glass, containerStyle]}>
          {/* Blur background */}
          <BlurView
            intensity={blurIntensity.medium}
            tint="light"
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          />
          {/* Animated border overlay */}
          <Animated.View style={[styles.borderOverlay, borderStyle]} />

          <View style={styles.inputRow}>
            {/* Mic / decorative left icon */}
            <View style={styles.leftIcon}>
              <Ionicons
                name={isFocused ? 'chevron-forward' : 'mic-outline'}
                size={18}
                color={isFocused ? colors.gold : colors.textTertiary}
              />
            </View>

            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={2000}
              editable={!disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              returnKeyType="default"
              scrollEnabled={text.length > 100}
            />

            {/* Send button */}
            <AnimatedPressable
              onPress={handleSend}
              disabled={!canSend}
              style={[sendBtnStyle]}
            >
              <LinearGradient
                colors={canSend
                  ? [colors.gold, colors.goldDeep]
                  : ['rgba(168,204,168,0.40)', 'rgba(122,174,122,0.30)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
              >
                <Ionicons
                  name="arrow-up"
                  size={18}
                  color={canSend ? '#FFFFFF' : colors.textTertiary}
                />
              </LinearGradient>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <Text style={styles.disclaimer}>
          Always verify with a qualified scholar · Not a fatwa service
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  inputOuter: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 58,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    pointerEvents: 'none',
  } as any,
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs + 2,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    minHeight: 58,
    borderRadius: radius.xl,
  },
  leftIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    maxHeight: 120,
    paddingVertical: spacing.sm,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    lineHeight: 22,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs + 2,
    letterSpacing: 0.2,
  },
});