import { useState, type FormEvent } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const [identity, setIdentity] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!identity.trim()) {
      setError("Enter the phone or email on your account.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We’ll send a reset link or code to the phone or email on your Trustvee Elite account."
      footer={
        <>
          Remembered it?{" "}
          <Link className="auth-link" to="/login">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <p className="auth-hint" style={{ fontSize: "0.98rem", color: "var(--ink)" }}>
          If an account exists for <strong>{identity}</strong>, reset
          instructions are on the way. Check your messages and spam folder.
        </p>
      ) : (
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {error ? <p className="auth-error">{error}</p> : null}

          <div className="auth-field">
            <label className="auth-label" htmlFor="forgot-identity">
              Phone or email
            </label>
            <input
              id="forgot-identity"
              className="auth-input"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="0803… or you@email.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
            {!loading ? <FaArrowRight size={13} aria-hidden /> : null}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
