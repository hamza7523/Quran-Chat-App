import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/store/useAuthStore';
import {
  colors, typography, spacing, radius, shadow, gradients, blur as blurVal,
} from '@/lib/theme';

// ─── Islamic dot pattern background ──────────────────────────────────────────

function DotPattern() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[...Array(6)].map((_, row) =>
        [...Array(5)].map((_, col) => (
          <View
            key={`${row}-${col}`}
            style={[
              dotStyles.dot,
              {
                top: row * 90 + 40,
                left: col * 80 + 20,
                opacity: ((row + col) % 2 === 0) ? 0.07 : 0.035,
              },
            ]}
          />
        ))
      )}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
});

// ─── Reusable Input Field ─────────────────────────────────────────────────────

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'words';
};

function InputField({
  label, value, onChangeText, placeholder, icon,
  secureTextEntry = false, keyboardType = 'default', autoCapitalize = 'none',
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={inputStyles.wrapper}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.container, focused && inputStyles.containerFocused]}>
        <View style={inputStyles.iconWrap}>
          <Ionicons
            name={icon}
            size={16}
            color={focused ? colors.gold : colors.textTertiary}
          />
        </View>
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={8}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={16}
              color={colors.textTertiary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSage,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    ...shadow.glass,
  },
  containerFocused: {
    borderColor: colors.borderGold,
    backgroundColor: 'rgba(255,255,255,0.92)',
    // Matches the tab bar's bevel language — top-light, bottom-shadow
    borderTopColor: 'rgba(255,255,255,1)',
    borderBottomColor: 'rgba(201,168,76,0.35)',
  },
  iconWrap: { width: 20, alignItems: 'center' },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Tab = 'signin' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, isLoading, error, clearError } = useAuthStore();

  const [tab, setTab] = useState<Tab>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Animated tab indicator — same spring physics as the tab bar active bubble
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (next: Tab) => {
    clearError();
    setLocalError('');
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    Animated.spring(slideAnim, {
      toValue: next === 'signin' ? 0 : 1,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
    setTab(next);
  };

  const validate = (): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Enter a valid email address';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (tab === 'signup') {
      if (!name.trim()) return 'Name is required';
      if (password !== confirmPassword) return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async () => {
    setLocalError('');
    clearError();
    const validationError = validate();
    if (validationError) { setLocalError(validationError); return; }

    const success = tab === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, name);

    if (success) router.replace('/(tabs)');
  };

  const displayError = localError || error;

  // Slide indicator: 2% → 52% to match tab widths
  const indicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '52%'],
  });

  return (
    <LinearGradient colors={[...gradients.screenBg]} style={styles.root}>
      <DotPattern />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Logo / Hero ──────────────────────────────────────────── */}
{/* ── Logo / Hero ──────────────────────────────────────────── */}
            <View style={styles.heroSection}>
              {(() => {
                const content = {
                  signin: {
                    ayah: "سَلَامٌ عَلَيْكُم بِمَا صَبَرْتُمْ",
                    translation: '"Peace be upon you for what you patiently endured."\n— Surah Ar-Ra\'d [13:24]',
                    greeting: "Welcome Back",
                    icon: "home-variant-outline" as const
                  },
                  signup: {
                    ayah: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
                    translation: '"My Lord, increase me in knowledge."\n— Surah Taha [20:114]',
                    greeting: "Begin Your Journey",
                    icon: "star-crescent" as const
                  }
                };
                
                const activeContent = content[tab];

                return (
                  <>
                    {/* Logo bubble — 3D bevel style strictly maintained */}
                    <View style={styles.logoShadowWrap}>
                      <LinearGradient
                        colors={[colors.sage600, colors.sage800]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoBubble}
                      >
                        <MaterialCommunityIcons
                          name={activeContent.icon}
                          size={36}
                          color={colors.gold}
                        />
                      </LinearGradient>
                    </View>

                    <Text style={styles.appName}>{activeContent.greeting}</Text>
                    
                    {/* Your original tagline */}
                    <Text style={[styles.appTagline, { marginBottom: 8 }]}>
                      Wisdom from the Quran, always within reach
                    </Text>

                    {/* Dynamic Ayah with the lines */}
                    <View style={styles.bismillahRow}>
                      <View style={styles.bismillahLine} />
                      <Text style={styles.bismillah}>{activeContent.ayah}</Text>
                      <View style={styles.bismillahLine} />
                    </View>
                    
                    {/* Dynamic Translation */}
                    <Text style={[styles.appTagline, { fontStyle: 'italic', marginTop: 4, fontSize: 13 }]}>
                      {activeContent.translation}
                    </Text>
                  </>
                );
              })()}
            </View>
            {/* ── Auth Card ────────────────────────────────────────────── */}
            {/* BlurView frosted glass — consistent with tab bar background */}
            <BlurView intensity={blurVal.light} tint="light" style={styles.card}>

              {/* Tab switcher — mirrors the 3D tab bar pill aesthetic */}
              <View style={styles.tabSwitcher}>
                <Animated.View style={[styles.tabIndicator, { left: indicatorLeft }]} />
                <Pressable style={styles.tabBtn} onPress={() => switchTab('signin')}>
                  <Text style={[styles.tabText, tab === 'signin' && styles.tabTextActive]}>
                    Sign In
                  </Text>
                </Pressable>
                <Pressable style={styles.tabBtn} onPress={() => switchTab('signup')}>
                  <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <View style={styles.formArea}>
                {tab === 'signup' && (
                  <InputField
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    icon="person-outline"
                    autoCapitalize="words"
                  />
                )}

                <InputField
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  icon="mail-outline"
                  keyboardType="email-address"
                />

                <InputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Your password'}
                  icon="lock-closed-outline"
                  secureTextEntry
                />

                {tab === 'signup' && (
                  <InputField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    icon="lock-closed-outline"
                    secureTextEntry
                  />
                )}

                {/* Error box */}
                {displayError ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle-outline" size={15} color={colors.error} />
                    <Text style={styles.errorText}>{displayError}</Text>
                  </View>
                ) : null}

                {/* Submit — same gradient + bevel as active tab bubble */}
                <Pressable
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.submitWrap,
                    pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <View style={styles.submitShadowWrap}>
                    <LinearGradient
                      colors={[colors.sage600, colors.sage800]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.submitBtn}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color={colors.gold} />
                      ) : (
                        <>
                          <Text style={styles.submitText}>
                            {tab === 'signin' ? 'Sign In' : 'Create Account'}
                          </Text>
                          <Ionicons name="arrow-forward" size={16} color={colors.gold} />
                        </>
                      )}
                    </LinearGradient>
                  </View>
                </Pressable>

                {/* Switch hint */}
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>
                    {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  </Text>
                  <Pressable onPress={() => switchTab(tab === 'signin' ? 'signup' : 'signin')}>
                    <Text style={styles.switchLink}>
                      {tab === 'signin' ? 'Sign up' : 'Sign in'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </BlurView>

            <Text style={styles.disclaimer}>
              By continuing you agree to use this app in the spirit of learning and
              reflection. Always verify with a qualified scholar.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },

  // ── Hero ──
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  // Matches activeShadowWrap from tab layout exactly
  logoShadowWrap: {
    borderRadius: 28,
    shadowColor: colors.sage800,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: spacing.md,
    backgroundColor: '#FFF',
    padding: 4,
  },
  // Matches activeBubble but larger
  logoBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  appName: {
    ...typography.displayLarge,
    color: colors.textPrimary,
    fontSize: 30,
  },
  appTagline: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 22,
  },
  bismillahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
    width: '100%',
  },
  bismillahLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(168,204,168,0.45)',
  },
  bismillah: {
    fontFamily: 'Amiri-Regular',
    fontSize: 20,
    color: colors.textTertiary,
    lineHeight: 32,
  },

  // ── Card — mirrors tab bar pill with bevel borders ──
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    // Same bevel as tab bar
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,1)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
    // Same shadow as tab bar
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 14,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.lg,
  },

  // ── Tab switcher — same pill as the bottom tab bar ──
  tabSwitcher: {
    flexDirection: 'row',
    margin: spacing.md,
    backgroundColor: 'rgba(168,204,168,0.18)',
    borderRadius: radius.md,
    padding: 4,
    position: 'relative',
    height: 44,
  },
  tabIndicator: {
    position: 'absolute',
    width: '48%',
    top: 3,
    bottom: 3,
    borderRadius: radius.sm,
    // Same gradient bg as active tab bubble
    backgroundColor: colors.sage700,
    shadowColor: colors.sage800,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabText: {
    ...typography.button,
    fontSize: 14,
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: colors.textOnDark,
    fontFamily: 'DMSans-SemiBold',
  },

  // ── Form ──
  formArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },

  // ── Error ──
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(192,57,43,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.22)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    flex: 1,
  },

  // ── Submit — matches activeShadowWrap + activeBubble ──
  submitWrap: { marginBottom: spacing.md, marginTop: spacing.sm },
  submitShadowWrap: {
    borderRadius: radius.md,
    shadowColor: colors.sage800,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#FFF',
    padding: 3,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.sm + 1,
    // Inner bevel consistent with active tab bubble
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  submitText: {
    ...typography.button,
    color: colors.textOnDark,
    fontSize: 16,
  },

  // ── Switch hint ──
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  switchLabel: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  switchLink: {
    ...typography.bodySmall,
    fontFamily: 'DMSans-SemiBold',
    color: colors.sage600,
    textDecorationLine: 'underline',
  },

  // ── Disclaimer ──
  disclaimer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
});