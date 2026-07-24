import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaClipboardList, FaGift } from "react-icons/fa";
import { formatNaira } from "../data/packages";
import { useDashboard } from "./DashboardContext";

const slideLeft = {
  hidden: { opacity: 0, x: -36 },
  show: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function HomeTab() {
  const {
    firstName,
    pkg,
    day,
    left,
    session,
    biWeekly,
    claimAmt,
    claimReady,
    alreadyClaimed,
    handleClaim,
  } = useDashboard();

  return (
    <div className="dash-view">
      <motion.section
        className="dash-hello"
        custom={0}
        variants={slideLeft}
        initial="hidden"
        animate="show"
      >
        <p className="dash-hello__eyebrow">Home</p>
        <h1>{firstName}</h1>
        <p className="dash-hello__meta">
          {pkg.name} · Day {day} of 30 · {left} day{left === 1 ? "" : "s"} left
        </p>
      </motion.section>

      <motion.section
        className="dash-balance"
        custom={1}
        variants={slideLeft}
        initial="hidden"
        animate="show"
      >
        <span>Available balance</span>
        <strong>{formatNaira(session.balance)}</strong>
        <p>
          Withdraw from ₦15,000 ·{" "}
          {biWeekly ? "Bi-weekly window" : "Monthly window"}
        </p>
      </motion.section>

      <motion.section
        className="dash-claim"
        custom={2}
        variants={slideLeft}
        initial="hidden"
        animate="show"
      >
        <div className="dash-claim__copy">
          <h2>Daily claim</h2>
          <p>
            {alreadyClaimed
              ? "Claimed for today. See you tomorrow."
              : claimReady
                ? `Tasks done — claim ${formatNaira(claimAmt)} now.`
                : `Complete tasks to unlock ${formatNaira(claimAmt)}.`}
          </p>
        </div>
        <button
          type="button"
          className="dash-claim__btn"
          onClick={handleClaim}
          disabled={alreadyClaimed || !claimReady}
        >
          {alreadyClaimed ? "Claimed" : `Claim ${formatNaira(claimAmt)}`}
        </button>
        {!claimReady && !alreadyClaimed ? (
          <Link className="dash-inline-link" to="/dashboard/tasks">
            Go to tasks <FaArrowRight size={11} aria-hidden />
          </Link>
        ) : null}
      </motion.section>

      <motion.section
        className="dash-panel"
        custom={3}
        variants={slideLeft}
        initial="hidden"
        animate="show"
      >
        <div className="dash-panel__head">
          <h2>
            <FaGift aria-hidden /> Your package
          </h2>
        </div>
        <div className="dash-package">
          <div>
            <span>Tier</span>
            <strong>{pkg.name}</strong>
          </div>
          <div>
            <span>Daily</span>
            <strong>{formatNaira(claimAmt)}</strong>
          </div>
          <div>
            <span>Month end</span>
            <strong>{formatNaira(pkg.returnAmount)}</strong>
          </div>
          <div>
            <span>Schedule</span>
            <strong>{biWeekly ? "Bi-weekly" : "Monthly"}</strong>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="dash-quick"
        custom={4}
        variants={slideLeft}
        initial="hidden"
        animate="show"
      >
        <Link to="/dashboard/tasks" className="dash-quick__item">
          <FaClipboardList />
          <span>Tasks {session.tasksDoneToday}/{session.tasksTotal}</span>
        </Link>
        <Link to="/dashboard/withdraw" className="dash-quick__item">
          <span>Withdraw</span>
          <FaArrowRight size={12} />
        </Link>
      </motion.div>
    </div>
  );
}
