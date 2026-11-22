"use client";

import { useActionState, useState } from "react";
import { Minus, PartyPopper, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_PEOPLE,
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
  /** Show a party popper on the button that pops when the form is sent. */
  celebrate?: boolean;
};

const EMPTY: OrderFormValues = {
  guestName: "",
  partIds: [],
  people: {},
  quantities: {},
  note: "",
};

export function OrderForm({
  action,
  parts,
  menu,
  initialValues,
  submitLabel,
  celebrate = false,
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
      celebrate={celebrate}
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
  celebrate,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  parts: Part[];
  menu: MenuItem[];
  values: OrderFormValues;
  serverError?: string;
  serverFieldErrors?: FieldErrors;
  submitLabel: string;
  celebrate: boolean;
}) {
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  // Increases on every valid submit, to (re)start the popper animation.
  const [pops, setPops] = useState(0);
  const errors = clientErrors ?? serverFieldErrors ?? {};
  const [quantities, setQuantities] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      menu.map((m) => [String(m.id), values.quantities[String(m.id)] ?? "0"]),
    ),
  );

  // Which parts are ticked: the headcount field shows only for those.
  const [checked, setChecked] = useState<Set<number>>(
    () => new Set(values.partIds),
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
          setPops((n) => n + 1);
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
          placeholder="Je naam"
        />
        <FieldError message={errors.guestName} />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium">Kom je?</legend>
        {parts.map((part) => {
          const isChecked = checked.has(part.id);
          return (
            <div key={part.id} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`part-${part.id}`}
                  name="partId"
                  value={String(part.id)}
                  checked={isChecked}
                  onCheckedChange={(value) =>
                    setChecked((prev) => {
                      const next = new Set(prev);
                      if (value === true) next.add(part.id);
                      else next.delete(part.id);
                      return next;
                    })
                  }
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
              {isChecked && (
                <div className="ml-7 flex items-center gap-3">
                  <Label
                    htmlFor={`people-${part.id}`}
                    className="font-normal text-muted-foreground"
                  >
                    Met hoeveel personen?
                  </Label>
                  <Input
                    id={`people-${part.id}`}
                    name={`people-${part.id}`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_PEOPLE}
                    step={1}
                    defaultValue={values.people[String(part.id)] ?? "1"}
                    aria-invalid={!!errors.people}
                    className="w-16 text-center"
                  />
                </div>
              )}
            </div>
          );
        })}
        <FieldError message={errors.partIds} />
        <FieldError message={errors.people} />
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
          placeholder="Laat een berichtje achter"
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
        {celebrate && <Popper pops={pops} />}
        {pending ? "Bezig…" : submitLabel}
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

const POPPER_PIECES = [
  { dx: "-14px", dy: "-16px", color: "#F6C445" },
  { dx: "-4px", dy: "-20px", color: "#E86A92" },
  { dx: "8px", dy: "-18px", color: "#4FB3A9" },
  { dx: "16px", dy: "-8px", color: "#F2994A" },
  { dx: "-16px", dy: "-4px", color: "#B98CF0" },
];

/**
 * Party popper icon. On submit it gives a small pop and a few dots of
 * confetti; nothing moves for people who prefer reduced motion.
 */
function Popper({ pops }: { pops: number }) {
  return (
    <span key={pops} className="relative inline-flex">
      <PartyPopper
        className={
          pops > 0
            ? "size-5 motion-safe:animate-[popper-pop_600ms_ease-out]"
            : "size-5"
        }
        aria-hidden
      />
      {pops > 0 &&
        POPPER_PIECES.map((piece, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 size-1.5 rounded-full opacity-0 motion-safe:animate-[popper-confetti_700ms_ease-out_forwards]"
            style={
              {
                backgroundColor: piece.color,
                "--dx": piece.dx,
                "--dy": piece.dy,
                animationDelay: `${60 + i * 30}ms`,
              } as React.CSSProperties
            }
          />
        ))}
    </span>
  );
}
