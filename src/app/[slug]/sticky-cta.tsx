"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile only: the "Ik kom feesten" button stays fixed at the bottom of the
 * screen, so guests can sign up at any moment. It slides away while the
 * form itself is on screen.
 */
export function StickyCallToAction({ targetId }: { targetId: string }) {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-black/35 to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden motion-reduce:transition-none",
        formVisible && "pointer-events-none translate-y-full",
      )}
      aria-hidden={formVisible}
    >
      <a
        href={`#${targetId}`}
        data-track="cta"
        tabIndex={formVisible ? -1 : undefined}
        className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full border-4 border-white bg-gradient-to-r from-[#E4572E] to-[#E86A92] px-7 py-3 font-serif text-xl text-white shadow-xl focus-visible:ring-4 focus-visible:ring-[#F6C445] focus-visible:outline-none"
      >
        <PartyPopper className="size-6" aria-hidden />
        Ik kom feesten
      </a>
    </div>
  );
}
