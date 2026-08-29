import { NextResponse } from "next/server";
import { getPayPalPaymentLink, getSessionPackage, SHOWCASE_PRODUCT, formatPriceDecimal } from "@/lib/catalog";
import { getNbblSegment, isHubSpotConfigured, submitToHubSpot, toHubSpotFields } from "@/lib/hubspot";
import { getOptionalStringField, getStringField, parseJsonBody, requireFields, validateEmailField } from "@/lib/validation";

type PaidIntentBody = { kind?: "session" | "showcase"; packageId?: string; fields?: Record<string, unknown>; hutk?: string };
type HubSpotDiagnostic = { status: number; responseBody: string; contentType?: string };

export async function POST(request: Request) {
  const body = parseJsonBody<PaidIntentBody>(await request.json());
  if (!body?.kind || !body.fields) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  const fields = body.fields;

  if (body.kind === "session") {
    const missing = requireFields(fields, ["programName", "coachName", "email", "phone", "organizationType", "packageId"]);
    if (missing) return NextResponse.json({ error: missing }, { status: 400 });
    const emailError = validateEmailField(fields);
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });
    const packageId = getStringField(fields, "packageId") || body.packageId || "";
    const sessionPackage = getSessionPackage(packageId);
    if (!sessionPackage) return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
    const paymentUrl = getPayPalPaymentLink(sessionPackage.id);
    if (!paymentUrl) return NextResponse.json({ error: "PayPal payment link is not configured for this package. Email info@nobackboard.com to complete your request." }, { status: 503 });
    const hubspotResult = await submitPaidLead({ kind: "session", fields, packageName: sessionPackage.name, hutk: body.hutk, pageUri: request.headers.get("referer") ?? undefined });
    return NextResponse.json({ paymentUrl, label: sessionPackage.name, amount: formatPriceDecimal(sessionPackage.priceCents), warning: hubspotResult.warning, hubspot: hubspotResult.status, hubspotDiagnostic: hubspotResult.diagnostic });
  }

  if (body.kind === "showcase") {
    const missing = requireFields(fields, ["clubName", "coachName", "email", "phone", "athleteCount"]);
    if (missing) return NextResponse.json({ error: missing }, { status: 400 });
    const emailError = validateEmailField(fields);
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });
    const athleteCount = Number(getStringField(fields, "athleteCount"));
    if (!Number.isFinite(athleteCount) || athleteCount < 1 || athleteCount > 8) return NextResponse.json({ error: "Athlete count must be between 1 and 8" }, { status: 400 });
    const paymentUrl = getPayPalPaymentLink(SHOWCASE_PRODUCT.id);
    if (!paymentUrl) return NextResponse.json({ error: "PayPal payment link is not configured for showcase entry. Email info@nobackboard.com to complete your request." }, { status: 503 });
    const hubspotResult = await submitPaidLead({ kind: "showcase", fields, packageName: SHOWCASE_PRODUCT.name, hutk: body.hutk, pageUri: request.headers.get("referer") ?? undefined });
    return NextResponse.json({ paymentUrl, label: SHOWCASE_PRODUCT.name, amount: formatPriceDecimal(SHOWCASE_PRODUCT.priceCents), warning: hubspotResult.warning, hubspot: hubspotResult.status, hubspotDiagnostic: hubspotResult.diagnostic });
  }

  return NextResponse.json({ error: "Invalid order kind" }, { status: 400 });
}

async function submitPaidLead({ kind, fields, packageName, hutk, pageUri }: { kind: "session" | "showcase"; fields: Record<string, unknown>; packageName: string; hutk?: string; pageUri?: string }): Promise<{ status: "submitted" | "failed"; warning?: string; diagnostic?: HubSpotDiagnostic }> {
  const notes = getOptionalStringField(fields, "notes");
  const hubspotFields = toHubSpotFields({
    firstname: getStringField(fields, "coachName"),
    email: getStringField(fields, "email"),
    phone: getStringField(fields, "phone"),
    program_name: kind === "session" ? getStringField(fields, "programName") : getStringField(fields, "clubName"),
    organization_type: kind === "session" ? getStringField(fields, "organizationType") : "club",
    package: packageName,
    athlete_count: getStringField(fields, "athleteCount"),
    preferred_dates: getOptionalStringField(fields, "preferredDates"),
    message: notes,
    nbbl_segment: getNbblSegment(kind),
  });

  if (!isHubSpotConfigured(kind)) {
    console.error("[NBBL HubSpot] Paid form not configured", { kind });
    return { status: "failed", warning: "HubSpot is not configured. The form was not added to HubSpot." };
  }

  try {
    const result = await submitToHubSpot(kind, hubspotFields, { hutk, pageUri, pageName: "NBBL Gilbert" });
    return { status: "submitted", diagnostic: { status: result.status, responseBody: result.responseBody, contentType: result.contentType } };
  } catch (error) {
    console.error("[NBBL HubSpot] Paid submission failed", error);
    return { status: "failed", warning: "We could not save your registration in HubSpot. Please do not assume your registration was recorded." };
  }
}
