import { formatKickoffPartsInTimeZone } from "@/lib/timezone";

export type MatchStageMeta =
  | { kind: "group"; groupLetter: string; label: string }
  | { kind: "knockout"; label: string; shortLabel: string }
  | { kind: "other"; label: string };

export function isKnockoutStage(stage: string) {
  return !/^Group\s+[A-L]$/i.test(stage.trim());
}

export function parseMatchStage(stage: string): MatchStageMeta {
  const groupMatch = stage.match(/^Group\s+([A-L])$/i);

  if (groupMatch) {
    return {
      kind: "group",
      groupLetter: groupMatch[1].toUpperCase(),
      label: stage
    };
  }

  if (/round of 32/i.test(stage)) {
    return { kind: "knockout", label: stage, shortLabel: "Round of 32" };
  }

  if (/round of 16/i.test(stage)) {
    return { kind: "knockout", label: stage, shortLabel: "Round of 16" };
  }

  if (/quarter[- ]?final/i.test(stage)) {
    return { kind: "knockout", label: stage, shortLabel: "Quarter-final" };
  }

  if (/semi[- ]?final/i.test(stage)) {
    return { kind: "knockout", label: stage, shortLabel: "Semi-final" };
  }

  if (/third[- ]?place/i.test(stage)) {
    return { kind: "knockout", label: stage, shortLabel: "3rd place" };
  }

  if (/final/i.test(stage)) {
    return { kind: "knockout", label: stage, shortLabel: "Final" };
  }

  return { kind: "other", label: stage };
}

export function formatKickoffParts(kickoff: string, timeZone: string) {
  return formatKickoffPartsInTimeZone(kickoff, timeZone);
}

export function formatVenueShort(venue: string) {
  const parts = venue.split(",").map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }

  return venue;
}

export function getMatchTicketTone(statusLabel: string, badgeClass: string) {
  if (badgeClass.includes("urgent")) {
    return "urgent";
  }

  if (statusLabel === "Locked") {
    return "locked";
  }

  if (statusLabel === "Finished") {
    return "finished";
  }

  if (statusLabel === "Pick saved" || badgeClass.includes("today-ready") || badgeClass.includes("pick-saved")) {
    return "saved";
  }

  return "open";
}
