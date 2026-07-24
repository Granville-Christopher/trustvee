import { useState, type FormEvent } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import "../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!phoneOrEmail.trim() || !password) {
      setError("Enter your phone/email and password to continue.");
      return;
    }

    setLoading(true);
    // UI-ready stub — Nest auth API wires in next
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    navigate("/dashboard");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to claim today’s share, check your balance, and manage referrals."
      footer={
        <>
          New to Trustvee Elite?{" "}
          <Link className="auth-link" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {error ? <p className="auth-error">{error}</p> : null}

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-identity">
            Phone or email
          </label>
          <input
            id="login-identity"
            className="auth-input"
            type="text"
            inputMode="email"
            autoComplete="username"
            placeholder="0803… or you@email.com"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            required
          />
        </div>

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="auth-row">
          <label className="auth-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <Link className="auth-link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
          {!loading ? <FaArrowRight size={13} aria-hidden /> : null}
        </button>
      </form>
    </AuthLayout>
  );
}
