"use client";

import { useEffect, useState } from "react";

import { getAppTimezone } from "@/lib/match-urgency";

export function useViewerTimezone(fallback = getAppTimezone()) {
  const [timeZone, setTimeZone] = useState(fallback);

  useEffect(() => {
    try {
      const viewerTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (viewerTimeZone) {
        setTimeZone(viewerTimeZone);
      }
    } catch {
      // keep fallback
    }
  }, [fallback]);

  return timeZone;
}
