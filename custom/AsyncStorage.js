import AsyncStorage from '@react-native-async-storage/async-storage';

// Set value to AsyncStorage
// Store primitive values like numbers or strings directly
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value.toString()); // Convert to string if needed
  } catch (e) {
    console.error('Failed to save the data to the storage', e);
  }
};

// Retrieve data from storage
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : null; // Return as string or primitive
  } catch (e) {
    console.error('Failed to fetch the data from storage', e);
  }
};

// Remove value from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove the data from storage', e);
  }
};
