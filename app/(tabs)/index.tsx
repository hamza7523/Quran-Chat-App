import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '../../store/useChatStore';
import { fetchDailyAyah, DailyAyah } from '../../lib/quranApi';
import { colors, typography, spacing, radius, shadow, gradients } from '../../lib/theme';
import type { ChatMode } from '../../store/useChatStore';

// ─── UPDATED TO USE YOUR CUSTOM PNGs ───
const MODES: {
  key: ChatMode;
  title: string;
  subtitle: string;
  image: any;
  accentColor: string;
}[] = [
  {
    key: 'ask',
    title: "Ask About the Qur'an",
    subtitle: 'Explore meaning, context & tafsir',
    image: require('../../assets/images/koran.png'),
    accentColor: colors.sage500,
  },
  {
    key: 'comfort',
    title: 'Find Comfort',
    subtitle: 'Verses for difficult moments',
    image: require('../../assets/images/prayer.png'),
    accentColor: colors.gold,
  },
  {
    key: 'dua',
    title: "Make Du'a",
    subtitle: 'Guided personal supplication',
    image: require('../../assets/images/islamic.png'),
    accentColor: colors.goldDeep,
  },
];

// Islamic crescent + star SVG-style drawn with Views
function CrescentStar({ size = 28, color = colors.gold }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: size * 0.12, borderColor: color,
      }} />
      <View style={{
        position: 'absolute', width: size * 0.72, height: size * 0.72,
        borderRadius: size * 0.36, backgroundColor: colors.sage700,
        top: size * 0.04, left: size * 0.22,
      }} />
      <Text style={{
        position: 'absolute', top: size * 0.04, right: size * 0.04,
        fontSize: size * 0.28, color, lineHeight: size * 0.32,
      }}>✦</Text>
    </View>
  );
}

// Islamic geometric ornament
function GeometricOrnament() {
  return (
    <View style={ornStyles.container} pointerEvents="none">
      {[...Array(5)].map((_, row) =>
        [...Array(8)].map((_, col) => (
          <View
            key={`${row}-${col}`}
            style={[ornStyles.dot, {
              top: row * 44 + 20,
              left: col * 44 + 10,
              opacity: ((row + col) % 3 === 0) ? 0.06 : 0.03,
            }]}
          />
        ))
      )}
    </View>
  );
}

const ornStyles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject as any, overflow: 'hidden' },
  dot: { position: 'absolute', width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.gold },
});

