export const PURPOSES = [
  "GBM",
  "Workshop",
  "Meeting",
  "Seminar",
  "Event",
  "Practice",
  "Other",
] as const;

export type Purpose = (typeof PURPOSES)[number];

export const EMAIL_DOMAIN = "campus.local";

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}

/** "14:00:00" | "14:00" -> "2:00 PM" */
export function formatTime(value: string) {
  const [hStr, mStr] = value.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr ?? "00"} ${suffix}`;
}

export function formatRange(start: string, end: string) {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function toHHMM(value: string) {
  return value.slice(0, 5);
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {

    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function todayISO() {
  const now = new Date();
  return toISODate(now);
}

export function toISODate(date: Date) {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function minutesBetween(start: string, end: string) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };
  return toMin(end) - toMin(start);
}

/**
 * Rooms that only specific organizations may book. Every other organization
 * still sees the room in the venue picker, but greyed out and unselectable.
 */
export const RESTRICTED_VENUES: Record<string, readonly string[]> = {
  L1: ["NCC", "NSS"],
  L2: ["NCC", "NSS"],
  L3: ["NCC", "NSS"],
  L8: ["NCC", "NSS"],
  L9: ["NCC", "NSS"],
};

export function venueAllowedFor(venueCode: string, orgAbbreviation?: string | null) {
  const allowed = RESTRICTED_VENUES[venueCode];
  if (!allowed) return true;
  if (!orgAbbreviation) return false;
  return allowed.includes(orgAbbreviation.toUpperCase());
}

export function restrictedVenueNote(venueCode: string) {
  const allowed = RESTRICTED_VENUES[venueCode];
  return allowed ? `${venueCode} is reserved for ${allowed.join(" and ")} only` : "";
}
