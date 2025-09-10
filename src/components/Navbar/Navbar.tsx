import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ButtonSample from '../ButtonSample/ButtonSample';
import classes from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal, logout } from '../../store/slices/LoginSlice';
import { RootState } from '../../store/store';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { type } = useParams();
  
  const { user } = useSelector((state: RootState) => state.login);
  const currentType = type || 'top';
  const isLoggedIn = !!user;
  const username = user?.username;

  const navItems = [
    { id: 'top', title: 'Top Stories' },
    { id: 'new', title: 'Newest Stories' },
    { id: 'ask', title: 'Ask' },
    { id: 'show', title: 'Show' },
    { id: 'jobs', title: 'Jobs' },
  ];

  const handleSubmitClick = () => {
    if (isLoggedIn) {
      console.log('Navigate to submit page');
    } else {
      dispatch(openLoginModal(null));
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = () => {
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
            <Link id = {`${item.id}_btn`}
              key={item.id}
              to={item.id === 'top' ? '/' : `/${item.id}`}
              className={`${classes.navItem} ${
                currentType === item.id ? classes.navItemActive : ''
              }`}
              title={item.title}
            >
              {item.title}
            </Link>
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
                onClick={() => dispatch(logout())}
                title="Logout"
                id = "logout_btn"
              >
                logout
              </button>
            </div>
          ) : (
            <ButtonSample
              onClick={() => dispatch(openLoginModal(null))}
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
              <Link
                id = {`mobile_nav_button_${item.id}`}
                key={item.id}
                to={item.id === 'top' ? '/' : `/${item.id}`}
                className={`${classes.mobileNavItem} ${
                  currentType === item.id ? classes.mobileNavItemActive : ''
                }`}
                onClick={handleMobileNavClick}
                title={item.title}
              >
                {item.title}
              </Link>
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
