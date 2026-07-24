import { useMemo, useState, type FormEvent } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { saveCheckoutDraft } from "../data/checkout";
import { formatNaira, packages } from "../data/packages";
import "../styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetPackage = params.get("package") ?? "spark";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [packageId, setPackageId] = useState(
    packages.some((p) => p.id === presetPackage) ? presetPackage : "spark",
  );
  const [referralCode, setReferralCode] = useState(params.get("ref") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => packages.find((p) => p.id === packageId) ?? packages[0],
    [packageId],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !phone.trim() || !password) {
      setError("Fill in your name, phone, and password to continue.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the membership terms to create your account.");
      return;
    }

    const draft = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      packageId,
      referralCode: referralCode.trim(),
    };

    setLoading(true);
    saveCheckoutDraft(draft);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    navigate("/checkout", { state: draft });
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose your package, then continue to Paystack checkout to pay the entry fee and activate membership."
      footer={
        <>
          Already a member?{" "}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {error ? <p className="auth-error">{error}</p> : null}

        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-name">
            Full name
          </label>
          <input
            id="reg-name"
            className="auth-input"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-phone">
            Phone number
          </label>
          <input
            id="reg-phone"
            className="auth-input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0803 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-email">
            Email{" "}
            <span style={{ fontWeight: 500, color: "var(--muted)" }}>
              (for Paystack)
            </span>
          </label>
          <input
            id="reg-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-package">
            Package
          </label>
          <select
            id="reg-package"
            className="auth-input auth-select"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {formatNaira(pkg.entry)} →{" "}
                {formatNaira(pkg.returnAmount)}
              </option>
            ))}
          </select>
          <p className="auth-hint">
            {selected.name}: pay {formatNaira(selected.entry)} at checkout ·
            daily claim {formatNaira(Math.floor(selected.returnAmount / 30))}
            {selected.elite ? " · bi-weekly withdrawal" : " · monthly withdrawal"}
          </p>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-referral">
            Referral code{" "}
            <span style={{ fontWeight: 500, color: "var(--muted)" }}>
              (optional)
            </span>
          </label>
          <input
            id="reg-referral"
            className="auth-input"
            type="text"
            placeholder="Friend’s code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            autoComplete="off"
          />
        </div>

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />

        <label className="auth-check">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree to the membership terms and package rules
        </label>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Continuing…" : "Continue to checkout"}
          {!loading ? <FaArrowRight size={13} aria-hidden /> : null}
        </button>
      </form>
    </AuthLayout>
  );
}
