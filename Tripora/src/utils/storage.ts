import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Secure Storage (for tokens, sensitive data)
export const setSecureItem = async (key: string, value: string) => {
  try {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error securely storing ${key}:`, error);
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Error securely getting ${key}:`, error);
    return null;
  }
};

export const removeSecureItem = async (key: string) => {
  try {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error securely removing ${key}:`, error);
  }
};

// Async Storage (for preferences, theme, cached UI state)
export const setLocalItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error locally storing ${key}:`, error);
  }
};

export const getLocalItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error locally getting ${key}:`, error);
    return null;
  }
};

export const removeLocalItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error locally removing ${key}:`, error);
  }
};
