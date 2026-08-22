import { NextResponse } from "next/server";
import {
  getSessionPackage,
  SHOWCASE_PRODUCT,
  formatPriceDecimal,
} from "@/lib/catalog";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import {
  getStringField,
  parseJsonBody,
  requireFields,
  validateEmailField,
} from "@/lib/validation";

type CreateOrderBody = {
  kind?: "session" | "showcase";
  packageId?: string;
  fields?: Record<string, unknown>;
};

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured. Add credentials to .env.local." },
      { status: 503 },
    );
  }

  const body = parseJsonBody<CreateOrderBody>(await request.json());
  if (!body?.kind || !body.fields) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const fields = body.fields;

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

    const emailError = validateEmailField(fields);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const packageId = getStringField(fields, "packageId");
    const sessionPackage = getSessionPackage(packageId);
    if (!sessionPackage) {
      return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
    }

    try {
      const orderId = await createPayPalOrder(
        sessionPackage.priceCents,
        sessionPackage.name,
      );
      return NextResponse.json({
        orderId,
        amount: formatPriceDecimal(sessionPackage.priceCents),
        label: sessionPackage.name,
      });
    } catch (error) {
      console.error("PayPal create-order (session) failed:", error);
      return NextResponse.json(
        { error: "Unable to create PayPal order" },
        { status: 500 },
      );
    }
  }

  if (body.kind === "showcase") {
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

    const emailError = validateEmailField(fields);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const athleteCount = Number(getStringField(fields, "athleteCount"));
    if (!Number.isFinite(athleteCount) || athleteCount < 1 || athleteCount > 8) {
      return NextResponse.json(
        { error: "Athlete count must be between 1 and 8" },
        { status: 400 },
      );
    }

    try {
      const orderId = await createPayPalOrder(
        SHOWCASE_PRODUCT.priceCents,
        SHOWCASE_PRODUCT.name,
      );
      return NextResponse.json({
        orderId,
        amount: formatPriceDecimal(SHOWCASE_PRODUCT.priceCents),
        label: SHOWCASE_PRODUCT.name,
      });
    } catch (error) {
      console.error("PayPal create-order (showcase) failed:", error);
      return NextResponse.json(
        { error: "Unable to create PayPal order" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ error: "Invalid order kind" }, { status: 400 });
}
