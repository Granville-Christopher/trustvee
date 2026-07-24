import { useId, useState, type InputHTMLAttributes } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
};

export default function PasswordInput({
  label,
  id,
  className = "",
  ...props
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);

  return (
    <div className={`auth-field ${className}`.trim()}>
      <label className="auth-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="auth-password-wrap">
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          className="auth-input auth-input--password"
          autoComplete={props.autoComplete ?? "current-password"}
        />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
    </div>
  );
}
