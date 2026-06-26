import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';
import Animated, {
  FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withSpring,
  withTiming, interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GoldBadge from '../../components/ui/GoldBadge';
import { colors, typography, spacing, radius, shadow, blur as blurVal } from '../../lib/theme';

const SUGGESTED = [
  { label: 'Patience', icon: 'hourglass-outline' as const },
  { label: 'Trust in Allah', icon: 'shield-checkmark-outline' as const },
  { label: 'Gratitude', icon: 'heart-outline' as const },
  { label: 'Forgiveness', icon: 'flower-outline' as const },
  { label: 'Guidance', icon: 'compass-outline' as const },
  { label: 'Peace', icon: 'leaf-outline' as const },
];

const MOCK_RESULTS = [
  { id: '1', surah: 'Al-Baqarah', ayah: 155, arabic: 'وَبَشِّرِ الصَّابِرِينَ', text: 'And give good tidings to the patient.' },
  { id: '2', surah: 'At-Talaq', ayah: 3, arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', text: 'And whoever relies upon Allah — then He is sufficient for him.' },
  { id: '3', surah: "Ar-Ra'd", ayah: 28, arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', text: 'Unquestionably, in the remembrance of Allah hearts find rest.' },
];

function ResultCard({ item, index, onPress }: { item: typeof MOCK_RESULTS[0]; index: number; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(300).springify()}
      style={animStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.90)', 'rgba(248,252,248,0.80)']}
          style={[styles.resultCard, shadow.card]}
        >
          <View style={styles.resultArabicWrap}>
            <Text style={styles.resultArabic}>{item.arabic}</Text>
          </View>
          <View style={styles.resultDivider} />
          <Text style={styles.resultText}>{item.text}</Text>
          <View style={styles.resultFooter}>
            <GoldBadge label={`${item.surah} ${item.ayah}`} small />
            <Pressable style={styles.discussBtn} onPress={onPress}>
              <Text style={styles.discussText}>Discuss</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.gold} />
            </Pressable>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function SearchTab() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_RESULTS>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim().length > 1) {
      setResults(
        MOCK_RESULTS.filter(
          (r) =>
            r.text.toLowerCase().includes(text.toLowerCase()) ||
            r.surah.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  };

  const showSuggestions = results.length === 0 && query.length <= 1;

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader
        title="Search"
        subtitle="Discover verses by topic, keyword, or surah"
      />

      {/* Search bar */}
      <View style={[styles.searchOuter, shadow.glass]}>
        <BlurView intensity={blurVal.light} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[
          styles.searchBar,
          isFocused && styles.searchBarFocused,
        ]}>
          <View style={styles.searchIconWrap}>
            <Ionicons
              name={isFocused ? 'search' : 'search-outline'}
              size={18}
              color={isFocused ? colors.goldDeep : colors.textTertiary}
            />
          </View>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search the Qur'an..."
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch('')} hitSlop={8} style={styles.clearBtn}>
              <View style={styles.clearCircle}>
                <Ionicons name="close" size={12} color={colors.textSecondary} />
              </View>
            </Pressable>
          )}
        </View>
      </View>

      {showSuggestions ? (
        <>
          <SectionHeader title="Popular Topics" meta="Tap to search" />
          <View style={styles.chipGrid}>
            {SUGGESTED.map((topic, i) => (
              <Animated.View key={topic.label} entering={FadeInDown.delay(i * 40).duration(250)}>
                <Pressable
                  style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                  onPress={() => handleSearch(topic.label.split(' ')[0])}
                >
                  <Ionicons name={topic.icon} size={14} color={colors.sage500} />
                  <Text style={styles.chipText}>{topic.label}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </>
      ) : (
        <SectionHeader
          title={results.length > 0 ? 'Results' : 'No matches'}
          meta={results.length > 0 ? `${results.length} verses` : undefined}
        />
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        style={styles.resultsFlex}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          query.length > 1 ? (
            <Animated.View entering={FadeIn.duration(250)} style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={26} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyText}>No verses found for {query}</Text>
              <Text style={styles.emptyHint}>Try a different keyword or browse popular topics</Text>
            </Animated.View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <ResultCard
            item={item}
            index={index}
            onPress={() => router.push('/(tabs)/chat')}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Search
  searchOuter: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  searchBarFocused: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  searchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  clearBtn: { padding: 4 },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(168,204,168,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Topic chips
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(168,204,168,0.50)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadow.glass,
  },
  chipPressed: {
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderColor: colors.borderGold,
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Results
  resultsFlex: { flex: 1 },
  resultsList: { paddingBottom: 100, gap: spacing.md },
  resultCard: {
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.90)',
    overflow: 'hidden',
  },
  resultArabicWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultArabic: {
    fontFamily: 'Amiri-Regular',
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    writingDirection: 'rtl',
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(201,168,76,0.20)',
    marginVertical: spacing.xs,
  },
  resultText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  discussBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201,168,76,0.10)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
  },
  discussText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.gold,
  },

  // Empty
  emptyWrap: { alignItems: 'center', paddingTop: spacing.xxl, gap: spacing.sm },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    maxWidth: 260,
  },
});