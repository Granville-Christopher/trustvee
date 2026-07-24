import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaWallet } from "react-icons/fa";
import { formatNaira } from "../data/packages";
import {
  formatLongDate,
  getCountdownParts,
  nextWithdrawDate,
  paymentDate,
  withdrawalDate,
} from "../data/session";
import { useDashboard } from "./DashboardContext";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function WithdrawTab() {
  const { session, biWeekly, pkg, requestWithdraw } = useDashboard();
  const canWithdraw = session.balance >= 15000;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const paidOn = useMemo(
    () => paymentDate(session.cycleStartedAt),
    [session.cycleStartedAt],
  );
  const cycleEnd = useMemo(
    () => withdrawalDate(session.cycleStartedAt),
    [session.cycleStartedAt],
  );
  const targetDate = useMemo(
    () => nextWithdrawDate(session, now),
    [session, now],
  );
  const countdown = useMemo(
    () => getCountdownParts(targetDate, now),
    [targetDate, now],
  );

  return (
    <div className="dash-view">
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="dash-hello__eyebrow">Withdraw</p>
        <h1 className="dash-view__title">Cash out your balance</h1>
        <p className="dash-hello__meta">
          Minimum withdrawal is ₦15,000 for every member.
        </p>
      </motion.div>

      <section className="dash-balance">
        <span>Available balance</span>
        <strong>{formatNaira(session.balance)}</strong>
        <p>
          {canWithdraw
            ? "You’re at or above the minimum."
            : `Need ${formatNaira(15000 - session.balance)} more to withdraw.`}
        </p>
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>
            <FaWallet aria-hidden /> Your window
          </h2>
        </div>
        <p className="dash-panel__text">
          Paid on <strong>{formatLongDate(paidOn)}</strong>. Standard unlock is
          30 days later
          {biWeekly
            ? " — Elite / 10 referrals also unlock every 2 weeks."
            : ` on ${pkg.name}. Upgrade to Elite or refer 10 people for bi-weekly.`}
        </p>

        <div className="dash-withdraw-date">
          <span>Next withdrawal date</span>
          <strong>{formatLongDate(targetDate)}</strong>
          <p className="dash-withdraw-date__sub">
            Cycle end (payment + 30 days): {formatLongDate(cycleEnd)}
          </p>
        </div>

        <div
          className={`dash-countdown${countdown.expired ? " is-ready" : ""}`}
          aria-live="polite"
        >
          <span className="dash-countdown__label">
            {countdown.expired
              ? "Withdrawal window is open"
              : "Countdown to withdrawal date"}
          </span>
          {countdown.expired ? (
            <p className="dash-countdown__ready">You can request a payout now</p>
          ) : (
            <div className="dash-countdown__grid">
              <div>
                <strong>{pad(countdown.days)}</strong>
                <span>Days</span>
              </div>
              <div>
                <strong>{pad(countdown.hours)}</strong>
                <span>Hours</span>
              </div>
              <div>
                <strong>{pad(countdown.minutes)}</strong>
                <span>Mins</span>
              </div>
              <div>
                <strong>{pad(countdown.seconds)}</strong>
                <span>Secs</span>
              </div>
            </div>
          )}
        </div>

        <div className="dash-package" style={{ marginTop: "0.85rem" }}>
          <div>
            <span>Minimum</span>
            <strong>₦15,000</strong>
          </div>
          <div>
            <span>Schedule</span>
            <strong>{formatLongDate(targetDate)}</strong>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="dash-claim__btn"
        disabled={!canWithdraw || !countdown.expired}
        onClick={requestWithdraw}
        title={
          !countdown.expired
            ? `Opens on ${formatLongDate(targetDate)}`
            : undefined
        }
      >
        Request withdrawal
        <FaArrowRight size={13} aria-hidden />
      </button>
      {!countdown.expired ? (
        <p className="dash-hello__meta" style={{ textAlign: "center" }}>
          Button unlocks on {formatLongDate(targetDate)}.
        </p>
      ) : null}
    </div>
  );
}
