import { forwardRef, useState } from 'react';
import classes from './RepliesCard.module.css';
import formatTime from '../../services/format_time';
import { GetReplies } from '../../quaries/Comments';

interface Comment {
  id: number;
  by: string;
  time: number;
  text: string;
  kids?: number[];
}

interface RepliesCardProps {
  comment: Comment;
  level: number;
}

export const RepliesCard = forwardRef<HTMLDivElement, RepliesCardProps>(({ comment, level }, ref) => {
  const [showReplies, setShowReplies] = useState(false);
  
  const { 
    data: replies = [], 
    isLoading: loadingReplies 
  } = GetReplies(showReplies && comment.kids?.length ? comment.id : 0);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div
      ref={ref}
      className={classes.repliesCard}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className={classes.commentHeader}>
        <span className={classes.author}>{comment.by}</span>
        <span className={classes.time}>{formatTime(comment.time)}</span>
      </div>

      <div
        className={classes.commentText}
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />

      {comment.kids && comment.kids.length > 0 && (
        <button
          className={classes.repliesToggle}
          onClick={handleToggleReplies}
          disabled={loadingReplies}
        >
          {loadingReplies ? (
            '⏳ Loading...'
          ) : showReplies ? (
            `▼ Hide ${comment.kids.length} replies`
          ) : (
            `▶ Show ${comment.kids.length} replies`
          )}
        </button>
      )}

      {showReplies && (
        <div className={classes.repliesContainer}>
          {replies.map(reply => (
            <RepliesCard
              key={reply.id}
              comment={reply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
});
