import { useCallback, useEffect, useState } from 'react';

type FetchFunction<T> = (offset: number, limit: number) => Promise<T[]>;

export function usePaginatedQuery<T>(fetchFunction: FetchFunction<T>, pageSize: number) {
  const [data, setData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    try {
      const result = await fetchFunction(0, pageSize);
      setData(result);
      setHasMore(result.length === pageSize);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchFunction, pageSize]);

  const fetchMore = useCallback(async () => {
    if (loadingMore || refreshing || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchFunction(data.length, pageSize);
      setData((prev) => [...prev, ...result]);
      if (result.length < pageSize) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, refreshing, hasMore, fetchFunction, data.length, pageSize]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    setData,
    loadingMore,
    refreshing,
    hasMore,
    fetchMore,
    refresh: fetchInitialData,
  };
}
