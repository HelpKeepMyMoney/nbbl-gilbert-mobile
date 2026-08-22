"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: { layout?: string; color?: string; shape?: string; label?: string };
        createOrder?: () => Promise<string>;
        onApprove?: (data: { orderID: string }) => Promise<void>;
        onError?: (error: unknown) => void;
      }) => { render: (container: HTMLElement) => Promise<void> };
    };
  }
}

type PayPalCheckoutProps = {
  kind: "session" | "showcase";
  fields: Record<string, string>;
  packageId?: string;
  disabled?: boolean;
  onSuccess: (warning?: string) => void;
  onError: (message: string) => void;
};

function getHubSpotCookie(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match?.[1];
}

export default function PayPalCheckout({
  kind,
  fields,
  packageId,
  disabled = false,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId || clientId.startsWith("YOUR_")) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-paypal-sdk="true"]',
    );

    if (existingScript) {
      if (window.paypal) {
        setReady(true);
      } else {
        existingScript.addEventListener("load", () => setReady(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.onload = () => setReady(true);
    script.onerror = () => onError("Unable to load PayPal checkout.");
    document.body.appendChild(script);
  }, [clientId, onError]);

  useEffect(() => {
    if (!ready || !containerRef.current || !window.paypal || disabled) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        },
        createOrder: async () => {
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind,
              packageId,
              fields: packageId ? { ...fields, packageId } : fields,
            }),
          });

          const data = (await response.json()) as {
            orderId?: string;
            error?: string;
          };

          if (!response.ok || !data.orderId) {
            throw new Error(data.error ?? "Unable to create PayPal order.");
          }

          return data.orderId;
        },
        onApprove: async (data) => {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderID,
              kind,
              packageId,
              fields: packageId ? { ...fields, packageId } : fields,
              hutk: getHubSpotCookie(),
            }),
          });

          const result = (await response.json()) as {
            success?: boolean;
            warning?: string;
            error?: string;
          };

          if (!response.ok || !result.success) {
            throw new Error(result.error ?? "Payment capture failed.");
          }

          onSuccess(result.warning);
        },
        onError: (error) => {
          console.error("PayPal button error:", error);
          onError("PayPal checkout failed. Please try again.");
        },
      })
      .render(container);
  }, [ready, kind, fields, packageId, disabled, onSuccess, onError]);

  if (!clientId || clientId.startsWith("YOUR_")) {
    return (
      <p className="form-note form-note-warning">
        PayPal is not configured yet. Email{" "}
        <a href="mailto:info@nbblgilbert.com">info@nbblgilbert.com</a> to complete
        your request.
      </p>
    );
  }

  return (
    <div className="paypal-checkout">
      <div ref={containerRef} />
      {disabled ? (
        <p className="form-note">Complete the required fields to enable payment.</p>
      ) : null}
    </div>
  );
}
