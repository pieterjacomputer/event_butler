"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function CancelButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="destructive"
      disabled={pending}
      onClick={() => {
        if (
          window.confirm(
            "Weet je het zeker? Je inschrijving en bestelling worden verwijderd.",
          )
        ) {
          startTransition(() => action());
        }
      }}
    >
      {pending ? "Bezig…" : "Inschrijving annuleren"}
    </Button>
  );
}
