import { useState, useEffect, useCallback } from 'react';
import { HackerNewsAPI } from '../services/hackerNewsApi';

export const useStories = (storyType = 'top', pageSize = 30) => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setStories([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
  }, [storyType]);

  const loadStories = useCallback(async (page = 0, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await HackerNewsAPI.getPaginatedStories(storyType, page, pageSize);
      
      setStories(prevStories => 
        append ? [...prevStories, ...result.stories] : result.stories
      );
      setHasMore(result.hasMore);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storyType, pageSize]);

  useEffect(() => {
    loadStories(0, false);
  }, [loadStories]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadStories(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, loadStories]);

  const refresh = useCallback(() => {
    setStories([]);
    setCurrentPage(0);
    setHasMore(true);
    loadStories(0, false);
  }, [loadStories]);

  return {
    stories,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
