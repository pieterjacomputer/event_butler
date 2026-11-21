"use client";

import { useActionState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DeleteAllState } from "./actions";

/** Deletes one sign-up after a confirmation dialog. */
export function DeleteSignupButton({
  guestName,
  action,
}: {
  guestName: string;
  action: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      aria-label={`Inschrijving van ${guestName} verwijderen`}
      title="Verwijderen"
      onClick={() => {
        if (
          window.confirm(
            `Inschrijving van ${guestName} definitief verwijderen? Dit kan niet ongedaan worden.`,
          )
        ) {
          startTransition(() => action());
        }
      }}
    >
      <Trash2 className="size-4 text-destructive" aria-hidden />
    </Button>
  );
}

/** Deletes all guest data of the event; requires typing the event title. */
export function DeleteAllForm({
  title,
  count,
  action,
}: {
  title: string;
  count: number;
  action: (prev: DeleteAllState, formData: FormData) => Promise<DeleteAllState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `${count === 1 ? "De enige inschrijving" : `Alle ${count} inschrijvingen`} definitief verwijderen? Dit kan niet ongedaan worden.`,
          )
        ) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-3"
    >
      <Label htmlFor="confirmTitle" className="font-normal">
        Typ <strong className="font-semibold">{title}</strong> om te bevestigen
      </Label>
      <div className="flex flex-wrap gap-2">
        <Input
          id="confirmTitle"
          name="confirmTitle"
          autoComplete="off"
          className="max-w-xs"
          aria-invalid={!!state.error}
        />
        <Button
          type="submit"
          variant="destructive"
          disabled={pending || count === 0}
        >
          {pending ? "Bezig…" : "Alle gastgegevens verwijderen"}
        </Button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
