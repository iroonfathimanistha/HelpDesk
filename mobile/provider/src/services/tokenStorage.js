import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store has no web implementation, so the browser build falls back
// to localStorage. Native builds keep using the device's secure storage.
const isWeb = Platform.OS === 'web';

export async function getToken(key) {
  if (isWeb) return window.localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

export async function setToken(key, value) {
  if (isWeb) return window.localStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

export async function deleteToken(key) {
  if (isWeb) return window.localStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}
