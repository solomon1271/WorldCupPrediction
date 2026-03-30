export function isCronAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    throw new Error("CRON_SECRET is not configured.");
  }

  const authHeader = request.headers.get("authorization")?.trim();
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const url = new URL(request.url);
  const querySecret = url.searchParams.get("cronSecret")?.trim();
  if (querySecret === cronSecret) {
    return true;
  }

  return false;
}
