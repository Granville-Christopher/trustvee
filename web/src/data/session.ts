import { getPackageOrDefault } from "./checkout";
import type { PackageId } from "./packages";
import { dailyClaim } from "./packages";

export type MemberSession = {
  fullName: string;
  phone: string;
  email: string;
  packageId: PackageId | string;
  referralCode?: string;
  paymentReference?: string;
  balance: number;
  claimedToday: boolean;
  tasksDoneToday: number;
  tasksTotal: number;
  referralCount: number;
  cycleStartedAt: string;
  lastClaimDate?: string;
};

const KEY = "trustvee_session";

export function saveSession(session: MemberSession) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): MemberSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MemberSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}

export function createSessionFromPayment(input: {
  fullName: string;
  phone: string;
  email: string;
  packageId: string;
  referralCode?: string;
  paymentReference?: string;
}): MemberSession {
  const pkg = getPackageOrDefault(input.packageId);
  return {
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    packageId: pkg.id,
    referralCode: input.referralCode,
    paymentReference: input.paymentReference,
    balance: 0,
    claimedToday: false,
    tasksDoneToday: 0,
    tasksTotal: 3,
    referralCount: 0,
    cycleStartedAt: new Date().toISOString(),
  };
}

export function cycleDay(startedAt: string) {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.min(30, Math.max(1, diff + 1));
}

export function daysLeft(startedAt: string) {
  return Math.max(0, 30 - cycleDay(startedAt) + 1);
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function canClaim(session: MemberSession) {
  if (session.claimedToday && session.lastClaimDate === todayKey()) {
    return false;
  }
  return session.tasksDoneToday >= session.tasksTotal;
}

export function claimAmountFor(session: MemberSession) {
  const pkg = getPackageOrDefault(session.packageId);
  return dailyClaim(pkg.returnAmount);
}

export function hasBiWeekly(session: MemberSession) {
  const pkg = getPackageOrDefault(session.packageId);
  return pkg.elite || session.referralCount >= 10;
}

/** Membership / Paystack payment start */
export function paymentDate(startedAt: string) {
  return new Date(startedAt);
}

/** Standard withdrawal unlock: 30 days after payment */
export function withdrawalDate(startedAt: string) {
  const d = new Date(startedAt);
  d.setDate(d.getDate() + 30);
  return d;
}

/** Next bi-weekly window (every 14 days from payment), capped by day 30 */
export function nextBiWeeklyDate(startedAt: string, now = new Date()) {
  const start = paymentDate(startedAt);
  const end = withdrawalDate(startedAt);
  const candidates: Date[] = [];
  for (let days = 14; days <= 30; days += 14) {
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    if (d.getTime() <= end.getTime()) candidates.push(d);
  }
  candidates.push(end);
  return (
    candidates.find((d) => d.getTime() > now.getTime()) ??
    candidates[candidates.length - 1]
  );
}

export function nextWithdrawDate(session: MemberSession, now = new Date()) {
  if (hasBiWeekly(session)) {
    return nextBiWeeklyDate(session.cycleStartedAt, now);
  }
  return withdrawalDate(session.cycleStartedAt);
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export type CountdownParts = {
  totalMs: number;
  expired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCountdownParts(target: Date, now = new Date()): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const expired = totalMs <= 0;
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { totalMs, expired, days, hours, minutes, seconds };
}
