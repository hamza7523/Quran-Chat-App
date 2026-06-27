import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, ActivityIndicator, Keyboard, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenContainer from '../../components/ui/ScreenContainer';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import GoldBadge from '../../components/ui/GoldBadge';

import { useChatStore } from '../../store/useChatStore';
import { searchQuran, SearchResult } from '../../lib/quranApi';
import { colors, typography, spacing, radius } from '../../lib/theme';

// Expanded and categorized suggested topics
const SUGGESTED_TOPICS = [
  { label: 'Patience (Sabr)', query: 'patient' },
  { label: 'Peace of Mind', query: 'peace' },
  { label: 'Forgiveness', query: 'forgive' },
  { label: 'Mercy', query: 'mercy' },
  { label: 'Trust in Allah', query: 'rely' },
  { label: 'Hardship', query: 'hardship' },
  { label: 'Parents', query: 'parents' },
  { label: 'Guidance', query: 'guide' },
];

export default function SearchTab() {
  const router = useRouter();
  const createConversation = useChatStore((s) => s.createConversation);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (text: string) => {
    const searchTerm = text.trim();
    if (searchTerm.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    Keyboard.dismiss();
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const res = await searchQuran(searchTerm);
      setResults(res);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    Keyboard.dismiss();
  };

  const handleDiscuss = async (verse: SearchResult) => {
    const convId = createConversation('ask');
    const prompt = `Can you explain this verse to me and share its context? [${verse.reference}]: "${verse.englishText}"`;
    await sendMessage(convId, prompt);
    router.push(`/chat/${convId}`);
  };

  const showSuggestions = !hasSearched && query.length <= 1;

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader
        title="Search"
        subtitle="Discover verses by topic, keyword, or surah name"
      />

      {/* ─── 3D SEARCH BAR ─── */}
      <View style={styles.searchWrapper}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)']}
          style={styles.searchInner}
        >
          <View style={styles.searchIconWrap}>
            {/* Custom 3D Search Icon */}
            <Image 
              source={require('../../assets/images/search.png')} 
              style={styles.searchImage} 
            />
          </View>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search the Qur'an..."
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
            onSubmitEditing={() => performSearch(query)}
          />
          {query.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={8} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </Pressable>
          )}
        </LinearGradient>
      </View>

      {showSuggestions ? (
        <>
          {/* ─── IQRA HERO SECTION ─── */}
          <View style={styles.iqraContainer}>
            <Image 
              source={require('../../assets/images/iqra.png')} 
              style={styles.iqraImage} 
            />
            <Text style={styles.iqraText}>Read. Explore. Discover.</Text>
          </View>

          <SectionHeader title="Popular Topics" meta="Tap to search" />
          <View style={styles.chipGrid}>
            {SUGGESTED_TOPICS.map((topic) => (
              <Pressable
                key={topic.label}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => {
                  setQuery(topic.label);
                  performSearch(topic.query);
                }}
              >
                <Text style={styles.chipText}>{topic.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <SectionHeader
          title={isSearching ? 'Searching...' : results.length > 0 ? 'Results' : 'No matches'}
          badge={results.length > 0 ? `${results.length} verses` : undefined}
        />
      )}

      {isSearching ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Searching Al-Quran Cloud...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.reference}
          style={styles.resultsFlex}
          // Extra padding at the bottom so the floating footer doesn't cover results
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            hasSearched && !isSearching ? (
              // ─── 3D EMPTY FOLDER STATE ───
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconGlow}>
                  <Image 
                    source={require('../../assets/images/empty-folder.png')} 
                    style={styles.emptyFolderImage} 
                  />
                </View>
                <Text style={styles.emptyText}>No verses found for {query}</Text>
                <Text style={styles.emptyHint}>Try a different keyword or browse popular topics</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            // ─── 3D RESULT CARDS ───
            <Pressable onPress={() => handleDiscuss(item)} style={styles.resultCardWrapper}>
              <LinearGradient 
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']} 
                style={styles.resultInner}
              >
                <View style={styles.cardHeader}>
                  <GoldBadge label={item.reference} small />
                </View>
                
                {item.arabicText ? (
                   <Text style={styles.resultArabic}>{item.arabicText}</Text>
                ) : null}
                
                <Text style={styles.resultText}>{item.englishText}</Text>
                
                <View style={styles.resultAction}>
                  <Text style={styles.resultActionText}>Discuss this verse</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.goldDeep} />
                </View>
              </LinearGradient>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  /* ─── 3D SEARCH BAR ─── */
  searchWrapper: {
    marginBottom: spacing.xl,
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    borderRadius: radius.xl,
    // 3D Bevel Edge
    borderTopWidth: 2,
    borderTopColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    fontSize: 16,
  },
  clearBtn: { padding: 4 },

  /* ─── IQRA HERO ─── */
  iqraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
  },
  iqraImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: spacing.sm,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iqraText: {
    ...typography.label,
    color: colors.sage600,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ─── CHIPS ─── */
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipPressed: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderColor: colors.borderGold,
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    ...typography.bodySmall,
    fontFamily: 'DMSans-Medium',
    color: colors.textSecondary,
  },

  /* ─── RESULTS & LIST ─── */
  resultsFlex: { flex: 1 },
  resultsList: {
    paddingBottom: 130, // Keeps it above the floating footer!
    gap: spacing.md,
  },
  resultCardWrapper: {
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  resultInner: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderTopWidth: 2,
    borderTopColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.xs,
  },
  resultArabic: {
    ...typography.arabicBody,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.xs,
    fontSize: 24,
    lineHeight: 40,
  },
  resultText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  resultAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(201,168,76,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  resultActionText: {
    ...typography.bodySmall,
    fontFamily: 'DMSans-SemiBold',
    color: colors.goldDeep,
  },

  /* ─── EMPTY STATE ─── */
  emptyWrap: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  emptyIconGlow: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  emptyFolderImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  emptyText: {
    ...typography.bodyMedium,
    fontFamily: 'DMSans-SemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 18,
  },
  emptyHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  }
});