import { useEffect, useRef, useCallback } from 'react';
import { StoryCard } from '../StoryCard/StoryCard';
import ButtonSample from '../ButtonSample/ButtonSample';
import classes from './StoryList.module.css';

export const StoryList = ({ 
  stories, 
  loading, 
  error, 
  hasMore, 
  onLoadMore, 
  onRefresh,
  onLoginClick 
}) => {
  const observerRef = useRef<any>(null);
  const loadMoreRef = useRef<any>(null);

  const lastStoryElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    }, {
      threshold: 1.0,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

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
        <div className={classes.errorContent} id = "error_message">
          <h3>😕 Oops! Something went wrong</h3>
          <p>{error}</p>
          <ButtonSample onClick={onRefresh}>
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
        <ButtonSample onClick={onRefresh}>
          🔄 Refresh
        </ButtonSample>
      </div>
    );
  }

  return (
    <div className={classes.storyList}>
      <div className={classes.storyListHeader}>
        <ButtonSample onClick={onRefresh} disabled={loading} className={classes.refreshButton} id = "refresh_btn">
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
              <StoryCard story={story} onLoginClick={onLoginClick} />
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
            onClick={onLoadMore}
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
          <ButtonSample onClick={onLoadMore}>
            Try Again
          </ButtonSample>
        </div>
      )}
    </div>
  );
};
