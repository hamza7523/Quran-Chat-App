import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GoldBadge from '../../components/ui/GoldBadge';
import { colors, typography, spacing, radius } from '../../lib/theme';

const SUGGESTED = [
  'Patience in hardship',
  'Trust in Allah',
  'Gratitude',
  'Forgiveness',
  'Guidance',
  'Peace of mind',
];

const MOCK_RESULTS = [
  { id: '1', surah: 'Al-Baqarah', ayah: 155, text: 'And give good tidings to the patient.' },
  { id: '2', surah: 'At-Talaq', ayah: 3, text: 'And whoever relies upon Allah — then He is sufficient for him.' },
  { id: '3', surah: "Ar-Ra'd", ayah: 28, text: 'Unquestionably, in the remembrance of Allah hearts find rest.' },
];

export default function SearchTab() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_RESULTS>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim().length > 1) {
      setResults(
        MOCK_RESULTS.filter(
          (r) =>
            r.text.toLowerCase().includes(text.toLowerCase()) ||
            r.surah.toLowerCase().includes(text.toLowerCase()),
        ),
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
        subtitle="Discover verses by topic, keyword, or surah name"
      />

      <GlassCard variant="white" style={styles.searchOuter}>
        <View style={styles.searchBar}>
          <View style={styles.searchIconWrap}>
            <Ionicons name="search" size={18} color={colors.goldDeep} />
          </View>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search the Qur'an..."
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch('')} hitSlop={8} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </GlassCard>

      {showSuggestions ? (
        <>
          <SectionHeader title="Popular Topics" meta="Tap to search" />
          <View style={styles.chipGrid}>
            {SUGGESTED.map((topic) => (
              <Pressable
                key={topic}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => handleSearch(topic.split(' ')[0])}
              >
                <Text style={styles.chipText}>{topic}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <SectionHeader
          title={results.length > 0 ? 'Results' : 'No matches'}
          badge={results.length > 0 ? `${results.length} verses` : undefined}
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
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search-outline" size={28} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyText}>No verses found for &ldquo;{query}&rdquo;</Text>
              <Text style={styles.emptyHint}>Try a different keyword or browse popular topics</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push('/(tabs)/chat')}>
            <GlassCard variant="sage" style={styles.resultCard}>
              <View style={styles.resultInner}>
                <GoldBadge label={`${item.surah} ${item.ayah}`} small />
                <Text style={styles.resultText}>&ldquo;{item.text}&rdquo;</Text>
                <View style={styles.resultAction}>
                  <Text style={styles.resultActionText}>Discuss this verse</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.gold} />
                </View>
              </View>
            </GlassCard>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchOuter: { marginBottom: spacing.lg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  searchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,168,76,0.14)',
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  clearBtn: { padding: 4 },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipPressed: {
    backgroundColor: 'rgba(201,168,76,0.14)',
    borderColor: colors.borderGold,
  },
  chipText: {
    ...typography.bodySmall,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
  },
  resultsFlex: { flex: 1 },
  resultsList: {
    paddingBottom: 100,
    gap: spacing.sm,
  },
  resultCard: { marginBottom: spacing.sm },
  resultInner: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  resultText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 23,
  },
  resultAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  resultActionText: {
    ...typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
    color: colors.gold,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyHint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    maxWidth: 260,
  },
});
