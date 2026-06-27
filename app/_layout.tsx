import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/lib/theme';

// ─── Font Loader ──────────────────────────────────────────────────────────────
// Only loads fonts that actually exist in assets/fonts/

function useFonts() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync({
      // Amiri — Arabic body text
      'Amiri-Regular':      require('../assets/fonts/Amiri-Regular.ttf'),
      'Amiri-Bold':         require('../assets/fonts/Amiri-Bold.ttf'),

      // Fraunces — display/heading font (replaces DM Serif Display)
      'Fraunces-Regular':   require('../assets/fonts/Fraunces_72pt-Regular.ttf'),
      'Fraunces-SemiBold':  require('../assets/fonts/Fraunces_72pt-SemiBold.ttf'),
      'Fraunces-Bold':      require('../assets/fonts/Fraunces_72pt-Bold.ttf'),

      // Inter — body/UI font (replaces DM Sans)
      'Inter-Regular':      require('../assets/fonts/Inter_18pt-Regular.ttf'),
      'Inter-Medium':       require('../assets/fonts/Inter_18pt-Medium.ttf'),
      'Inter-SemiBold':     require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
      'Inter-Bold':         require('../assets/fonts/Inter_18pt-Bold.ttf'),
    })
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true)); // Never block app if a font fails
  }, []);
  return loaded;
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.bgBase,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator size="large" color={colors.gold} />
    </View>
  );
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { session, setSession } = useAuthStore();
  const [initialising, setInitialising] = useState(true);

  // Stable ref — keeps setSession out of effect deps without stale closure
  const setSessionRef = useRef(setSession);
  setSessionRef.current = setSession;

  // Bootstrap: read persisted session once on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionRef.current(data.session);
      setInitialising(false);
    });

    // Keep session live for token refresh / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSessionRef.current(newSession);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // ✅ empty — setSession stable via ref

  // Redirect guard — only runs once session state is known
  useEffect(() => {
    if (initialising) return;

    const firstSegment = segments[0] as string | undefined;
    const inAuthRoute = firstSegment === 'auth';

    if (!session && !inAuthRoute) {
      router.replace('/auth' as never);
    } else if (session && inAuthRoute) {
      router.replace('/(tabs)' as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, segments, initialising]); // router intentionally omitted — causes loops

  if (initialising) return <LoadingScreen />;

  return <>{children}</>;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  const fontsLoaded = useFonts();
  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth"      options={{ animation: 'none', gestureEnabled: false }} />
        <Stack.Screen name="(tabs)"    options={{ animation: 'none' }} />
        <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
      <StatusBar style="dark" />
    </AuthGuard>
  );
}