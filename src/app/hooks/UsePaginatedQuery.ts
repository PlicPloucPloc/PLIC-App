import { useCallback, useEffect, useState } from 'react';

import { API_PAGE_SIZE } from '@app/config/Constants';

export function usePaginatedQuery<T>(
  fetchFunction: (offset: number) => Promise<T[]>,
  duplicateResolver?: (data: T[]) => T[],
) {
  const [data, setData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    try {
      const result = await fetchFunction(0);
      setData(result);
      setHasMore(result.length === API_PAGE_SIZE);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchFunction]);

  const fetchMore = useCallback(
    async (offset?: number) => {
      if (loadingMore || refreshing || !hasMore) return;
      setLoadingMore(true);
      try {
        const offsetValue = typeof offset === 'number' ? offset : data.length;
        const result = await fetchFunction(offsetValue);

        if (duplicateResolver) {
          setData((prevData) => duplicateResolver([...prevData, ...result]));
        } else {
          setData((prevData) => [...prevData, ...result]);
        }

        if (result.length < API_PAGE_SIZE) setHasMore(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMore(false);
      }
    },
    [loadingMore, refreshing, hasMore, fetchFunction, duplicateResolver, data.length],
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    setData,
    loadingMore,
    refreshing,
    fetchMore,
    refresh: fetchInitialData,
  };
}
