import { SignJWT, jwtVerify } from "jose";

import {
  SESSION_IDLE_SECONDS,
  SESSION_MAX_SECONDS,
  SESSION_SLIDE_REFRESH_SECONDS
} from "@/lib/auth/session-constants";

const encoder = new TextEncoder();

function getSecret() {
  return encoder.encode(process.env.AUTH_SECRET || "change-me-before-sharing");
}

/**
 * Binds the JWT to the current deploy so a new Vercel deployment invalidates old cookies.
 * Local dev: stable "local" unless SESSION_DEPLOYMENT_ID is set (bump to log everyone out).
 */
export function getSessionDeploymentFingerprint(): string {
  if (process.env.VERCEL_DEPLOYMENT_ID) {
    return process.env.VERCEL_DEPLOYMENT_ID;
  }
  const manual = process.env.SESSION_DEPLOYMENT_ID?.trim();
  if (manual) {
    return manual;
  }
  return "local";
}

export type SessionPublicClaims = {
  sub: string;
  email: string;
  displayName: string;
};

type JwtSessionFields = SessionPublicClaims & {
  dep: string;
  last: number;
};

export type VerifyFailureReason =
  | "bad_signature"
  | "missing_claims"
  | "wrong_deployment"
  | "expired"
  | "expired_idle";

export type VerifySessionResult =
  | { ok: false; reason: VerifyFailureReason }
  | { ok: true; claims: SessionPublicClaims; expiresAtSec: number; shouldRefreshSlide: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function verifySessionToken(token: string): Promise<VerifySessionResult> {
  let payload: Record<string, unknown>;
  try {
    const { payload: p } = await jwtVerify(token, getSecret());
    if (!isRecord(p)) {
      return { ok: false, reason: "missing_claims" };
    }
    payload = p;
  } catch {
    return { ok: false, reason: "bad_signature" };
  }

  const sub = payload.sub;
  const email = payload.email;
  const displayName = payload.displayName;
  const dep = payload.dep;
  const last = payload.last;
  const exp = payload.exp;

  if (
    typeof sub !== "string" ||
    typeof email !== "string" ||
    typeof displayName !== "string" ||
    typeof dep !== "string" ||
    typeof last !== "number" ||
    typeof exp !== "number"
  ) {
    return { ok: false, reason: "missing_claims" };
  }

  if (dep !== getSessionDeploymentFingerprint()) {
    return { ok: false, reason: "wrong_deployment" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (now >= exp) {
    return { ok: false, reason: "expired" };
  }

  if (now - last > SESSION_IDLE_SECONDS) {
    return { ok: false, reason: "expired_idle" };
  }

  const shouldRefreshSlide = now - last >= SESSION_SLIDE_REFRESH_SECONDS;

  return {
    ok: true,
    claims: { sub, email, displayName },
    expiresAtSec: exp,
    shouldRefreshSlide
  };
}

export async function signNewSessionToken(claims: SessionPublicClaims): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_MAX_SECONDS;
  const body: JwtSessionFields = {
    ...claims,
    dep: getSessionDeploymentFingerprint(),
    last: now
  };

  return new SignJWT(body)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(getSecret());
}

/** Preserves absolute `exp` from the current token; updates `last` for idle sliding. */
export async function signRefreshedSessionToken(
  claims: SessionPublicClaims,
  expiresAtSec: number
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const body: JwtSessionFields = {
    ...claims,
    dep: getSessionDeploymentFingerprint(),
    last: now
  };

  return new SignJWT(body)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAtSec)
    .sign(getSecret());
}
