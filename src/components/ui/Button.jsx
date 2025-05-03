const Button = ({ children, type = 'button', onClick }) => {
    return (
      <button type={type} onClick={onClick} className="auth-button">
        {children}
      </button>
    );
  };
  
  export default Button;