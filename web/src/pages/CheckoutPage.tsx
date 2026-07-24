import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FaArrowRight,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import {
  clearCheckoutDraft,
  getPackageOrDefault,
  loadCheckoutDraft,
  makePaymentReference,
  saveCheckoutDraft,
  type CheckoutDraft,
} from "../data/checkout";
import { createSessionFromPayment, saveSession } from "../data/session";
import { dailyClaim, formatNaira } from "../data/packages";
import { getPaystackPublicKey, openPaystackCheckout } from "../lib/paystack";
import "../styles/auth.css";
import "../styles/checkout.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateDraft = location.state as CheckoutDraft | null;

  const draft = useMemo(() => {
    if (stateDraft?.packageId && stateDraft.fullName && stateDraft.phone) {
      saveCheckoutDraft(stateDraft);
      return stateDraft;
    }
    return loadCheckoutDraft();
  }, [stateDraft]);

  const selected = getPackageOrDefault(draft?.packageId ?? "spark");
  const [email, setEmail] = useState(draft?.email ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasPaystackKey = Boolean(getPaystackPublicKey());

  useEffect(() => {
    if (!draft) {
      navigate("/register", { replace: true });
    }
  }, [draft, navigate]);

  if (!draft) {
    return null;
  }

  async function startPayment(e: FormEvent) {
    e.preventDefault();
    setError("");

    const payEmail = email.trim();
    if (!payEmail || !payEmail.includes("@")) {
      setError("Enter a valid email for Paystack receipt and confirmation.");
      return;
    }

    const nextDraft: CheckoutDraft = { ...draft!, email: payEmail };
    saveCheckoutDraft(nextDraft);

    const reference = makePaymentReference(selected.id);
    setLoading(true);

    try {
      await openPaystackCheckout({
        email: payEmail,
        amountNaira: selected.entry,
        reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Package",
              variable_name: "package",
              value: selected.name,
            },
            {
              display_name: "Full name",
              variable_name: "full_name",
              value: draft!.fullName,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: draft!.phone,
            },
            {
              display_name: "Referral code",
              variable_name: "referral_code",
              value: draft!.referralCode || "none",
            },
          ],
        },
        onSuccess: (response) => {
          const member = createSessionFromPayment({
            fullName: draft!.fullName,
            phone: draft!.phone,
            email: payEmail,
            packageId: selected.id,
            referralCode: draft!.referralCode,
            paymentReference: response.reference,
          });
          saveSession(member);
          clearCheckoutDraft();
          navigate("/dashboard", {
            replace: true,
            state: { reference: response.reference },
          });
        },
        onClose: () => {
          setLoading(false);
          setError("Payment window closed. You can try again when ready.");
        },
      });
    } catch (err) {
      setLoading(false);
      if (err instanceof Error && err.message === "MISSING_KEY") {
        setError(
          "Paystack public key is missing. Add VITE_PAYSTACK_PUBLIC_KEY to your web/.env file.",
        );
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "Could not open Paystack checkout. Please try again.",
      );
    }
  }

  return (
    <AuthLayout
      title="Complete payment"
      subtitle={`Pay ${formatNaira(selected.entry)} for ${selected.name} to activate your membership cycle.`}
      footer={
        <>
          Need a different package?{" "}
          <Link className="auth-link" to="/register">
            Go back
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={startPayment} noValidate>
        {error ? <p className="auth-error">{error}</p> : null}

        <article className="checkout-summary">
          <div className="checkout-summary__head">
            <span>Selected package</span>
            <strong>{selected.name}</strong>
          </div>

          <div className="checkout-summary__rows">
            <div>
              <span>Member</span>
              <strong>{draft.fullName}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{draft.phone}</strong>
            </div>
            <div>
              <span>Entry fee</span>
              <strong>{formatNaira(selected.entry)}</strong>
            </div>
            <div>
              <span>Daily claim</span>
              <strong>{formatNaira(dailyClaim(selected.returnAmount))}</strong>
            </div>
            <div>
              <span>Month-end return</span>
              <strong>{formatNaira(selected.returnAmount)}</strong>
            </div>
            <div>
              <span>Withdrawal</span>
              <strong>
                {selected.elite ? "Bi-weekly (Elite)" : "Monthly"}
              </strong>
            </div>
          </div>

          <div className="checkout-summary__total">
            <span>Pay now</span>
            <strong>{formatNaira(selected.entry)}</strong>
          </div>
        </article>

        <div className="auth-field">
          <label className="auth-label" htmlFor="checkout-email">
            Email for Paystack
          </label>
          <input
            id="checkout-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="auth-hint">
            Paystack sends payment confirmation to this email.
          </p>
        </div>

        <div className="checkout-trust">
          <span>
            <FaShieldAlt aria-hidden /> Secured by Paystack
          </span>
          <span>
            <FaLock aria-hidden /> Amount locked to {selected.name}
          </span>
        </div>

        {!hasPaystackKey ? (
          <p className="auth-hint">
            Dev note: set <code>VITE_PAYSTACK_PUBLIC_KEY</code> in{" "}
            <code>web/.env</code> to open live Paystack checkout.
          </p>
        ) : null}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Opening Paystack…" : `Pay ${formatNaira(selected.entry)}`}
          {!loading ? <FaArrowRight size={13} aria-hidden /> : null}
        </button>
      </form>
    </AuthLayout>
  );
}
