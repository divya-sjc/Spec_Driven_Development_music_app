import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    return false;
  }
}

export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
}

export async function getAllKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
}

export async function multiGet<T>(keys: string[]): Promise<Record<string, T>> {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, T> = {};
    for (const [key, value] of pairs) {
      if (value) {
        result[key] = JSON.parse(value);
      }
    }
    return result;
  } catch (error) {
    console.error('Error in multiGet:', error);
    return {};
  }
}

export async function multiSet<T>(items: [string, T][]): Promise<boolean> {
  try {
    const pairs: [string, string][] = items.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error in multiSet:', error);
    return false;
  }
}

export async function multiRemove(keys: string[]): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error in multiRemove:', error);
    return false;
  }
}

export async function clear(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}
