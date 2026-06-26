import { StyleSheet, ViewStyle, StyleProp, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, spacing } from '../../lib/theme';
import StarPattern from './StarPattern';

type ScreenContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Extra bottom padding to clear the floating tab bar */
  tabBarInset?: boolean;
};

export default function ScreenContainer({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  tabBarInset = true,
}: ScreenContainerProps) {
  const bottomPad = tabBarInset ? 100 : spacing.xxl;

  return (
    <LinearGradient
      colors={[...gradients.sageBg]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradient}
    >
      <StarPattern />
      <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingBottom: bottomPad }, contentContainerStyle]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, { paddingBottom: bottomPad, flex: 1 }, contentContainerStyle]}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: spacing.lg },
});
