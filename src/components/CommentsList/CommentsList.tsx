import { useParams, Link } from 'react-router-dom';
import { RepliesCard } from '../RepliesCard/RepliesCard';
import ButtonSample from '../ButtonSample/ButtonSample';
import classes from './CommentsList.module.css';
import { GetComments } from '../../quaries/Comments';
import { GetStory } from '../../quaries/Stories';

export const CommentsList = () => {
  const { id } = useParams();
  const storyId = parseInt(id || '0');
  
  const { data: commentsData, isLoading: loadingComments, error: commentsError, refetch: refetchComments } = GetComments(storyId);
  const { data: story, isLoading: loadingStory, error: storyError, refetch: refetchStory } = GetStory(storyId);
  
  const comments = commentsData?.comments || [];
  const isLoading = loadingComments || loadingStory;
  const error = commentsError || storyError;

  const handleRefresh = () => {
    refetchComments();
    refetchStory();
  };

  if (isLoading) return <div className={classes.loading}>Loading comments...</div>;
  if (error) return <div className={classes.error}>Error: {error.message}</div>;
  if (!story) return <div className={classes.error}>Story not found</div>;

  return (
    <div className={classes.commentsList}>
      <div className={classes.storyHeader}>
        <Link to="/" className={classes.backLink}>← Back to Stories</Link>
        <h1 className={classes.storyTitle}>{story.title}</h1>
        <div className={classes.storyMeta}>
          <span>by {story.by}</span>
          <span>{story.score} points</span>
          <span>{story.descendants || 0} comments</span>
        </div>
        {story.url && (
          <a 
            href={story.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={classes.storyUrl}
          >
            🔗 Visit Link
          </a>
        )}
      </div>

      <div className={classes.commentsSection}>
        <div className={classes.commentsListHeader}>
          <h2>Comments ({comments.length})</h2>
          <ButtonSample onClick={handleRefresh}>
            🔄 Refresh
          </ButtonSample>
        </div>
        
        <div className={classes.commentsContainer} id="comments_container">
          {comments.length === 0 ? (
            <div className={classes.noComments}>No comments yet</div>
          ) : (
            comments.map(comment => (
              <RepliesCard
                key={comment.id}
                comment={comment}
                level={0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};