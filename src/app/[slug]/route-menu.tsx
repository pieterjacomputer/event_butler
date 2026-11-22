"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const APPS = [
  ["google", "Google Maps"],
  ["waze", "Waze"],
  ["apple", "Apple Kaarten"],
] as const;

/**
 * One Route button; the guest picks their maps app from a small menu.
 * Every option goes through our own redirect, so the address is never in
 * this page. The menu closes again on a click or tap outside it, or Escape.
 */
export function RouteMenu({
  slug,
  partId,
  className,
}: {
  slug: string;
  partId: number;
  className: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function close(event: Event) {
      const details = ref.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") details.open = false;
        return;
      }
      if (!details.contains(event.target as Node)) details.open = false;
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary
        className={cn(
          "inline-flex cursor-pointer list-none items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors md:px-6 md:py-3 md:text-base [&::-webkit-details-marker]:hidden",
          className,
        )}
      >
        <Navigation className="size-4" aria-hidden />
        Route
        <ChevronDown
          className="size-4 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ul className="absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 overflow-hidden rounded-xl border bg-white text-left text-sm text-[#2B2140] shadow-xl">
        {APPS.map(([app, appLabel]) => (
          <li key={app}>
            <a
              href={`/${slug}/route/${partId}?app=${app}`}
              target="_blank"
              rel="nofollow noreferrer"
              data-track="route"
              className="block px-4 py-3 hover:bg-[#FBF3E4]"
              onClick={() => {
                if (ref.current) ref.current.open = false;
              }}
            >
              Openen in {appLabel}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
