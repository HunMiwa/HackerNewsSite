import Navbar from './components/Navbar/Navbar';
import LoginModal from './components/LoginModal/LoginModal';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import classes from './App.module.css';
import { Outlet } from 'react-router-dom';

function App() {
  const { isLoginModalOpen, loginMessage } = useSelector((state: RootState) => state.login);

  return (

    <div className={classes.app}>
      <Navbar />
      <header className={classes.appHeader}>
        <p className={classes.appSubtitle}>
          Low and behold, the Hacker News clone
        </p>
      </header>

      <main className={classes.appMain}>
        <Outlet />
      </main>

      <LoginModal
        modaltype="login"
        isOpen={isLoginModalOpen}
        customMessage={loginMessage}
      />

      <footer className={classes.appFooter}>
        <p>
          Built by Orsi using React, Vite, and the{' '}
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
