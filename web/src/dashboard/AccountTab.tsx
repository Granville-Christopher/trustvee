import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import { formatNaira } from "../data/packages";
import { useDashboard } from "./DashboardContext";

export default function AccountTab() {
  const { session, pkg, biWeekly, day, left, logout } = useDashboard();

  return (
    <div className="dash-view">
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="dash-hello__eyebrow">Account</p>
        <h1 className="dash-view__title">{session.fullName}</h1>
        <p className="dash-hello__meta">Manage your Trustvee Elite profile</p>
      </motion.div>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Profile</h2>
        </div>
        <div className="dash-account-rows">
          <div>
            <span>Phone</span>
            <strong>{session.phone}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{session.email || "—"}</strong>
          </div>
          <div>
            <span>Package</span>
            <strong>{pkg.name}</strong>
          </div>
          <div>
            <span>Balance</span>
            <strong>{formatNaira(session.balance)}</strong>
          </div>
          <div>
            <span>Cycle</span>
            <strong>
              Day {day}/30 · {left} left
            </strong>
          </div>
          <div>
            <span>Withdrawals</span>
            <strong>{biWeekly ? "Bi-weekly" : "Monthly"}</strong>
          </div>
          {session.paymentReference ? (
            <div>
              <span>Payment ref</span>
              <strong className="dash-ref-text">
                {session.paymentReference}
              </strong>
            </div>
          ) : null}
        </div>
      </section>

      <button type="button" className="dash-secondary-btn" onClick={logout}>
        <FaSignOutAlt aria-hidden />
        Sign out
      </button>
    </div>
  );
}
