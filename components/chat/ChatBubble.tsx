import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../lib/theme';

type ChatBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
  citations?: { surah: string; ayah: number }[];
};

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  // A much safer, bulletproof parser that simply splits by ANY brackets
  const renderContent = () => {
    if (!content) return null;
    
    // Splits by anything inside brackets without complex regex rules that might crash
    const parts = content.split(/(\[[^\]]+\])/g);

    return parts.map((part, index) => {
      // If the part is inside brackets, highlight it gold
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <Text key={index} style={styles.citationText}>
            {part}
          </Text>
        );
      }
      // Otherwise, render regular text
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={styles.aiAvatar}>
          <MaterialCommunityIcons name="star-four-points" size={16} color={colors.gold} />
        </View>
      )}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {/* ADDED fontFamily: undefined TO PREVENT ARABIC CHARACTER CRASHES */}
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
          {renderContent()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.sage800,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  userBubble: {
    backgroundColor: '#C59A45', 
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(168,204,168,0.3)',
    shadowColor: '#0A1E0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    ...typography.bodyMedium,
    fontFamily: undefined, // <--- CRITICAL FIX: Forces system font to handle all foreign glyphs safely
    lineHeight: 24,
    fontSize: 15,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: colors.sage800,
  },
  citationText: {
    color: '#B58D3D',
    fontWeight: 'bold',
  },
});