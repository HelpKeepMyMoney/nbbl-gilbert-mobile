"use client";

import { useEffect } from "react";
import { SMARTWAIVER_WIDGET_SRC } from "@/lib/waivers";

const WIDGET_SCRIPT_ID = "smartwaiver-widget";

function cleanupSmartWaiver() {
  document.getElementById(WIDGET_SCRIPT_ID)?.remove();
  document.getElementById("smartwaiver_floater")?.remove();
  document.getElementById("smartwaiver_iframe")?.remove();
  document
    .querySelectorAll('[class*="smartwaiver"], iframe[src*="smartwaiver"]')
    .forEach((element) => element.remove());
}

export default function SmartWaiverWidget() {
  useEffect(() => {
    if (document.getElementById(WIDGET_SCRIPT_ID)) {
      return cleanupSmartWaiver;
    }

    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = SMARTWAIVER_WIDGET_SRC;
    script.async = true;
    document.body.appendChild(script);

    return cleanupSmartWaiver;
  }, []);

  return null;
}
