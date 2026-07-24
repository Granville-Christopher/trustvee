import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { formatNaira } from "../data/packages";
import "../styles/auth.css";
import "../styles/checkout.css";

type SuccessState = {
  reference?: string;
  packageName?: string;
  amount?: number;
  fullName?: string;
};

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as SuccessState | null) ?? {};

  useEffect(() => {
    if (!state.reference) {
      navigate("/register", { replace: true });
    }
  }, [state.reference, navigate]);

  if (!state.reference) return null;

  return (
    <AuthLayout
      title="Payment received"
      subtitle="Your package payment was successful. Sign in to start tasks and claim your daily share."
    >
      <div className="checkout-success">
        <div className="checkout-success__icon" aria-hidden>
          <FaCheckCircle size={36} />
        </div>
        <p className="checkout-success__lead">
          Welcome{state.fullName ? `, ${state.fullName.split(" ")[0]}` : ""}.
          Your <strong>{state.packageName}</strong> membership is activating.
        </p>
        <div className="checkout-summary checkout-summary--compact">
          <div className="checkout-summary__rows">
            <div>
              <span>Amount paid</span>
              <strong>{formatNaira(state.amount ?? 0)}</strong>
            </div>
            <div>
              <span>Reference</span>
              <strong className="checkout-ref">{state.reference}</strong>
            </div>
          </div>
        </div>
        <Link className="auth-submit" to="/login">
          Continue to sign in
          <FaArrowRight size={13} aria-hidden />
        </Link>
      </div>
    </AuthLayout>
  );
}
