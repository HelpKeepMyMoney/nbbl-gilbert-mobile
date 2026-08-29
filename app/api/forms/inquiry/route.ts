import { NextResponse } from "next/server";
import {
  getNbblSegment,
  isHubSpotConfigured,
  submitToHubSpot,
  toHubSpotFields,
} from "@/lib/hubspot";
import {
  getOptionalStringField,
  getStringField,
  parseJsonBody,
  requireFields,
  validateEmailField,
} from "@/lib/validation";

type InquiryBody = {
  kind?: "creator" | "fundraiser";
  fields?: Record<string, unknown>;
  hutk?: string;
};

export async function POST(request: Request) {
  const body = parseJsonBody<InquiryBody>(await request.json());
  if (!body?.kind || !body.fields) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isHubSpotConfigured(body.kind)) {
    console.error("[NBBL HubSpot] Inquiry rejected: not configured", { kind: body.kind });
    return NextResponse.json(
      {
        error:
          "HubSpot is not configured. Add portal and form IDs to .env.local, or email info@nobackboard.com.",
      },
      { status: 503 },
    );
  }

  const fields = body.fields;

  if (body.kind === "creator") {
    const missing = requireFields(fields, [
      "name",
      "email",
      "phone",
      "organization",
      "contentType",
      "projectDescription",
    ]);
    if (missing) {
      return NextResponse.json({ error: missing }, { status: 400 });
    }
  } else {
    const missing = requireFields(fields, [
      "organizationName",
      "contactName",
      "email",
      "phone",
    ]);
    if (missing) {
      return NextResponse.json({ error: missing }, { status: 400 });
    }
  }

  const emailError = validateEmailField(fields);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const hubspotFields =
    body.kind === "creator"
      ? toHubSpotFields({
          firstname: getStringField(fields, "name"),
          email: getStringField(fields, "email"),
          phone: getStringField(fields, "phone"),
          company: getStringField(fields, "organization"),
          content_type: getStringField(fields, "contentType"),
          project_description: getStringField(fields, "projectDescription"),
          preferred_dates: getOptionalStringField(fields, "preferredDates"),
          nbbl_segment: getNbblSegment("creator"),
        })
      : toHubSpotFields({
          company: getStringField(fields, "organizationName"),
          firstname: getStringField(fields, "contactName"),
          email: getStringField(fields, "email"),
          phone: getStringField(fields, "phone"),
          message: [
            getOptionalStringField(fields, "expectedClubs")
              ? `Expected participating clubs: ${getOptionalStringField(fields, "expectedClubs")}`
              : "",
            getOptionalStringField(fields, "preferredDates")
              ? `Preferred date window: ${getOptionalStringField(fields, "preferredDates")}`
              : "",
            getOptionalStringField(fields, "referralSource")
              ? `Referral source: ${getOptionalStringField(fields, "referralSource")}`
              : "",
            getOptionalStringField(fields, "notes")
              ? `Notes: ${getOptionalStringField(fields, "notes")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
          nbbl_segment: getNbblSegment("fundraiser"),
        });

  try {
    await submitToHubSpot(body.kind, hubspotFields, {
      hutk: body.hutk,
      pageUri: request.headers.get("referer") ?? undefined,
      pageName: "NBBL Gilbert",
    });
    console.info("[NBBL HubSpot] Inquiry submission confirmed", { kind: body.kind });
    return NextResponse.json({ success: true, hubspot: "submitted" });
  } catch (error) {
    console.error("[NBBL HubSpot] Inquiry submission failed", error);
    return NextResponse.json(
      { error: "Unable to submit your request right now. Please try again.", hubspot: "failed" },
      { status: 500 },
    );
  }
}
