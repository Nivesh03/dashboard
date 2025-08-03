import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LoadingState } from "../types";
import { createDataLoader } from "../data-service";
import { mockApi } from "../mock-data";

// Generic data loading hook
export function useData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: {
    autoLoad?: boolean;
    refreshInterval?: number;
  } = {}
) {
  const { autoLoad = true, refreshInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  // Create stable reference for fetchFunction to avoid recreation
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  // Create dataLoader only once using useMemo to prevent recreation
  const dataLoader = useMemo(() => createDataLoader(key, () => fetchFunctionRef.current()), [key]);

  const load = useCallback(async () => {
    const result = await dataLoader.load();
    if (result.success) {
      setData(result.data);
    }
    return result;
  }, [dataLoader]);

  const retry = useCallback(async () => {
    const result = await dataLoader.retry();
    if (result.success) {
      setData(result.data);
    }
    return result;
  }, [dataLoader]);

  // Use ref to store the latest load function to avoid dependency issues
  const loadRef = useRef(load);
  loadRef.current = load;

  // Subscribe to loading state changes
  useEffect(() => {
    const unsubscribe = dataLoader.subscribe((state) => {
      setLoadingState(state);
    });

    return unsubscribe;
  }, [dataLoader]);

  // Auto-load data on mount
  useEffect(() => {
    if (autoLoad) {
      loadRef.current();
    }
  }, [autoLoad]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!loadingState.isLoading) {
          loadRef.current();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, loadingState.isLoading]);

  return {
    data,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    lastUpdated: loadingState.lastUpdated,
    refetch: load,
    retry,
  };
}

// Specific hooks for dashboard data
export function useMetrics() {
  return useData("metrics", mockApi.getMetrics);
}

export function useRevenueData() {
  return useData("revenue-data", mockApi.getRevenueData);
}

export function useUserData() {
  return useData("user-data", mockApi.getUserData);
}

export function useConversionData() {
  return useData("conversion-data", mockApi.getConversionData);
}

export function useChannelData() {
  return useData("channel-data", mockApi.getChannelData);
}

export function useCampaignData() {
  return useData("campaign-data", mockApi.getCampaignData);
}

// Hook for multiple data sources
export function useDashboardData() {
  const metrics = useMetrics();
  const revenueData = useRevenueData();
  const userData = useUserData();
  const conversionData = useConversionData();
  const channelData = useChannelData();
  const campaignData = useCampaignData();

  const isLoading = [
    metrics.isLoading,
    revenueData.isLoading,
    userData.isLoading,
    conversionData.isLoading,
    channelData.isLoading,
    campaignData.isLoading,
  ].some(Boolean);

  const hasError = [
    metrics.error,
    revenueData.error,
    userData.error,
    conversionData.error,
    channelData.error,
    campaignData.error,
  ].some(Boolean);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      metrics.refetch(),
      revenueData.refetch(),
      userData.refetch(),
      conversionData.refetch(),
      channelData.refetch(),
      campaignData.refetch(),
    ]);
  }, [
    metrics,
    revenueData,
    userData,
    conversionData,
    channelData,
    campaignData,
  ]);

  return {
    metrics: metrics.data,
    revenueData: revenueData.data,
    userData: userData.data,
    conversionData: conversionData.data,
    channelData: channelData.data,
    campaignData: campaignData.data,
    isLoading,
    hasError,
    refetchAll,
  };
}
