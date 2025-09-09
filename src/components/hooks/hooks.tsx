import { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { loadStoriesThunk, loadMoreStoriesThunk, refreshStoriesThunk } from '../../store/slices/StorySlice';
import { openLoginModal } from '../../store/slices/LoginSlice';

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
  const { storiesByType, currentType, loading, error, hasMore, currentPage } = useSelector((state: RootState) => state.story);
  
  const stories = storiesByType[currentType] || [];

  const loadStories = useCallback((type: string, page = 0, append = false) => {
    dispatch(loadStoriesThunk({ type: type as any, page, append }));
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(loadMoreStoriesThunk());
    }
  }, [dispatch, loading, hasMore]);

  const refresh = useCallback(() => {
    dispatch(refreshStoriesThunk());
  }, [dispatch]);

  const handleLoginClick = useCallback((message: string) => {
    dispatch(openLoginModal(message));
  }, [dispatch]);

  useEffect(() => {
    loadStories(currentType, 0, false);
  }, [currentType, loadStories]);

  return {
    stories,
    currentType,
    loading,
    error,
    hasMore,
    currentPage,
    loadStories,
    loadMore,
    refresh,
    handleLoginClick
  };
};
