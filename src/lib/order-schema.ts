import { z } from "zod";

/** Shared between the browser (instant feedback) and the server (the real check). */
export const MAX_PORTIONS = 20;
export const MAX_PEOPLE = 30;

export const orderSchema = z
  .object({
    guestName: z
      .string()
      .trim()
      .min(1, "Vul je naam in.")
      .max(80, "Je naam mag maximaal 80 tekens zijn."),
    partIds: z
      .array(z.number().int().positive())
      .min(1, "Kies minstens één deel waarop je komt.")
      .max(10),
    /** Number of people per chosen part, keyed by part id. */
    people: z.record(
      z.string(),
      z
        .number({ error: "Vul een aantal personen in." })
        .int("Vul een heel getal in.")
        .min(1, "Minstens 1 persoon.")
        .max(MAX_PEOPLE, `Maximaal ${MAX_PEOPLE} personen.`),
    ),
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
  })
  .refine((input) => input.partIds.every((id) => String(id) in input.people), {
    message: "Vul het aantal personen in.",
    path: ["people"],
  });

export type OrderInput = z.infer<typeof orderSchema>;

function readNumbers(formData: FormData, prefix: string, empty: number) {
  const result: Record<string, number> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(prefix)) {
      const raw = String(value).trim();
      result[key.slice(prefix.length)] = raw === "" ? empty : Number(raw);
    }
  }
  return result;
}

/** Turns the submitted form into the shape the schema expects. */
export function parseOrderForm(formData: FormData) {
  const partIds = formData.getAll("partId").map((v) => Number(v));
  // Only the headcounts of the parts that are ticked count.
  const allPeople = readNumbers(formData, "people-", Number.NaN);
  const people = Object.fromEntries(
    partIds
      .filter((id) => String(id) in allPeople)
      .map((id) => [String(id), allPeople[String(id)]]),
  );
  return orderSchema.safeParse({
    guestName: String(formData.get("guestName") ?? ""),
    partIds,
    people,
    quantities: readNumbers(formData, "qty-", 0),
    note: String(formData.get("note") ?? ""),
  });
}

const FIELDS = [
  "guestName",
  "partIds",
  "people",
  "quantities",
  "note",
] as const;
type Field = (typeof FIELDS)[number];

export type FieldErrors = Partial<Record<Field, string>>;

/** The first error message per field, for showing next to the inputs. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (FIELDS.includes(field as Field) && !result[field as Field]) {
      result[field as Field] = issue.message;
    }
  }
  return result;
}

/** What the form shows again after a failed submit. */
export type OrderFormValues = {
  guestName: string;
  partIds: number[];
  people: Record<string, string>;
  quantities: Record<string, string>;
  note: string;
};

function readStrings(formData: FormData, prefix: string) {
  const result: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(prefix))
      result[key.slice(prefix.length)] = String(value);
  }
  return result;
}

export function formValuesFrom(formData: FormData): OrderFormValues {
  return {
    guestName: String(formData.get("guestName") ?? ""),
    partIds: formData.getAll("partId").map((v) => Number(v)),
    people: readStrings(formData, "people-"),
    quantities: readStrings(formData, "qty-"),
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
