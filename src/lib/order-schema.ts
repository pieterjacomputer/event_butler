import { z } from "zod";

/** Shared between the browser (instant feedback) and the server (the real check). */
export const MAX_PORTIONS = 20;

export const orderSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(1, "Vul je naam in.")
    .max(80, "Je naam mag maximaal 80 tekens zijn."),
  partIds: z
    .array(z.number().int().positive())
    .min(1, "Kies minstens één deel waarop je komt.")
    .max(10),
  quantities: z.record(
    z.string(),
    z
      .number({ error: "Vul een getal in." })
      .int("Vul een heel getal in.")
      .min(0, "Minimaal 0.")
      .max(MAX_PORTIONS, `Maximaal ${MAX_PORTIONS} porties.`),
  ),
  note: z
    .string()
    .trim()
    .max(500, "Je opmerking mag maximaal 500 tekens zijn."),
});

export type OrderInput = z.infer<typeof orderSchema>;

/** Turns the submitted form into the shape the schema expects. */
export function parseOrderForm(formData: FormData) {
  const quantities: Record<string, number> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("qty-")) {
      const raw = String(value).trim();
      quantities[key.slice(4)] = raw === "" ? 0 : Number(raw);
    }
  }
  return orderSchema.safeParse({
    guestName: String(formData.get("guestName") ?? ""),
    partIds: formData.getAll("partId").map((v) => Number(v)),
    quantities,
    note: String(formData.get("note") ?? ""),
  });
}

export type FieldErrors = Partial<
  Record<"guestName" | "partIds" | "quantities" | "note", string>
>;

/** The first error message per field, for showing next to the inputs. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "guestName" ||
        field === "partIds" ||
        field === "quantities" ||
        field === "note") &&
      !result[field]
    ) {
      result[field] = issue.message;
    }
  }
  return result;
}

/** What the form shows again after a failed submit. */
export type OrderFormValues = {
  guestName: string;
  partIds: number[];
  quantities: Record<string, string>;
  note: string;
};

export function formValuesFrom(formData: FormData): OrderFormValues {
  const quantities: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("qty-")) quantities[key.slice(4)] = String(value);
  }
  return {
    guestName: String(formData.get("guestName") ?? ""),
    partIds: formData.getAll("partId").map((v) => Number(v)),
    quantities,
    note: String(formData.get("note") ?? ""),
  };
}

export type OrderFormState = {
  error?: string;
  fieldErrors?: FieldErrors;
  values?: OrderFormValues;
  /** Changes on every failed submit so the form re-mounts with `values`. */
  attempt?: number;
};
