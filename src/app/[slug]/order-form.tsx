"use client";

import { useActionState, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_PORTIONS,
  parseOrderForm,
  toFieldErrors,
  type FieldErrors,
  type OrderFormState,
  type OrderFormValues,
} from "@/lib/order-schema";

type Part = { id: number; name: string; when: string };
type MenuItem = { id: number; name: string };

type Props = {
  action: (prev: OrderFormState, formData: FormData) => Promise<OrderFormState>;
  parts: Part[];
  menu: MenuItem[];
  initialValues?: OrderFormValues;
  submitLabel: string;
};

const EMPTY: OrderFormValues = {
  guestName: "",
  partIds: [],
  quantities: {},
  note: "",
};

export function OrderForm({
  action,
  parts,
  menu,
  initialValues,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? initialValues ?? EMPTY;
  // Re-mount the fields after a failed submit so they show what was sent.
  return (
    <OrderFields
      key={state.attempt ?? 0}
      formAction={formAction}
      pending={pending}
      parts={parts}
      menu={menu}
      values={values}
      serverError={state.error}
      serverFieldErrors={state.fieldErrors}
      submitLabel={submitLabel}
    />
  );
}

function OrderFields({
  formAction,
  pending,
  parts,
  menu,
  values,
  serverError,
  serverFieldErrors,
  submitLabel,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  parts: Part[];
  menu: MenuItem[];
  values: OrderFormValues;
  serverError?: string;
  serverFieldErrors?: FieldErrors;
  submitLabel: string;
}) {
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const errors = clientErrors ?? serverFieldErrors ?? {};
  const [quantities, setQuantities] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      menu.map((m) => [String(m.id), values.quantities[String(m.id)] ?? "0"]),
    ),
  );

  function step(id: number, delta: number) {
    setQuantities((q) => {
      const current = Number(q[String(id)]) || 0;
      const next = Math.min(MAX_PORTIONS, Math.max(0, current + delta));
      return { ...q, [String(id)]: String(next) };
    });
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(e) => {
        // Same schema as the server, for instant feedback.
        const result = parseOrderForm(new FormData(e.currentTarget));
        if (!result.success) {
          e.preventDefault();
          setClientErrors(toFieldErrors(result.error));
        } else {
          setClientErrors(null);
        }
      }}
      className="flex flex-col gap-6"
    >
      {serverError && !clientErrors && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="guestName">Naam</Label>
        <Input
          id="guestName"
          name="guestName"
          autoComplete="name"
          maxLength={80}
          defaultValue={values.guestName}
          aria-invalid={!!errors.guestName}
          placeholder="Bv. familie Janssens"
        />
        <FieldError message={errors.guestName} />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium">Kom je?</legend>
        {parts.map((part) => (
          <div key={part.id} className="flex items-start gap-3">
            <Checkbox
              id={`part-${part.id}`}
              name="partId"
              value={String(part.id)}
              defaultChecked={values.partIds.includes(part.id)}
              aria-invalid={!!errors.partIds}
              className="mt-0.5"
            />
            <Label
              htmlFor={`part-${part.id}`}
              className="flex flex-col items-start gap-0.5 font-normal"
            >
              <span className="font-medium">{part.name}</span>
              <span className="text-muted-foreground">{part.when}</span>
            </Label>
          </div>
        ))}
        <FieldError message={errors.partIds} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium">Spaghetti</legend>
        <p className="text-sm text-muted-foreground">
          Hoeveel porties wil je? Om 18u00 tijdens deel 1. Laat op 0 als je niet
          mee-eet.
        </p>
        {menu.map((item) => {
          const id = String(item.id);
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3"
            >
              <Label htmlFor={`qty-${id}`} className="font-normal">
                {item.name}
              </Label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Eén portie ${item.name} minder`}
                  onClick={() => step(item.id, -1)}
                >
                  <Minus />
                </Button>
                <Input
                  id={`qty-${id}`}
                  name={`qty-${id}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MAX_PORTIONS}
                  step={1}
                  value={quantities[id]}
                  onChange={(e) =>
                    setQuantities((q) => ({ ...q, [id]: e.target.value }))
                  }
                  aria-invalid={!!errors.quantities}
                  className="w-14 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Eén portie ${item.name} meer`}
                  onClick={() => step(item.id, 1)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          );
        })}
        <FieldError message={errors.quantities} />
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">Opmerking (optioneel)</Label>
        <Textarea
          id="note"
          name="note"
          maxLength={500}
          defaultValue={values.note}
          aria-invalid={!!errors.note}
          placeholder="Bv. allergieën"
        />
        <FieldError message={errors.note} />
      </div>

      {/* Honeypot against spam bots: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Bezig…" : submitLabel}
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
