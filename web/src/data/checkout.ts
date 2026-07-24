import type { PackageId } from "./packages";
import { packages } from "./packages";

export type CheckoutDraft = {
  fullName: string;
  phone: string;
  email: string;
  packageId: PackageId | string;
  referralCode?: string;
};

const STORAGE_KEY = "trustvee_checkout";

export function saveCheckoutDraft(draft: CheckoutDraft) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadCheckoutDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getPackageOrDefault(packageId: string) {
  return packages.find((p) => p.id === packageId) ?? packages[0];
}

export function makePaymentReference(packageId: string) {
  return `TVE_${packageId}_${Date.now()}`;
}
