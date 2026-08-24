import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
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
    </>
  );
}
