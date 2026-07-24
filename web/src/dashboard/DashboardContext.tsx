import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPackageOrDefault, loadCheckoutDraft } from "../data/checkout";
import { formatNaira } from "../data/packages";
import {
  canClaim,
  claimAmountFor,
  clearSession,
  createSessionFromPayment,
  cycleDay,
  daysLeft,
  hasBiWeekly,
  loadSession,
  saveSession,
  todayKey,
  type MemberSession,
} from "../data/session";
import {
  clearDailyTasks,
  loadOrCreateDailyTasks,
  REFERRAL_TASK_ID,
  saveDailyTasks,
  userTaskKey,
  type DailyTask,
} from "../data/taskPool";

export type DashTask = DailyTask;

type DashboardContextValue = {
  session: MemberSession;
  tasks: DashTask[];
  toast: string;
  setToast: (msg: string) => void;
  pkg: ReturnType<typeof getPackageOrDefault>;
  firstName: string;
  claimReady: boolean;
  alreadyClaimed: boolean;
  day: number;
  left: number;
  biWeekly: boolean;
  claimAmt: number;
  referralLink: string;
  toggleTask: (id: string) => void;
  completeReferralTask: () => void;
  handleClaim: () => void;
  logout: () => void;
  requestWithdraw: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
}

function syncTaskCount(session: MemberSession, tasks: DailyTask[]) {
  const doneCount = tasks.filter((t) => t.done).length;
  return {
    ...session,
    tasksDoneToday: doneCount,
    tasksTotal: tasks.length,
    claimedToday:
      session.lastClaimDate === todayKey() ? session.claimedToday : false,
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [session, setSession] = useState<MemberSession | null>(() =>
    loadSession(),
  );
  const [tasks, setTasks] = useState<DashTask[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;

    const existing = loadSession();
    if (existing?.paymentReference === reference) {
      setSession(existing);
      return;
    }

    const draft = loadCheckoutDraft();
    if (draft) {
      const next = createSessionFromPayment({
        ...draft,
        paymentReference: reference,
      });
      saveSession(next);
      setSession(next);
      return;
    }

    if (!existing) {
      navigate("/login", { replace: true });
    }
  }, [params, navigate]);

  useEffect(() => {
    if (!session && !params.get("reference") && !params.get("trxref")) {
      const stored = loadSession();
      if (!stored) navigate("/login", { replace: true });
      else setSession(stored);
    }
  }, [session, params, navigate]);

  // Assign daily tasks: 2 shuffled from 2000+ pool + persistent referral task
  useEffect(() => {
    if (!session) return;
    const date = todayKey();
    const key = userTaskKey(session);
    const daily = loadOrCreateDailyTasks(key, date);
    setTasks(daily);

    const synced = syncTaskCount(session, daily);
    if (
      synced.tasksDoneToday !== session.tasksDoneToday ||
      synced.tasksTotal !== session.tasksTotal
    ) {
      saveSession(synced);
      setSession(synced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-seed when identity/day changes
  }, [
    session?.phone,
    session?.email,
    session?.paymentReference,
  ]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const persist = useCallback((next: MemberSession) => {
    saveSession(next);
    setSession(next);
  }, []);

  const persistTasks = useCallback(
    (nextTasks: DailyTask[], current: MemberSession) => {
      const key = userTaskKey(current);
      const date = todayKey();
      saveDailyTasks(key, date, nextTasks);
      setTasks(nextTasks);
      persist(syncTaskCount(current, nextTasks));
    },
    [persist],
  );

  const toggleTask = useCallback(
    (id: string) => {
      if (!session) return;
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      // Referral task is completed only by copying the link
      if (target.kind === "referral") return;

      const nextTasks = tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      );
      persistTasks(nextTasks, session);
    },
    [session, tasks, persistTasks],
  );

  const completeReferralTask = useCallback(() => {
    if (!session) return;
    const referral = tasks.find((t) => t.id === REFERRAL_TASK_ID);
    if (!referral || referral.done) return;

    const nextTasks = tasks.map((t) =>
      t.id === REFERRAL_TASK_ID ? { ...t, done: true } : t,
    );
    persistTasks(nextTasks, session);
    setToast("Referral task completed — link copied.");
  }, [session, tasks, persistTasks]);

  const handleClaim = useCallback(() => {
    if (!session) return;
    if (!canClaim(session)) {
      setToast("Finish all daily tasks before claiming.");
      return;
    }
    if (session.claimedToday && session.lastClaimDate === todayKey()) {
      setToast("You already claimed today. Come back tomorrow.");
      return;
    }
    const amount = claimAmountFor(session);
    persist({
      ...session,
      balance: session.balance + amount,
      claimedToday: true,
      lastClaimDate: todayKey(),
    });
    setToast(`Claimed ${formatNaira(amount)} into your balance.`);
  }, [session, persist]);

  const logout = useCallback(() => {
    clearSession();
    clearDailyTasks();
    navigate("/login");
  }, [navigate]);

  const requestWithdraw = useCallback(() => {
    if (!session) return;
    if (session.balance < 15000) {
      setToast("Balance below ₦15,000 minimum.");
      return;
    }
    setToast("Withdrawal request sent. Nest payouts wire next.");
  }, [session]);

  const value = useMemo(() => {
    if (!session) return null;
    const pkg = getPackageOrDefault(session.packageId);
    return {
      session,
      tasks,
      toast,
      setToast,
      pkg,
      firstName: session.fullName.split(" ")[0] || "Member",
      claimReady: canClaim(session),
      alreadyClaimed:
        session.claimedToday && session.lastClaimDate === todayKey(),
      day: cycleDay(session.cycleStartedAt),
      left: daysLeft(session.cycleStartedAt),
      biWeekly: hasBiWeekly(session),
      claimAmt: claimAmountFor(session),
      referralLink: `${window.location.origin}/register?ref=${encodeURIComponent(
        session.phone.replace(/\D/g, "").slice(-8) || "TVUSER",
      )}`,
      toggleTask,
      completeReferralTask,
      handleClaim,
      logout,
      requestWithdraw,
    } satisfies DashboardContextValue;
  }, [
    session,
    tasks,
    toast,
    toggleTask,
    completeReferralTask,
    handleClaim,
    logout,
    requestWithdraw,
  ]);

  if (!value) {
    return (
      <div className="dash-loading">
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
