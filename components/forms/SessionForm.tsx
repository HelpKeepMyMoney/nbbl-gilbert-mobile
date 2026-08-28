"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SESSION_PACKAGES } from "@/lib/catalog";
import PayPalCheckout from "./PayPalCheckout";

type SessionFormProps = {
  initialPackageId?: string;
};

type SessionFields = {
  programName: string;
  coachName: string;
  email: string;
  phone: string;
  organizationType: string;
  packageId: string;
  athleteCount: string;
  preferredStart: string;
  notes: string;
};

const emptyFields: SessionFields = {
  programName: "",
  coachName: "",
  email: "",
  phone: "",
  organizationType: "school",
  packageId: SESSION_PACKAGES[0].id,
  athleteCount: "",
  preferredStart: "",
  notes: "",
};

function getHubSpotCookie(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match?.[1];
}

export default function SessionForm({ initialPackageId }: SessionFormProps) {
  const [fields, setFields] = useState<SessionFields>({
    ...emptyFields,
    packageId: initialPackageId ?? SESSION_PACKAGES[0].id,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentWarning, setPaymentWarning] = useState<string | undefined>();

  useEffect(() => {
    if (initialPackageId) {
      setFields((current) => ({ ...current, packageId: initialPackageId }));
    }
  }, [initialPackageId]);

  const selectedPackage = useMemo(
    () => SESSION_PACKAGES.find((pkg) => pkg.id === fields.packageId),
    [fields.packageId],
  );

  function updateField<K extends keyof SessionFields>(key: K, value: SessionFields[K]) {
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
      !fields.programName ||
      !fields.coachName ||
      !fields.email ||
      !fields.phone ||
      !fields.organizationType ||
      !fields.packageId
    ) {
      setError("Please complete all required fields before continuing to payment.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/forms/paid-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "session",
          packageId: fields.packageId,
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
          <span>Program name *</span>
          <input
            value={fields.programName}
            onChange={(event) => updateField("programName", event.target.value)}
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
          <span>Organization type *</span>
          <select
            value={fields.organizationType}
            onChange={(event) => updateField("organizationType", event.target.value)}
            required
          >
            <option value="school">School</option>
            <option value="club">Club</option>
          </select>
        </label>
        <label className="form-field">
          <span>Package *</span>
          <select
            value={fields.packageId}
            onChange={(event) => updateField("packageId", event.target.value)}
            required
          >
            {SESSION_PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — ${(pkg.priceCents / 100).toLocaleString()}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Athlete count</span>
          <input
            type="number"
            min={1}
            max={18}
            value={fields.athleteCount}
            onChange={(event) => updateField("athleteCount", event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Preferred start</span>
          <input
            value={fields.preferredStart}
            onChange={(event) => updateField("preferredStart", event.target.value)}
            placeholder="e.g. September 2026"
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

      {selectedPackage ? (
        <p className="form-summary">
          Selected package: <strong>{selectedPackage.name}</strong> — $
          {(selectedPackage.priceCents / 100).toLocaleString()}
        </p>
      ) : null}

      {error ? <div className="form-message form-message-error">{error}</div> : null}

      {!showPayment || !paymentUrl || !selectedPackage ? (
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? "Preparing payment…" : "Continue to payment"}
        </button>
      ) : (
        <PayPalCheckout
          paymentUrl={paymentUrl}
          label={selectedPackage.name}
          amountLabel={`$${(selectedPackage.priceCents / 100).toLocaleString()}`}
          warning={paymentWarning}
        />
      )}
    </form>
  );
}
