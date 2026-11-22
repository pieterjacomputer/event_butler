"use client";

import { useEffect, useRef } from "react";

type Kind = "view" | "cta" | "route";

/** Turns document.referrer into a coarse category; never the full URL. */
function referrerCategory(): string {
  const raw = document.referrer;
  if (!raw) return "direct";
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  if (host === location.hostname) return "direct";
  if (host.includes("whatsapp") || host === "wa.me") return "whatsapp";
  if (host.includes("messenger")) return "messenger";
  if (
    host.includes("facebook") ||
    host === "fb.com" ||
    host.endsWith(".fb.com")
  )
    return "facebook";
  if (host.includes("instagram")) return "instagram";
  if (/(^|\.)(mail|outlook|gmail)\.|proton|yahoo/.test(host)) return "email";
  if (/(^|\.)google\./.test(host)) return "google";
  return "andere";
}

/**
 * Sends one anonymous page visit, plus clicks on elements marked with
 * data-track="cta" or data-track="route". No cookies or local storage.
 */
export function VisitBeacon({ slug }: { slug: string }) {
  const sent = useRef(false);

  useEffect(() => {
    const referrer = referrerCategory();
    const send = (kind: Kind) => {
      const body = JSON.stringify({ slug, kind, referrer });
      const blob = new Blob([body], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/visit", blob)) {
        void fetch("/api/visit", {
          method: "POST",
          body,
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }
    };

    if (!sent.current) {
      sent.current = true;
      send("view");
    }

    function onClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest("[data-track]");
      const kind = target?.getAttribute("data-track");
      if (kind === "cta" || kind === "route") send(kind);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [slug]);

  return null;
}
