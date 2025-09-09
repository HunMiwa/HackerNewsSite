import { useEffect, useRef, useCallback } from 'react';
import { StoryCard } from '../StoryCard/StoryCard';
import ButtonSample from '../ButtonSample/ButtonSample';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  setStoriesForType,
  setLoading,
  setError,
  setHasMore,
  setCurrentPage,
  resetStoriesForType
} from '../../store/slices/StorySlice';
import { openLoginModal } from '../../store/slices/LoginSlice';
import { HackerNewsAPI } from '../../services/hackerNewsApi';
import classes from './StoryList.module.css';

export const StoryList = () => {
  const dispatch = useDispatch();
  const { storiesByType, currentType, loading, error, hasMore, currentPage } = useSelector((state: RootState) => state.story);
  
  const stories = storiesByType[currentType] || [];

  const observerRef = useRef<any>(null);
  const loadMoreRef = useRef<any>(null);

  const loadStories = useCallback(async (page = 0, append = false) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await HackerNewsAPI.getPaginatedStories(currentType, page, 30);
      
      dispatch(setStoriesForType({
        type: currentType,
        stories: result.stories,
        append
      }));
      
      dispatch(setHasMore(result.hasMore));
      dispatch(setCurrentPage(page));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentType, dispatch]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadStories(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, loadStories]);

  const refresh = useCallback(() => {
    dispatch(resetStoriesForType(currentType));
    loadStories(0, false);
  }, [currentType, dispatch, loadStories]);

  const handleLoginClick = useCallback((message: string) => {
    dispatch(openLoginModal(message));
  }, [dispatch]);

  useEffect(() => {
    loadStories(0, false);
  }, [currentType]);

  const lastStoryElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, {
      threshold: 1.0,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (error && stories.length === 0) {
    return (
      <div className={classes.storyListError}>
        <div className={classes.errorContent}>
          <h3 id = "error_message">😕 Oops! Something went wrong</h3>
          <p>{error}</p>
          <ButtonSample onClick={refresh}>
            🔄 Try Again
          </ButtonSample>
        </div>
      </div>
    );
  }

  if (!loading && stories.length === 0) {
    return (
      <div className={classes.storyListEmpty} id = "empty_error_message">
        <h3>📭 No stories found</h3>
        <p>Try refreshing the page or check back later.</p>
          <ButtonSample onClick={refresh}>
          🔄 Refresh
        </ButtonSample>
      </div>
    );
  }

  return (
    <div className={classes.storyList}>
      <div className={classes.storyListHeader}>
        <ButtonSample onClick={refresh} disabled={loading} className={classes.refreshButton} id = "refresh_btn">
          🔄 Refresh
        </ButtonSample>
      </div>

      <div className={classes.storiesContainer} id = "stories_container">
        {stories.map((story, index) => {
          const isLastElement = index === stories.length - 1;
          
          return (
            <div id = {`story_item_${index}`}
              key={story.id}
              ref={isLastElement ? lastStoryElementRef : null}
              className={classes.storyItem}
            >
              <StoryCard story={story} onLoginClick={handleLoginClick} />
            </div>
          );
        })}
      </div>

      {loading && (
        <div className={classes.loadingIndicator}>
          <div className={classes.loadingSpinner} id = "loading_spinner"></div>
          <p>Loading stories...</p>
        </div>
      )}

      {!loading && hasMore && (
        <div className={classes.loadMoreContainer} id = "load_more_btn">
          <ButtonSample 
            ref={loadMoreRef}
            onClick={loadMore}
          >
            Load More Stories
          </ButtonSample>
        </div>
      )}

      {!loading && !hasMore && stories.length > 0 && (
        <div className={classes.endIndicator} id = "end_indicator">
          <p>You've reached the end!</p>
        </div>
      )}

      {error && stories.length > 0 && (
        <div className={classes.loadError} id = "load_error_message">
          <p>Failed to load more stories: {error}</p>
          <ButtonSample onClick={loadMore}>
            Try Again
          </ButtonSample>
        </div>
      )}
    </div>
  );
};
