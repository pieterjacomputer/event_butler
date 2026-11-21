const TIME_ZONE = "Europe/Brussels";

const dateFormat = new Intl.DateTimeFormat("nl-BE", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("nl-BE", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "zaterdag 5 december 2026" */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** "15u00" (Belgian style) */
export function formatTime(date: Date): string {
  const parts = timeFormat.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  return `${hour}u${minute}`;
}

/** "15u00–20u00", or "21u00" without an end time */
export function formatTimeRange(start: Date, end: Date | null): string {
  return end ? `${formatTime(start)}–${formatTime(end)}` : formatTime(start);
}

/** "zaterdag 28 november 2026 om 23u59" */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} om ${formatTime(date)}`;
}

const shortDateFormat = new Intl.DateTimeFormat("nl-BE", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** "05/12/2026" */
export function formatShortDate(date: Date): string {
  return shortDateFormat.format(date);
}
