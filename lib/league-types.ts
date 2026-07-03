export type LeagueSummary = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  inviteCode: string;
  isPaused: boolean;
  isHidden: boolean;
};

export type LeagueBranding = Pick<LeagueSummary, "slug" | "name" | "subtitle">;

export function normalizeInviteCode(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeLeagueSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
