import { ApiResponse, LoadingState } from './types';

// Generic data loading hook state
export interface UseDataState<T> extends LoadingState {
  data: T | null;
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
}

// Error handling utilities
export class DataServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'DataServiceError';
  }
}

// Retry mechanism with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw new DataServiceError(
          `Failed after ${maxAttempts} attempts: ${lastError.message}`,
          'MAX_RETRIES_EXCEEDED'
        );
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Generic API wrapper with error handling
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  errorMessage: string = 'Failed to fetch data'
): Promise<ApiResponse<T>> {
  try {
    const data = await withRetry(apiFunction);
    return {
      data,
      success: true,
      message: 'Data fetched successfully'
    };
  } catch (error) {
    const err = error as Error;
    return {
      data: null as T,
      success: false,
      error: err.message,
      message: errorMessage
    };
  }
}

// Loading state manager
export class LoadingStateManager {
  private states = new Map<string, LoadingState>();
  private listeners = new Map<string, Set<(state: LoadingState) => void>>();

  setLoading(key: string, isLoading: boolean, error?: string): void {
    const currentState = this.states.get(key) || { isLoading: false };
    const newState: LoadingState = {
      ...currentState,
      isLoading,
      error,
      lastUpdated: new Date()
    };
    
    this.states.set(key, newState);
    this.notifyListeners(key, newState);
  }

  setError(key: string, error: string): void {
    this.setLoading(key, false, error);
  }

  clearError(key: string): void {
    const currentState = this.states.get(key);
    if (currentState) {
      const newState = { ...currentState, error: undefined };
      this.states.set(key, newState);
      this.notifyListeners(key, newState);
    }
  }

  getState(key: string): LoadingState {
    return this.states.get(key) || { isLoading: false };
  }

  subscribe(key: string, listener: (state: LoadingState) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notifyListeners(key: string, state: LoadingState): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => listener(state));
    }
  }
}

// Global loading state manager instance
export const loadingStateManager = new LoadingStateManager();

// Utility functions for common loading patterns
export function createDataLoader<T>(
  key: string,
  fetchFunction: () => Promise<T>
) {
  return {
    async load(): Promise<ApiResponse<T>> {
      loadingStateManager.setLoading(key, true);
      
      try {
        const result = await apiCall(fetchFunction, `Failed to load ${key}`);
        
        if (result.success) {
          loadingStateManager.setLoading(key, false);
        } else {
          loadingStateManager.setError(key, result.error || 'Unknown error');
        }
        
        return result;
      } catch (error) {
        const err = error as Error;
        loadingStateManager.setError(key, err.message);
        return {
          data: null as T,
          success: false,
          error: err.message,
          message: `Failed to load ${key}`
        };
      }
    },

    retry(): Promise<ApiResponse<T>> {
      loadingStateManager.clearError(key);
      return this.load();
    },

    getState(): LoadingState {
      return loadingStateManager.getState(key);
    },

    subscribe(listener: (state: LoadingState) => void): () => void {
      return loadingStateManager.subscribe(key, listener);
    }
  };
}