"use client";

import { FormEvent, useState } from "react";

type CreatorFields = { name: string; email: string; phone: string; organization: string; contentType: string; projectDescription: string; preferredDates: string };
const emptyFields: CreatorFields = { name: "", email: "", phone: "", organization: "", contentType: "video", projectDescription: "", preferredDates: "" };
function getHubSpotCookie(): string | undefined { if (typeof document === "undefined") return undefined; const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/); return match?.[1]; }

export default function CreatorForm() {
  const [fields, setFields] = useState<CreatorFields>(emptyFields); const [error, setError] = useState<string | null>(null); const [success, setSuccess] = useState<string | null>(null); const [submitting, setSubmitting] = useState(false);
  function updateField<K extends keyof CreatorFields>(key: K, value: CreatorFields[K]) { setFields((c) => ({ ...c, [key]: value })); setError(null); setSuccess(null); }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(null); setSuccess(null); setSubmitting(true);
    try {
      const response = await fetch("/api/forms/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "creator", fields, hutk: getHubSpotCookie() }) });
      const data = await response.json() as { success?: boolean; error?: string; hubspot?: "submitted" | "failed" };
      console.info("[NBBL HubSpot] Creator form result", { hubspot: data.hubspot ?? "failed", httpStatus: response.status });
      if (data.hubspot === "submitted") console.info("[NBBL HubSpot] Creator form ADDED to HubSpot"); else console.error("[NBBL HubSpot] Creator form NOT added to HubSpot", { error: data.error });
      if (!response.ok || !data.success) throw new Error(data.error ?? "Unable to submit your request.");
      setSuccess("Request received. Our team will follow up about creator access shortly."); setFields(emptyFields);
    } catch (submitError) { console.error("[NBBL HubSpot] Creator form request failed", submitError); setError(submitError instanceof Error ? submitError.message : "Unable to submit your request."); }
    finally { setSubmitting(false); }
  }
  if (success) return <div className="form-message form-message-success">{success}</div>;
  return <form className="nbbl-form" onSubmit={handleSubmit}><div className="form-grid">
    <label className="form-field"><span>Name *</span><input value={fields.name} onChange={(e) => updateField("name", e.target.value)} required /></label>
    <label className="form-field"><span>Email *</span><input type="email" value={fields.email} onChange={(e) => updateField("email", e.target.value)} required /></label>
    <label className="form-field"><span>Phone *</span><input type="tel" value={fields.phone} onChange={(e) => updateField("phone", e.target.value)} required /></label>
    <label className="form-field"><span>Organization *</span><input value={fields.organization} onChange={(e) => updateField("organization", e.target.value)} required /></label>
    <label className="form-field"><span>Content type *</span><select value={fields.contentType} onChange={(e) => updateField("contentType", e.target.value)} required><option value="video">Video</option><option value="photo">Photo</option><option value="interview">Interview</option><option value="podcast">Podcast</option><option value="brand-activation">Brand activation</option><option value="commercial">Commercial</option></select></label>
    <label className="form-field"><span>Preferred dates</span><input value={fields.preferredDates} onChange={(e) => updateField("preferredDates", e.target.value)} /></label>
    <label className="form-field form-field-full"><span>Project description *</span><textarea rows={4} value={fields.projectDescription} onChange={(e) => updateField("projectDescription", e.target.value)} required /></label>
  </div>{error ? <div className="form-message form-message-error">{error}</div> : null}<button type="submit" className="btn primary" disabled={submitting}>{submitting ? "Submitting..." : "Request creator access"}</button></form>;
}
