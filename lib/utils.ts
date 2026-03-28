export const formatKickoff = (kickoff: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(kickoff));

export const trendLabel = (trend: "up" | "same" | "down") => {
  if (trend === "up") return "Rising";
  if (trend === "down") return "Sliding";
  return "Holding";
};
