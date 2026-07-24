/** Persistent daily task for every member */
export const REFERRAL_TASK_ID = "referral";
export const REFERRAL_TASK_TITLE = "Share your referral link once";

export type TaskKind = "standard" | "referral";

export type DailyTask = {
  id: string;
  title: string;
  kind: TaskKind;
  done: boolean;
};

const ACTIONS = [
  "Review",
  "Confirm",
  "Check",
  "Read",
  "Open",
  "Verify",
  "Update",
  "Scan",
  "Note",
  "Compare",
  "Track",
  "Record",
  "Refresh",
  "Inspect",
  "Complete",
  "Acknowledge",
  "Validate",
  "Monitor",
  "Organize",
  "Summarize",
  "Mark",
  "Log",
  "Estimate",
  "Plan",
  "Set",
  "Save",
  "Review again",
  "Double-check",
  "Revisit",
  "Prepare",
  "Align",
  "Match",
  "Count",
  "List",
  "Flag",
  "Pin",
  "Highlight",
  "Clarify",
  "Confirm again",
  "Glance through",
  "Cross-check",
  "Reconfirm",
  "Tap into",
  "Look over",
  "Go through",
  "Walk through",
  "Skim",
  "Audit",
  "Balance-check",
  "Sync",
];

const TARGETS = [
  "your package details",
  "today’s claim amount",
  "your membership cycle day",
  "your available balance",
  "withdrawal minimum rules",
  "bi-weekly eligibility",
  "monthly withdrawal window",
  "your referral progress",
  "Elite package benefits",
  "Spark package summary",
  "Rise package summary",
  "Pulse package summary",
  "Prestige package notes",
  "Apex package overview",
  "daily task reminders",
  "Paystack payment confirmation",
  "your account phone number",
  "your profile email",
  "cycle days remaining",
  "month-end return target",
  "daily claim formula",
  "referral bonus rate",
  "10-referral unlock rule",
  "your active membership tier",
  "package entry fee",
  "claim history for today",
  "task completion progress",
  "dashboard home overview",
  "withdraw schedule notes",
  "security tips in account",
  "membership terms summary",
  "today’s activity checklist",
  "balance after last claim",
  "package comparison notes",
  "referral earnings examples",
  "Trustvee Elite guidelines",
  "phone-first dashboard tips",
  "payment reference record",
  "cycle start date",
  "next claim unlock status",
  "standard vs Elite windows",
  "minimum cashout amount",
  "daily rhythm reminders",
  "member support notes",
  "account safety checklist",
  "package return schedule",
  "referral count target",
  "withdraw readiness status",
  "today’s membership focus",
  "balance growth reminder",
];

const CONTEXTS = [
  "for today",
  "before claiming",
  "in your dashboard",
  "on this device",
  "carefully",
  "in under a minute",
  "with attention",
  "once this morning",
  "before evening claim",
  "as part of today’s loop",
  "to stay on track",
  "for your cycle",
  "without skipping details",
  "and stay consistent",
  "so your claim unlocks cleanly",
];

function buildTaskPool(): string[] {
  const pool: string[] = [];
  const seen = new Set<string>();

  for (const action of ACTIONS) {
    for (const target of TARGETS) {
      for (const context of CONTEXTS) {
        const title = `${action} ${target} ${context}`;
        if (seen.has(title)) continue;
        // Never collide with the persistent referral task
        if (title.toLowerCase().includes("referral link")) continue;
        seen.add(title);
        pool.push(title);
      }
    }
  }

  return pool;
}

export const TASK_POOL = buildTaskPool();

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickTwoIndices(seed: number, length: number): [number, number] {
  const first = seed % length;
  let second = (Math.imul(seed, 2654435761) >>> 0) % length;
  if (second === first) {
    second = (second + 1 + (seed % (length - 1))) % length;
  }
  return [first, second];
}

export function userTaskKey(session: {
  phone: string;
  email?: string;
  paymentReference?: string;
}) {
  return [
    session.phone.replace(/\D/g, ""),
    session.email?.toLowerCase() ?? "",
    session.paymentReference ?? "",
  ].join("|");
}

type StoredDay = {
  date: string;
  userKey: string;
  tasks: DailyTask[];
};

const DAY_KEY = "trustvee_daily_tasks";

export function loadOrCreateDailyTasks(
  userKey: string,
  date: string,
): DailyTask[] {
  try {
    const raw = sessionStorage.getItem(DAY_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as StoredDay;
      if (stored.date === date && stored.userKey === userKey && stored.tasks?.length === 3) {
        return stored.tasks;
      }
    }
  } catch {
    // fall through and recreate
  }

  const seed = hashSeed(`${userKey}:${date}:trustvee-tasks`);
  const [i1, i2] = pickTwoIndices(seed, TASK_POOL.length);

  const tasks: DailyTask[] = [
    {
      id: `std-${date}-a`,
      title: TASK_POOL[i1],
      kind: "standard",
      done: false,
    },
    {
      id: `std-${date}-b`,
      title: TASK_POOL[i2],
      kind: "standard",
      done: false,
    },
    {
      id: REFERRAL_TASK_ID,
      title: REFERRAL_TASK_TITLE,
      kind: "referral",
      done: false,
    },
  ];

  saveDailyTasks(userKey, date, tasks);
  return tasks;
}

export function saveDailyTasks(
  userKey: string,
  date: string,
  tasks: DailyTask[],
) {
  const payload: StoredDay = { date, userKey, tasks };
  sessionStorage.setItem(DAY_KEY, JSON.stringify(payload));
}

export function clearDailyTasks() {
  sessionStorage.removeItem(DAY_KEY);
}

export const TASK_POOL_SIZE = TASK_POOL.length;