export default function HomeScreen() {
  const router = useRouter();
  const createConversation = useChatStore((s) => s.createConversation);
  
  // Dynamic Welcome Logic
  const conversations = useChatStore((s) => s.conversations);
  const isNewUser = !conversations || conversations.length === 0;
  const greetingText = isNewUser ? 'WELCOME' : 'WELCOME BACK';
  
  const [dailyAyah, setDailyAyah] = useState<DailyAyah | null>(null);
  const [loadingAyah, setLoadingAyah] = useState(true);

  useEffect(() => {
    fetchDailyAyah()
      .then(setDailyAyah)
      .catch(console.error)
      .finally(() => setLoadingAyah(false));
  }, []);

  const handleMode = (mode: ChatMode) => {
    const id = createConversation(mode);
    router.push(`/chat/${id}`);
  };

  return (
    <LinearGradient colors={['#E8F0E8', '#D4E8D4', '#ECF4EC']} style={styles.root}>
      <GeometricOrnament />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header - Fixed Typography & Arrangement */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.welcomeLabel}>{greetingText}</Text>
              <Text style={styles.appTitle}>Quran Chat</Text>
            </View>
            <Pressable style={styles.profileBtn} onPress={() => router.push('/profile')}>
              {/* ─── ADDED MALE PROFILE ICON HERE ─── */}
              {/* Note: If you ever want to swap this dynamically, you can require 'moslem-woman.png' here */}
              <Image 
                source={require('../../assets/images/arab-man.png')} 
                style={styles.profileAvatar} 
              />
            </Pressable>
          </View>

          {/* Daily Ayah Hero - Added 3D Shadow Wrapper */}
          <View style={styles.heroWrapper}>
            <LinearGradient
              colors={[colors.sage700, colors.sage800, '#0A1E0C']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.heroCardInner}
            >
              {[...Array(12)].map((_, i) => (
                <View key={i} style={[styles.heroDot, {
                  top: `${15 + (i % 4) * 22}%` as any, left: `${(i / 12) * 100}%` as any,
                  opacity: 0.06 + (i % 3) * 0.02,
                }]} />
              ))}

              <View style={styles.heroTopRow}>
                <CrescentStar size={22} color={colors.goldMuted} />
                <Text style={styles.heroEyebrow}>AYAH OF THE DAY</Text>
                <View style={styles.todayPill}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
              </View>

              {loadingAyah ? (
                 <ActivityIndicator color={colors.gold} style={{ marginVertical: spacing.xl }} />
              ) : (
                <>
                  <Text style={styles.heroArabic}>
                    {dailyAyah ? dailyAyah.arabicText : 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ'}
                  </Text>

                  <View style={styles.heroDivider}>
                    <View style={styles.heroDividerLine} />
                    <Text style={styles.heroDividerStar}>✦</Text>
                    <View style={styles.heroDividerLine} />
                  </View>

                  <Text style={styles.heroTranslation}>
                    {dailyAyah ? `"${dailyAyah.englishText}"` : 'All praise is due to Allah, Lord of all the worlds...'}
                  </Text>

                  <View style={styles.heroFooter}>
                    <View style={styles.heroRef}>
                      <Text style={styles.heroRefText}>
                        {dailyAyah ? dailyAyah.reference : 'Al-Fatiha 1:2'}
                      </Text>
                    </View>
                    <Pressable
                      style={({ pressed }) => [styles.reflectBtn, pressed && { opacity: 0.8 }]}
                      onPress={() => handleMode('ask')}
                    >
                      <Text style={styles.reflectText}>Reflect →</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </LinearGradient>
          </View>

          {/* Mode Cards */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Start a Conversation</Text>
          </View>

          <View style={styles.modeList}>
            {MODES.map((mode) => (
              <Pressable
                key={mode.key}
                onPress={() => handleMode(mode.key)}
                style={({ pressed }) => [styles.modeCard, pressed && styles.modeCardPressed]}
              >
                {/* 3D Glass Inner Wrapper */}
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)']}
                  style={styles.modeCardInner}
                >
                  <View style={[styles.modeIconWrap, { backgroundColor: `${mode.accentColor}18` }]}>
                    {/* ─── ADDED CUSTOM MODE ICONS HERE ─── */}
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

          {/* Bismillah footer ornament */}
          <View style={styles.bottomOrnament}>
            <View style={styles.ornLine} />
            <Text style={styles.ornArabic}>بِسْمِ اللَّهِ</Text>
            <View style={styles.ornLine} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 120 },

  /* ─── ENHANCED HEADER ─── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerTextWrap: {
    flex: 1,
  },
  welcomeLabel: {
    ...typography.label,
    color: colors.sage600,
    letterSpacing: 2.5,
    marginBottom: 4,
    fontWeight: '700',
  },
  appTitle: {
    ...typography.displayLarge,
    color: colors.sage800,
    fontSize: 30,
  },
  profileBtn: {
    width: 48, // Slightly larger to accommodate the beautiful profile art
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden', // Ensures the image respects the border radius
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  /* ─── 3D HERO CARD ─── */
  heroWrapper: {
    marginBottom: spacing.xl,
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  heroCardInner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  heroEyebrow: {
    ...typography.label,
    color: colors.goldMuted,
    letterSpacing: 2,
    flex: 1,
  },
  todayPill: {
    backgroundColor: 'rgba(201,168,76,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  todayText: {
    ...typography.label,
    color: colors.goldMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  heroArabic: {
    ...typography.arabicHero,
    color: colors.textOnDark,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 54,
    marginBottom: spacing.md,
  },
  heroDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  heroDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(201,168,76,0.30)',
  },
  heroDividerStar: {
    color: colors.gold,
    fontSize: 10,
  },
  heroTranslation: {
    ...typography.bodyMedium,
    color: 'rgba(244,248,244,0.82)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroRef: {
    backgroundColor: 'rgba(201,168,76,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.40)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  heroRefText: {
    ...typography.label,
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  reflectBtn: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  reflectText: {
    ...typography.label,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    letterSpacing: 0.5,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
    fontSize: 18,
  },

  /* ─── 3D MODE CARDS ─── */
  modeList: { gap: spacing.sm + 4, marginBottom: spacing.xl },
  modeCard: {
    borderRadius: radius.md,
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6, 
  },
  modeCardPressed: { opacity: 0.95, transform: [{ scale: 0.98 }] },
  modeCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 4,
    gap: spacing.md,
    borderRadius: radius.md,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
  },
  modeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  modeText: { flex: 1 },
  modeTitle: {
    ...typography.displaySmall,
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 2,
  },
  modeSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  modeChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(168,204,168,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  ornLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(168,204,168,0.40)',
  },
  ornArabic: {
    fontFamily: 'Amiri-Regular',
    fontSize: 18,
    color: colors.textTertiary,
    lineHeight: 28,
  },
});