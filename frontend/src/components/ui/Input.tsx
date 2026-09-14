import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}

      <div className={`input-wrapper ${error ? "input-error" : ""}`}>
        {icon && <span className="input-icon">{icon}</span>}

        <input
          id={id}
          className={`input ${icon ? "input-with-icon" : ""} ${className}`}
          {...props}
        />
      </div>

      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export default Input;
