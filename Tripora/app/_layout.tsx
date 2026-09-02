import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { ConfirmationProvider } from '../src/hooks/useConfirmation';
import ToastContainer from '../src/components/Toast';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutContent() {
  const { isDark, colors } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'index' || segments[0] === 'signup';
    
    // Root index resolves empty array usually, or 'index'
    const isRootOrAuth = inAuthGroup || !segments[0];

    if (!isAuthenticated && !isRootOrAuth) {
      router.replace('/');
    } else if (isAuthenticated && isRootOrAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="(tabs)" options={{ title: 'App' }} />
        {/* Declare the trips module once to stop extraneous warnings */}
        <Stack.Screen name="trips" options={{ headerShown: false }} />
        <Stack.Screen name="city-search" options={{ presentation: 'modal' }} />
        <Stack.Screen name="activity-search" options={{ presentation: 'modal' }} />
        <Stack.Screen name="share/[code]" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="camera" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      </Stack>
      <ToastContainer />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConfirmationProvider>
          <RootLayoutContent />
        </ConfirmationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
