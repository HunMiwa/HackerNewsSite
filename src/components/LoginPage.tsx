import { useState, useEffect } from 'react';
import ButtonSample from '../ui/ButtonSample';
import classes from './LoginPage.module.css';

const LoginPage = ({ onLogin, onClose, isOpen = false, customMessage = null, modaltype }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ general?: string; username?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(modaltype);

  useEffect(() => {
    if (isOpen) {
      setIsRegistering(modaltype);
      setErrors({});
      setFormData({ username: '', password: '' });
    }
  }, [isOpen, modaltype]);

  const validateForm = () => {
    const newErrors: { username?: string, password?: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onLogin) {
        onLogin(formData.username);
      }
      
      setFormData({ username: '', password: '' });
      setErrors({});
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const toggleMode = () => {
    setIsRegistering(isRegistering === "login" ? "register" : "login");
    setErrors({});
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={classes.loginOverlay} onClick={handleOverlayClick}>
      <div className={classes.loginModal} id = {`${isRegistering}_modal`}>
        {/* Close button */}
        <button 
          className={classes.closeBtn}
          id = "close_btn"
          onClick={onClose}
          aria-label="Close login modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className={classes.loginHeader}>
          <div className={classes.logoSection}>
            <span className={classes.logo} id = "modal_logo">📰</span>
            <h2 className={classes.title} id = "modal_title">
              {customMessage || (isRegistering === "register" ? 'Join Hacker News' : 'Welcome Back')}
            </h2>
          </div>
          <p className={classes.subtitle} id = "modal_subtitle">
            {customMessage ? 'Please sign in to continue' : (isRegistering === "register" 
              ? 'Create your account to participate in the discussion'
              : 'Sign in to your account to access all features'
            )}
          </p>
        </div>

        {/* Form */}
        <form className={classes.loginForm} onSubmit={handleSubmit} id = {`${isRegistering}_form`}>
          {errors.general && (
            <div className={classes.errorMessage}>
              {errors.general}
            </div>
          )}

          {/* Username field */}
          <div className={classes.formGroup}>
            <label htmlFor="username" className={classes.label} id = "username_label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className={`${classes.input} ${errors.username ? classes.inputError : ''}`}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {errors.username && (
              <span className={classes.fieldError} id = "username_error">
                {errors.username}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className={classes.formGroup}>
            <label htmlFor="password" className={classes.label} id = "password_label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${classes.input} ${errors.password ? classes.inputError : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className={classes.fieldError} id = "password_error">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit button */}
          <ButtonSample
            type="submit"
            disabled={isLoading}
            className={classes.submitBtn}
            id = "submit_btn"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <span className={classes.loadingSpinner} id = "loading_spinner">
                <span className={classes.spinner}></span>
                {isRegistering === "register" ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isRegistering === "register" ? 'Create Account' : 'Sign In'
            )}
          </ButtonSample>
        </form>

        {/* Footer */}
        <div className={classes.loginFooter}>
          <p className={classes.toggleText}>
            {isRegistering === "register" ? 'Already have an account?' : "Don't have an account?"}
            <ButtonSample 
              type="button"
              className={classes.toggleBtn}
              id = "toggle_btn"
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isRegistering === "register" ? 'Sign In' : 'Create Account'}
            </ButtonSample>
          </p>
          
          {isRegistering !== "register" && (
            <ButtonSample 
              type="button"
              className={classes.forgotBtn}
              id = "forgot_btn"
              disabled={isLoading}
              onClick={toggleMode}
            >
              Forgot your password?
            </ButtonSample>
          )}
        </div>

        {/* Features list for registration */}
        {isRegistering === "register" && (
          <div className={classes.featuresList} id = "features_list">
            <h3 className={classes.featuresTitle} id = "features_title" >Why join Hacker News?</h3>
            <ul className={classes.features} id = "features_list_ul">
              <li>💬 Comment on stories and participate in discussions</li>
              <li>🔥 Submit your own stories and projects</li>
              <li>⭐ Upvote and downvote content</li>
              <li>📚 Save stories for later reading</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
