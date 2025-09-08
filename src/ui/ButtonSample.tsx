import classes from './ButtonSample.module.css';

const ButtonSample = ({ 
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
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonSample;