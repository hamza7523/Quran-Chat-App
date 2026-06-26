import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
import { colors, blur, shadow, typography } from '@/lib/theme';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  activeName: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  color: string;
};

function TabIcon({ name, activeName, label, focused, color }: TabIconProps) {
  return (
    <View style={tabStyles.iconWrap}>
      {focused && <View style={tabStyles.activePill} />}
      <Ionicons
        name={focused ? activeName : name}
        size={22}
        color={focused ? colors.sage600 : colors.textTertiary}
      />
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>
        {label}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    gap: 3,
    minWidth: 60,
  },
  activePill: {
    position: 'absolute',
    top: -4,
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.sage500,
  },
  label: {
    ...typography.label,
    fontSize: 10,
    letterSpacing: 0.5,
    color: colors.textTertiary,
  },
  labelActive: {
    color: colors.sage600,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios'
            ? 'rgba(255,255,255,0.0)'
            : 'rgba(240,248,240,0.96)',
          borderTopWidth: 0,
          height: 82,
          paddingBottom: 0,
          ...shadow.tabBar,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={blur.tabBar}
              tint="light"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(168,204,168,0.30)',
                  overflow: 'hidden',
                },
              ]}
            />
          ) : null,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home-outline" activeName="home" label="Home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="chatbubble-outline" activeName="chatbubble" label="Chat" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="search-outline" activeName="search" label="Search" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="person-outline" activeName="person" label="Profile" focused={focused} color={color} />
          ),
        }}
      />

      {/* Hide "two" route if it exists */}
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}