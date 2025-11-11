import { useCallback, useEffect, useState } from 'react';

import { API_PAGE_SIZE } from '@app/config/Constants';

export function usePaginatedQuery<T>(
  fetchFunction: (offset: number) => Promise<T[]>,
  duplicateResolver?: (data: T[]) => T[],
) {
  const [data, setData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    try {
      const result = await fetchFunction(0);
      console.log('initial fetch length: ' + result.length);
      setData(result);
      setHasMore(result.length === API_PAGE_SIZE);
      return result;
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

        console.log('fetch more length: ' + result.length);
        if (result.length < API_PAGE_SIZE) {
          setHasMore(false);
        }

        if (duplicateResolver) {
          setData((prevData) => duplicateResolver([...prevData, ...result]));
        } else {
          setData((prevData) => [...prevData, ...result]);
        }

        return result;
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
    refresh: fetchInitialData,
    refreshing,
    setRefreshing,
    fetchMore,
    loadingMore,
  };
}
