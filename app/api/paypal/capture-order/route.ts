import { NextResponse } from "next/server";
import {
  getSessionPackage,
  SHOWCASE_PRODUCT,
} from "@/lib/catalog";
import { isHubSpotConfigured, submitToHubSpot, toHubSpotFields } from "@/lib/hubspot";
import { capturePayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import {
  getOptionalStringField,
  getStringField,
  parseJsonBody,
  requireFields,
  validateEmailField,
} from "@/lib/validation";

type CaptureOrderBody = {
  orderId?: string;
  kind?: "session" | "showcase";
  packageId?: string;
  fields?: Record<string, unknown>;
  hutk?: string;
};

function getExpectedAmountCents(kind: "session" | "showcase", packageId?: string) {
  if (kind === "showcase") {
    return SHOWCASE_PRODUCT.priceCents;
  }

  if (!packageId) {
    return null;
  }

  const sessionPackage = getSessionPackage(packageId);
  return sessionPackage?.priceCents ?? null;
}

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured. Add credentials to .env.local." },
      { status: 503 },
    );
  }

  const body = parseJsonBody<CaptureOrderBody>(await request.json());
  if (!body?.orderId || !body.kind || !body.fields) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const fields = body.fields;
  const packageId =
    body.kind === "session"
      ? getStringField(fields, "packageId") || body.packageId
      : undefined;

  if (body.kind === "session") {
    const missing = requireFields(fields, [
      "programName",
      "coachName",
      "email",
      "phone",
      "organizationType",
      "packageId",
    ]);
    if (missing) {
      return NextResponse.json({ error: missing }, { status: 400 });
    }
  } else {
    const missing = requireFields(fields, [
      "clubName",
      "coachName",
      "email",
      "phone",
      "athleteCount",
    ]);
    if (missing) {
      return NextResponse.json({ error: missing }, { status: 400 });
    }
  }

  const emailError = validateEmailField(fields);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const expectedAmountCents = getExpectedAmountCents(body.kind, packageId);
  if (expectedAmountCents === null) {
    return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
  }

  let capture;
  try {
    capture = await capturePayPalOrder(body.orderId);
  } catch (error) {
    console.error("PayPal capture-order failed:", error);
    return NextResponse.json(
      { error: "Unable to capture PayPal payment" },
      { status: 500 },
    );
  }

  if (capture.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Payment was not completed" },
      { status: 402 },
    );
  }

  if (capture.amountCents !== expectedAmountCents) {
    console.error("PayPal amount mismatch", {
      expectedAmountCents,
      capturedAmountCents: capture.amountCents,
      orderId: body.orderId,
    });
    return NextResponse.json(
      { error: "Payment amount does not match catalog price" },
      { status: 400 },
    );
  }

  const sessionPackage =
    body.kind === "session" && packageId
      ? getSessionPackage(packageId)
      : undefined;

  const hubspotFields = toHubSpotFields({
    firstname:
      body.kind === "session"
        ? getStringField(fields, "coachName")
        : getStringField(fields, "coachName"),
    email: getStringField(fields, "email"),
    phone: getStringField(fields, "phone"),
    program_name:
      body.kind === "session"
        ? getStringField(fields, "programName")
        : getStringField(fields, "clubName"),
    organization_type:
      body.kind === "session"
        ? getStringField(fields, "organizationType")
        : "club",
    package:
      body.kind === "session"
        ? sessionPackage?.name
        : SHOWCASE_PRODUCT.name,
    athlete_count: getStringField(fields, "athleteCount"),
    preferred_start: getOptionalStringField(fields, "preferredStart"),
    preferred_dates: getOptionalStringField(fields, "preferredDates"),
    notes: getOptionalStringField(fields, "notes"),
    payment_status: "paid",
    paypal_order_id: capture.orderId,
    amount_paid: (capture.amountCents / 100).toFixed(2),
  });

  let hubspotWarning: string | undefined;
  if (isHubSpotConfigured(body.kind)) {
    try {
      await submitToHubSpot(body.kind, hubspotFields, {
        hutk: body.hutk,
        pageUri: request.headers.get("referer") ?? undefined,
        pageName: "NBBL Gilbert",
      });
    } catch (error) {
      console.error("HubSpot submission after payment failed:", error);
      hubspotWarning =
        "Payment succeeded, but we could not save your registration automatically. Our team will follow up using your PayPal receipt.";
    }
  } else {
    hubspotWarning =
      "Payment succeeded. HubSpot is not configured yet, so please email info@nobackboard.com with your PayPal confirmation.";
  }

  return NextResponse.json({
    success: true,
    orderId: capture.orderId,
    warning: hubspotWarning,
  });
}
