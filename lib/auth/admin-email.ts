export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isConfiguredAdminEmail(email: string) {
  const configured = process.env.ADMIN_EMAIL;

  if (!configured) {
    return false;
  }

  return normalizeEmail(configured) === normalizeEmail(email);
}
