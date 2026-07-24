import { motion } from "framer-motion";
import { FaUserFriends } from "react-icons/fa";
import { formatNaira, packages } from "../data/packages";
import { useDashboard } from "./DashboardContext";

export default function ReferTab() {
  const {
    session,
    pkg,
    referralLink,
    setToast,
    completeReferralTask,
    tasks,
  } = useDashboard();

  const referralDone = tasks.some((t) => t.kind === "referral" && t.done);

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      completeReferralTask();
      if (referralDone) {
        setToast("Referral link copied.");
      }
    } catch {
      setToast("Could not copy. Long-press the link instead.");
    }
  }

  return (
    <div className="dash-view">
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="dash-hello__eyebrow">Refer</p>
        <h1 className="dash-view__title">Earn 10% on every join</h1>
        <p className="dash-hello__meta">
          When someone pays with your link, 10% of their package entry hits your
          balance. Copying your link also completes today’s referral task.
        </p>
      </motion.div>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>
            <FaUserFriends aria-hidden /> Your progress
          </h2>
          <span>{session.referralCount}/10</span>
        </div>
        <p className="dash-panel__text">
          Reach 10 referrals for bi-weekly withdrawals
          {pkg.elite ? " (you already have Elite flexibility)." : "."}
        </p>
        <div className="dash-progress">
          <div
            className="dash-progress__bar"
            style={{
              width: `${Math.min(100, (session.referralCount / 10) * 100)}%`,
            }}
          />
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Your link</h2>
          {referralDone ? (
            <span className="dash-ref-done">Task done</span>
          ) : (
            <span>Daily task</span>
          )}
        </div>
        <div className="dash-ref-box">
          <code>{referralLink}</code>
          <button type="button" onClick={copyReferralLink}>
            Copy
          </button>
        </div>
        <p className="dash-panel__text" style={{ marginTop: "0.85rem", marginBottom: 0 }}>
          Tap Copy to share — we’ll mark “Share your referral link once” as
          complete automatically.
        </p>
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Bonus examples</h2>
        </div>
        <ul className="dash-earn-list">
          {packages.map((p) => (
            <li key={p.id}>
              <span>{p.name}</span>
              <strong>{formatNaira(p.entry * 0.1)}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
