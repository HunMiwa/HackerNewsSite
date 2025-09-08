import { useState } from 'react';
import ButtonSample from '../ui/ButtonSample';
import classes from './Navbar.module.css';

const Navbar = ({ onNavigate, onLoginClick, onLogout, isLoggedIn = false, username }) => {
  const [activeItem, setActiveItem] = useState('top');

  const navItems = [
    { id: 'top', label: 'top', title: 'Top Stories' },
    { id: 'new', label: 'new', title: 'Newest Stories' },
    { id: 'ask', label: 'ask', title: 'Ask HN' },
    { id: 'show', label: 'show', title: 'Show HN' },
    { id: 'jobs', label: 'jobs', title: 'Jobs' },
  ];

  const handleNavClick = (item) => {
    setActiveItem(item.id);
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  const handleSubmitClick = () => {
    if (isLoggedIn) {
      console.log('Navigate to submit page');
    } else {
      onLoginClick();
    }
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navContainer}>
        <div className={classes.navLogo}>
          <span className={classes.logoIcon} id = "nav_logo">📰</span>
          <h1 className={classes.navTitle} id = "nav_title">Hacker News</h1>
        </div>

        <div className={classes.navItems}>
          {navItems.map((item) => (
            <ButtonSample
              id = {`nav_button_${item.id}`}
              key={item.id}
              className={`${classes.navItem} ${
                activeItem === item.id ? classes.navItemActive : ''
              }`}
              onClick={() => handleNavClick(item)}
              title={item.title}
            >
              {item.label}
            </ButtonSample>
          ))}
          
          <ButtonSample
            id = "nav_button_submit"
            className={`${classes.navItem} ${classes.navItemSpecial}`}
            onClick={handleSubmitClick}
            title={isLoggedIn ? 'Submit a Story' : 'Login to Submit'}
          >
            submit
          </ButtonSample>
        </div>

        <div className={classes.userSection}>
          {isLoggedIn ? (
            <div className={classes.userInfo}>
              <span className={classes.username} id = "nav_username">{username}</span>
              <button 
                className={classes.logoutBtn} 
                onClick={onLogout}
                title="Logout"
                id = "logout_btn"
              >
                logout
              </button>
            </div>
          ) : (
            <ButtonSample
              onClick={onLoginClick}
              className={classes.loginBtn}
              id = "login_btn"
            >
              login
            </ButtonSample>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
