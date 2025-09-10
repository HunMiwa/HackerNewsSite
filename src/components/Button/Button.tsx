import classes from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`${classes.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type as 'submit' | 'button' | 'reset'}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;