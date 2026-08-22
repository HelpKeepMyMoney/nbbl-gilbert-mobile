"use client";

import { FormEvent, useState } from "react";

type FundraiserFields = {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  expectedClubs: string;
  preferredDates: string;
  referralSource: string;
  notes: string;
};

const emptyFields: FundraiserFields = {
  organizationName: "",
  contactName: "",
  email: "",
  phone: "",
  expectedClubs: "",
  preferredDates: "",
  referralSource: "",
  notes: "",
};

function getHubSpotCookie(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match?.[1];
}

export default function FundraiserForm() {
  const [fields, setFields] = useState<FundraiserFields>(emptyFields);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FundraiserFields>(
    key: K,
    value: FundraiserFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/forms/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "fundraiser",
          fields,
          hutk: getHubSpotCookie(),
        }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to submit your request.");
      }

      setSuccess(
        "Inquiry received. Our team will follow up about your fundraiser event.",
      );
      setFields(emptyFields);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <div className="form-message form-message-success">{success}</div>;
  }

  return (
    <form className="nbbl-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>Club / organization name *</span>
          <input
            value={fields.organizationName}
            onChange={(event) => updateField("organizationName", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Contact name *</span>
          <input
            value={fields.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
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
          <span>Expected participating clubs</span>
          <input
            value={fields.expectedClubs}
            onChange={(event) => updateField("expectedClubs", event.target.value)}
            placeholder="e.g. 4 clubs"
          />
        </label>
        <label className="form-field">
          <span>Preferred date window</span>
          <input
            value={fields.preferredDates}
            onChange={(event) => updateField("preferredDates", event.target.value)}
          />
        </label>
        <label className="form-field form-field-full">
          <span>How did you hear about NBBL?</span>
          <input
            value={fields.referralSource}
            onChange={(event) => updateField("referralSource", event.target.value)}
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

      {error ? <div className="form-message form-message-error">{error}</div> : null}

      <button type="submit" className="btn primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit fundraiser inquiry"}
      </button>
    </form>
  );
}
