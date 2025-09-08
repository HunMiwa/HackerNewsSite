import { useState } from 'react';
import { useStories } from './hooks/useStories';
import Navbar from './components/Navbar/Navbar';
import { StoryList } from './components/StoryList/StoryList';
import LoginModal from './components/LoginModal/LoginModal';
import classes from './App.module.css';

function App() {
  const [storyType, setStoryType] = useState('top');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loginMessage, setLoginMessage] = useState(null);
  const { stories, loading, error, hasMore, loadMore, refresh } = useStories(storyType, 30);

  const handleStoryTypeChange = (newType) => {
    setStoryType(newType);
  };

  const handleNavigation = (type) => {
    handleStoryTypeChange(type);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setLoginMessage(null);
  };

  const handleLoginClickWithMessage = (message) => {
    setIsLoginOpen(true);
    setLoginMessage(message);
  };

  const handleLogin = (username) => {
    setUser({ username });
    setIsLoginOpen(false);
    setLoginMessage(null);
    console.log(`User ${username} logged in successfully`);
  };

  const handleLogout = () => {
    setUser(null);
    console.log('User logged out');
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setLoginMessage(null);
  };

  return (
    <div className={classes.app}>
      <Navbar
        onNavigate={handleNavigation}
        onLoginClick={handleLoginClick}
        isLoggedIn={!!user}
        username={user?.username}
        onLogout={handleLogout}
      />

      <header className={classes.appHeader}>
        <p className={classes.appSubtitle}>
          Low and behold, the Hacker News clone
        </p>
      </header>

      <main className={classes.appMain}>
        <StoryList
          stories={stories}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onRefresh={refresh}
          onLoginClick={handleLoginClickWithMessage}
        />
      </main>

      <LoginModal
        modaltype="login"
        isOpen={isLoginOpen}
        onLogin={handleLogin}
        onClose={handleCloseLogin}
        customMessage={loginMessage}
      />

      <footer className={classes.appFooter}>
        <p>
          Built with ❤️ using React, Vite, and the{' '}
          <a 
            href="https://github.com/HackerNews/API" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Hacker News API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
