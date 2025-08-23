import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Creates a token cache for the native platform
 * @returns a token cache object with getToken, saveToken and deleteToken methods
 */
const createTokenCache = (): {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  deleteToken: (key: string) => Promise<void>;
} => {
  return {
    /**
     * Gets a token from the cache
     * @param key - The key to get the token from
     * @returns the token or null if it doesn't exist
     */
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          // Cache hit - key was used
        } else {
          // Cache miss - no values stored under key
        }
        return item;
      } catch (error) {
        // Secure store get item error occurred
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    /**
     * Saves a token to the cache
     * @param key - The key to save the token to
     * @param token - The token to save
     */
    saveToken: (key: string, token: string) => {
      return SecureStore.setItemAsync(key, token);
    },
    /**
     * Deletes a token from the cache
     * @param key - The key to delete the token from
     */
    deleteToken: (key: string) => {
      return SecureStore.deleteItemAsync(key);
    },
  };
};

// SecureStore is not supported on the web and we use cookies instead
export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;