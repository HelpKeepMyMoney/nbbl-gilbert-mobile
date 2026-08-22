export type HubSpotField = { name: string; value: string };

export type InquiryKind = "creator" | "fundraiser";
export type PaidKind = "session" | "showcase";
export type FormKind = InquiryKind | PaidKind;

function getFormGuid(kind: FormKind): string | undefined {
  switch (kind) {
    case "session":
      return process.env.HUBSPOT_FORM_SESSIONS;
    case "showcase":
      return process.env.HUBSPOT_FORM_SHOWCASE;
    case "creator":
      return process.env.HUBSPOT_FORM_CREATOR;
    case "fundraiser":
      return process.env.HUBSPOT_FORM_FUNDRAISER;
    default:
      return undefined;
  }
}

export function isHubSpotConfigured(kind: FormKind): boolean {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = getFormGuid(kind);

  return Boolean(
    portalId &&
      formGuid &&
      !portalId.startsWith("YOUR_") &&
      !formGuid.startsWith("YOUR_"),
  );
}

export async function submitToHubSpot(
  kind: FormKind,
  fields: HubSpotField[],
  options?: { hutk?: string; pageUri?: string; pageName?: string },
): Promise<void> {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = getFormGuid(kind);

  if (!portalId || !formGuid) {
    throw new Error("HubSpot is not configured");
  }

  const body: Record<string, unknown> = { fields };

  if (options?.hutk || options?.pageUri || options?.pageName) {
    body.context = {
      ...(options.hutk ? { hutk: options.hutk } : {}),
      ...(options.pageUri ? { pageUri: options.pageUri } : {}),
      ...(options.pageName ? { pageName: options.pageName } : {}),
    };
  }

  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HubSpot submission failed: ${error}`);
  }
}

export function toHubSpotFields(
  record: Record<string, string | number | undefined>,
): HubSpotField[] {
  return Object.entries(record)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([name, value]) => ({ name, value: String(value) }));
}
