"use client";

import { FormEvent, useState } from "react";
import { SHOWCASE_PRODUCT } from "@/lib/catalog";
import PayPalCheckout from "./PayPalCheckout";

type ShowcaseFields = {
  clubName: string;
  coachName: string;
  email: string;
  phone: string;
  athleteCount: string;
  preferredDates: string;
  notes: string;
};

const emptyFields: ShowcaseFields = {
  clubName: "",
  coachName: "",
  email: "",
  phone: "",
  athleteCount: "",
  preferredDates: "",
  notes: "",
};

function getHubSpotCookie(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match?.[1];
}

export default function ShowcaseForm() {
  const [fields, setFields] = useState<ShowcaseFields>(emptyFields);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentWarning, setPaymentWarning] = useState<string | undefined>();

  function updateField<K extends keyof ShowcaseFields>(key: K, value: ShowcaseFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setError(null);
    setSuccess(null);
    setShowPayment(false);
    setPaymentUrl(null);
    setPaymentWarning(undefined);
  }

  async function handleContinue(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !fields.clubName ||
      !fields.coachName ||
      !fields.email ||
      !fields.phone ||
      !fields.athleteCount
    ) {
      setError("Please complete all required fields before continuing to payment.");
      return;
    }

    const athleteCount = Number(fields.athleteCount);
    if (!Number.isFinite(athleteCount) || athleteCount < 1 || athleteCount > 8) {
      setError("Athlete count must be between 1 and 8.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/forms/paid-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "showcase",
          fields,
          hutk: getHubSpotCookie(),
        }),
      });

      const data = (await response.json()) as {
        paymentUrl?: string;
        warning?: string;
        error?: string;
      };

      if (!response.ok || !data.paymentUrl) {
        throw new Error(
          data.error ??
            "PayPal is not configured yet. Email info@nobackboard.com to complete your request.",
        );
      }

      setPaymentUrl(data.paymentUrl);
      setPaymentWarning(data.warning);
      setShowPayment(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to continue to payment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <div className="form-message form-message-success">{success}</div>;
  }

  return (
    <form className="nbbl-form" onSubmit={handleContinue}>
      <div className="form-grid">
        <label className="form-field">
          <span>Club name *</span>
          <input
            value={fields.clubName}
            onChange={(event) => updateField("clubName", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Coach name *</span>
          <input
            value={fields.coachName}
            onChange={(event) => updateField("coachName", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Email *</span>
          <input
            type="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Phone *</span>
          <input
            type="tel"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Athlete count *</span>
          <input
            type="number"
            min={1}
            max={8}
            value={fields.athleteCount}
            onChange={(event) => updateField("athleteCount", event.target.value)}
            required
          />
          <small>Up to 8 participating athletes per club.</small>
        </label>
        <label className="form-field">
          <span>Preferred date window</span>
          <input
            value={fields.preferredDates}
            onChange={(event) => updateField("preferredDates", event.target.value)}
            placeholder="e.g. Fall 2026"
          />
        </label>
        <label className="form-field form-field-full">
          <span>Notes</span>
          <textarea
            rows={4}
            value={fields.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </label>
      </div>

      <p className="form-summary">
        Showcase entry: <strong>{SHOWCASE_PRODUCT.name}</strong> — $
        {(SHOWCASE_PRODUCT.priceCents / 100).toLocaleString()}
      </p>

      {error ? <div className="form-message form-message-error">{error}</div> : null}

      {!showPayment || !paymentUrl ? (
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? "Preparing payment…" : "Continue to payment"}
        </button>
      ) : (
        <PayPalCheckout
          paymentUrl={paymentUrl}
          label={SHOWCASE_PRODUCT.name}
          amountLabel={`$${(SHOWCASE_PRODUCT.priceCents / 100).toLocaleString()}`}
          warning={paymentWarning}
        />
      )}
    </form>
  );
}
