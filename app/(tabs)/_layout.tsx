import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { HapticTab } from '@/components/haptic-tab'; // Update path if necessary
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/lib/theme';    // Update path if necessary

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  activeName: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
};

function TabIcon({ name, activeName, label, focused }: TabIconProps) {
  if (focused) {
    return (
      <View style={tabStyles.activeContainer}>
        {/* ─── 3D GLOWING BUBBLE FOR ACTIVE TAB ─── */}
        <View style={tabStyles.activeShadowWrap}>
          <LinearGradient
            colors={[colors.sage600, colors.sage800]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tabStyles.activeBubble}
          >
            <Ionicons name={activeName} size={22} color={colors.gold} />
          </LinearGradient>
        </View>
        <Text style={tabStyles.labelActive}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={tabStyles.inactiveContainer}>
      {/* ─── RECESSED INACTIVE TAB ─── */}
      <Ionicons name={name} size={22} color={colors.textTertiary} />
      <Text style={tabStyles.label}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          height: 76, // Slightly taller to house the 3D buttons
          borderRadius: 38,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.45)' : 'rgba(240,248,240,0.96)',
          
          // ─── 3D PILL BEVEL ───
          borderTopWidth: 2,
          borderTopColor: 'rgba(255,255,255,1)',
          borderLeftWidth: 1,
          borderLeftColor: 'rgba(255,255,255,0.7)',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0,0,0,0.08)',
          borderRightWidth: 1,
          borderRightColor: 'rgba(0,0,0,0.08)',
          
          // ─── MASSIVE OUTER SHADOW ───
          shadowColor: '#0A1E0C',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          elevation: 16,
          paddingBottom: 0, // Prevents elements from squishing on Android
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="light"
              style={[StyleSheet.absoluteFill, { borderRadius: 38, overflow: 'hidden' }]}
            />
          ) : null,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ tabBarIcon: (p) => <TabIcon name="home-outline" activeName="home" label="HOME" {...p} /> }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ tabBarIcon: (p) => <TabIcon name="chatbubble-outline" activeName="chatbubble" label="CHAT" {...p} /> }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{ tabBarIcon: (p) => <TabIcon name="search-outline" activeName="search" label="SEARCH" {...p} /> }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ tabBarIcon: (p) => <TabIcon name="person-outline" activeName="person" label="PROFILE" {...p} /> }} 
      />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  /* ─── ACTIVE STATE STYLES ─── */
  activeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -8, // Lifts the active tab physically higher than the others
    width: 65,
  },
  activeShadowWrap: {
    borderRadius: 24,
    shadowColor: colors.sage800,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 4,
    backgroundColor: '#FFF', // Creates a crisp white ring around the bubble
    padding: 3,
  },
  activeBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    // Inner 3D Glass Bevel on the colored bubble
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  labelActive: {
    ...typography.label,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.sage800,
    fontWeight: '800',
  },

  /* ─── INACTIVE STATE STYLES ─── */
  inactiveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 4, // Pushes inactive tabs down slightly
    width: 60,
    opacity: 0.7, // Dims them out so the active tab pops more
  },
  label: {
    ...typography.label,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textTertiary,
    marginTop: 4,
    fontWeight: '600',
  },
});