import classes from './StoryCard.module.css';
import ButtonSample from '../ButtonSample/ButtonSample';

export const StoryCard = ({ story, onLoginClick }) => {

  if (!story) return null;

  const {
    title,
    url,
    by: author,
    time,
    score,
    descendants: commentCount = 0,
    id
  } = story;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000) as any;
    const now = new Date() as any;
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 2) {
      return `${Math.floor(diffInHours)} hour ago`;
    }
    else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const getDomain = (url) => {
    if (!url) return 'news.ycombinator.com';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'news.ycombinator.com';
    }
  };

  const getHackerNewsUrl = () => `https://news.ycombinator.com/item?id=${id}`;

  const handleVoteClick = () => {
    if (onLoginClick) {
      onLoginClick("You need to be logged in to vote");
    }
  };

  return (
    <article className={classes.storyCard}>
      <div className={classes.storyContent}>
        <h2 className={classes.storyTitle} id = "story_title">
          {url ? (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={classes.storyLink}
            >
              {title}
            </a>
          ) : (
            <a 
              href={getHackerNewsUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className={classes.storyLink}
            >
              {title}
            </a>
          )}
        </h2>
        
        <div className={classes.storyMeta} id = "story_meta">
          <ButtonSample 
            id = "story_score"
            className={classes.storyScore} 
            title="Points"
            onClick={handleVoteClick}
          >
            ▲ {score || 0}
          </ButtonSample>
          
          <span className={classes.storyAuthor} id = "story_author">
            by <strong>{author}</strong>
          </span>
          
          <span className={classes.storyTime} id = "story_time">
            {formatTime(time)}
          </span>
          
          <span className={classes.storyDomain} id = "story_domain">
            ({getDomain(url)})
          </span>
        </div>
        
        <div className={classes.storyActions} id = "story_actions">
          <a 
            href={getHackerNewsUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className={classes.storyComments}
            id = "story_comments"
          >
            💬 {commentCount} comments
          </a>
        </div>
      </div>
    </article>
  );
};
