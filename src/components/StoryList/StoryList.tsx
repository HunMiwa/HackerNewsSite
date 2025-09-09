import { useRef } from 'react';
import { StoryCard } from '../StoryCard/StoryCard';
import ButtonSample from '../ButtonSample/ButtonSample';
import { useStoryList, useIntersectionObserver } from '../hooks/hooks';
import classes from './StoryList.module.css';

export const StoryList = () => {
  const { stories, loading, error, hasMore, loadMore, refresh, handleLoginClick } = useStoryList();
  const loadMoreRef = useRef<any>(null);

  const lastStoryElementRef = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: !loading && hasMore
  });

  if (error && stories.length === 0) {
    return (
      <div className={classes.storyListError}>
        <div className={classes.errorContent}>
          <h3 id = "error_message">😕 Oops! Something went wrong</h3>
          <p>{error}</p> {/* This is a bad practice, is it not? */}
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
