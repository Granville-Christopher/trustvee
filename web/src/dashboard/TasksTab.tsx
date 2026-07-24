import { motion } from "framer-motion";
import { FaCheckCircle, FaClipboardList, FaShareAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { formatNaira } from "../data/packages";
import { useDashboard } from "./DashboardContext";

export default function TasksTab() {
  const navigate = useNavigate();
  const {
    session,
    tasks,
    toggleTask,
    claimReady,
    alreadyClaimed,
    claimAmt,
    handleClaim,
  } = useDashboard();

  return (
    <div className="dash-view">
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="dash-hello__eyebrow">Tasks</p>
        <h1 className="dash-view__title">Today’s checklist</h1>
        <p className="dash-hello__meta">
          2 personal tasks + share your referral link. Finish all{" "}
          {session.tasksTotal} to unlock today’s claim.
        </p>
      </motion.div>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>
            <FaClipboardList aria-hidden /> Progress
          </h2>
          <span>
            {session.tasksDoneToday}/{session.tasksTotal}
          </span>
        </div>
        <ul className="dash-tasks">
          {tasks.map((task, i) => {
            const isReferral = task.kind === "referral";
            return (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <button
                  type="button"
                  className={`dash-task${task.done ? " is-done" : ""}${
                    isReferral ? " dash-task--referral" : ""
                  }`}
                  onClick={() => {
                    if (isReferral) {
                      navigate("/dashboard/refer");
                      return;
                    }
                    toggleTask(task.id);
                  }}
                >
                  <span className="dash-task__check" aria-hidden>
                    {task.done ? <FaCheckCircle /> : <span />}
                  </span>
                  <span className="dash-task__body">
                    <span className="dash-task__title">{task.title}</span>
                    {isReferral ? (
                      <span className="dash-task__hint">
                        <FaShareAlt size={11} aria-hidden /> Tap to open Refer ·
                        completes when you copy your link
                      </span>
                    ) : null}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </section>

      <section className="dash-claim">
        <div className="dash-claim__copy">
          <h2>Claim unlock</h2>
          <p>
            {alreadyClaimed
              ? "Already claimed today."
              : claimReady
                ? `Ready — claim ${formatNaira(claimAmt)}.`
                : "Complete every task above first."}
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
        <Link className="dash-inline-link" to="/dashboard">
          Back to home
        </Link>
      </section>
    </div>
  );
}
