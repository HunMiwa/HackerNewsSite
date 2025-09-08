import { useState } from 'react';
import ButtonSample from '../ButtonSample/ButtonSample';
import classes from './Navbar.module.css';

const Navbar = ({ onNavigate, onLoginClick, onLogout, isLoggedIn = false, username }) => {
  const [activeItem, setActiveItem] = useState('top');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (item) => {
    handleNavClick(item);
    setIsMobileMenuOpen(false);
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

        <button 
          className={classes.hamburgerButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          id="hamburger_menu_btn"
        >
          <span className={`${classes.hamburgerLine} ${isMobileMenuOpen ? classes.hamburgerLineOpen : ''}`}></span>
          <span className={`${classes.hamburgerLine} ${isMobileMenuOpen ? classes.hamburgerLineOpen : ''}`}></span>
          <span className={`${classes.hamburgerLine} ${isMobileMenuOpen ? classes.hamburgerLineOpen : ''}`}></span>
        </button>

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

      {isMobileMenuOpen && (
        <div className={classes.mobileMenuOverlay}>
          <div className={classes.mobileMenu}>
            {navItems.map((item) => (
              <ButtonSample
                id = {`mobile_nav_button_${item.id}`}
                key={item.id}
                className={`${classes.mobileNavItem} ${
                  activeItem === item.id ? classes.mobileNavItemActive : ''
                }`}
                onClick={() => handleMobileNavClick(item)}
                title={item.title}
              >
                {item.label}
              </ButtonSample>
            ))}
            
            <ButtonSample
              id = "mobile_nav_button_submit"
              className={`${classes.mobileNavItem} ${classes.mobileNavItemSpecial}`}
              onClick={handleSubmitClick}
              title={isLoggedIn ? 'Submit a Story' : 'Login to Submit'}
            >
              submit
            </ButtonSample>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
