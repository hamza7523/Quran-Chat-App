import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, shadow, spacing, blur as blurIntensity } from '../../lib/theme';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index:   { active: 'home', inactive: 'home-outline' },
  chat:    { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  search:  { active: 'search', inactive: 'search-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  chat: 'Chat',
  search: 'Search',
  profile: 'Profile',
};

export default function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);
  const visibleRoutes = state.routes.filter((r) => r.name !== 'two');

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      <View style={[styles.barOuter, shadow.tabBar]}>
        <BlurView
          intensity={blurIntensity.tabBar}
          tint="light"
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        />
        <View style={styles.barOverlay}>
          {visibleRoutes.map((route) => {
            const index = state.routes.indexOf(route);
            const isFocused = state.index === index;
            const icons = TAB_ICONS[route.name] ?? TAB_ICONS.index;
            const label = TAB_LABELS[route.name] ?? route.name;

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tab}
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
              >
                <View style={[styles.tabInner, isFocused && styles.tabInnerActive]}>
                  <Ionicons
                    name={isFocused ? icons.active : icons.inactive}
                    size={20}
                    color={isFocused ? colors.goldDeep : colors.sage500}
                  />
                  <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  barOuter: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  barOverlay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.50)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    minWidth: 64,
  },
  tabInnerActive: {
    backgroundColor: 'rgba(201,168,76,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.28)',
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.goldDeep,
    fontFamily: fonts.bodySemiBold,
  },
});
