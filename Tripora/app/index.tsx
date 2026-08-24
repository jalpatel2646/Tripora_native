import { Redirect } from 'expo-router';

export default function Index() {
  // Bypassing the entire login screen to send users directly into the app
  return <Redirect href="/(tabs)" />;
}
