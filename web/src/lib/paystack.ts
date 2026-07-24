type PaystackSuccess = {
  reference: string;
  status?: string;
  trans?: string;
  transaction?: string;
  message?: string;
};

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: PaystackSuccess) => void;
  onClose: () => void;
};

type PaystackPopInstance = {
  setup: (options: PaystackSetupOptions) => { openIframe: () => void };
};

declare global {
  interface Window {
    PaystackPop?: PaystackPopInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadPaystackScript() {
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-paystack="inline"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Paystack")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.dataset.paystack = "inline";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export function getPaystackPublicKey() {
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.trim() ?? "";
}

export async function openPaystackCheckout(options: {
  email: string;
  amountNaira: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (response: PaystackSuccess) => void;
  onClose: () => void;
}) {
  const key = getPaystackPublicKey();
  if (!key) {
    throw new Error("MISSING_KEY");
  }

  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error("Paystack failed to initialize");
  }

  const handler = window.PaystackPop.setup({
    key,
    email: options.email,
    amount: Math.round(options.amountNaira * 100),
    currency: "NGN",
    ref: options.reference,
    metadata: options.metadata,
    callback: options.onSuccess,
    onClose: options.onClose,
  });

  handler.openIframe();
}
