import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import GlassCard from './GlassCard';
import { colors } from '../../lib/theme';

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  accessibilityLabel?: string;
};

export default function IconButton({
  icon,
  onPress,
  size = 20,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <GlassCard variant="white" style={styles.button}>
        <View style={styles.inner}>
          <Ionicons name={icon} size={size} color={colors.sage600} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  inner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
