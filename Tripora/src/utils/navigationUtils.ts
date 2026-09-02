import { Linking, Platform, Alert } from 'react-native';

export async function openNavigation(latitude: number, longitude: number, label: string) {
  const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
  const url = Platform.select({
    ios: `${scheme}?q=${label}&ll=${latitude},${longitude}`,
    android: `${scheme}0,0?q=${latitude},${longitude}(${label})`
  });
  
  try {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to browser Google Maps
        await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
      }
    }
  } catch (error) {
    Alert.alert('Navigation Error', 'Could not open maps application.');
  }
}
