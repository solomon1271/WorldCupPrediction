import type { GroupQualificationStatus } from "@/lib/group-standings-types";

export function getGroupQualificationLabel(status: GroupQualificationStatus) {
  switch (status) {
    case "through":
      return "Through";
    case "through-live":
      return "Top two";
    case "lucky-third":
      return "Best 3rd";
    case "third-hope":
      return "3rd hunt";
    case "eliminated":
      return "Out";
  }
}

export function getGroupStandingsRowClassName(status: GroupQualificationStatus) {
  return `group-standings-table__row--${status}`;
}
