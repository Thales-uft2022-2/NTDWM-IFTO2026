import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_CACHE_KEY = '@grupo34:users:v1';

export async function saveUsersLocally(users) {
  await AsyncStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
}

export async function getUsersLocally() {
  const raw = await AsyncStorage.getItem(USERS_CACHE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearUsersLocally() {
  await AsyncStorage.removeItem(USERS_CACHE_KEY);
}
