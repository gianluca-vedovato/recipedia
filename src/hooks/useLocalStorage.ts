import { useState, useCallback } from "react";

/**
 * Check if localStorage is available in the current environment
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__localStorage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create an in-memory storage fallback that mimics localStorage API
 */
function createMemoryStorage(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
  };
}

// Create the storage instance once
const storage: Storage = isLocalStorageAvailable()
  ? window.localStorage
  : createMemoryStorage();

/**
 Hook for using localStorage with React state synchronization and fallback support
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get value from storage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in both state and storage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        // Save to storage
        storage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from both state and storage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Lower-level hook that just provides the storage interface
 * Use this when you need direct access to storage methods
 */
export function useStorage() {
  return {
    storage,
    isAvailable: isLocalStorageAvailable(),
    getItem: (key: string) => {
      try {
        return storage.getItem(key);
      } catch (error) {
        console.warn(`Error getting storage item "${key}":`, error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        storage.setItem(key, value);
      } catch (error) {
        console.warn(`Error setting storage item "${key}":`, error);
      }
    },
    removeItem: (key: string) => {
      try {
        storage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing storage item "${key}":`, error);
      }
    },
    clear: () => {
      try {
        storage.clear();
      } catch (error) {
        console.warn("Error clearing storage:", error);
      }
    },
  };
}
