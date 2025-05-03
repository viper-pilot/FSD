const Input = ({ type, name, value, onChange, placeholder, required }) => {
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="auth-input"
      />
    );
  };
  
  export default Input;