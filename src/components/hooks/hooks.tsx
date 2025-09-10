import { useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { openLoginModal } from '../../store/slices/LoginSlice';
import { GetInfiniteStories } from '../../quaries/Stories';

export interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: () => void;
  enabled?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 1.0,
  rootMargin = '100px',
  onIntersect,
  enabled = true
}: UseIntersectionObserverOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const elementRef = useCallback((node: HTMLElement | null) => {
    if (!enabled || !onIntersect) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (node) {
      observerRef.current.observe(node);
    }
  }, [threshold, rootMargin, onIntersect, enabled]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return elementRef;
};

export const useStoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Get story type from URL params instead of Redux
  const { type } = useParams();
  const currentType = type || 'top';
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = GetInfiniteStories(currentType, 30);

  const stories = data?.pages.flatMap(page => page.stories) || [];

  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoginClick = useCallback((message: string) => {
    dispatch(openLoginModal(message));
  }, [dispatch]);

  return {
    stories,
    currentType,
    loading: isLoading || isFetchingNextPage,
    error: error?.message,
    hasMore: hasNextPage,
    currentPage: data?.pages.length || 0,
    loadMore,
    refresh,
    handleLoginClick
  };
};
