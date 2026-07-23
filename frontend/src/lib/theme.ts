import {
  Accessibility,
  BookOpen,
  Cloud,
  FileText,
  Folder,
  HandCoins,
  Handshake,
  Landmark,
  LifeBuoy,
  ListChecks,
  Megaphone,
  PackageSearch,
  Search,
  Truck,
  UserCheck,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Departments and resources are fully dynamic (created via the website, not
// hardcoded), but Tailwind still needs literal class names to generate CSS
// and lucide-react needs an actual component reference. These lookups map
// the free-text "icon" / "color" strings stored in the DB to real values,
// falling back gracefully for anything unrecognized.

const ICONS: Record<string, LucideIcon> = {
  Folder,
  FileText,
  Wrench,
  Truck,
  Landmark,
  Megaphone,
  PackageSearch,
  Users,
  Handshake,
  HandCoins,
  Cloud,
  Search,
  BookOpen,
  Video,
  ListChecks,
  LifeBuoy,
  UserCheck,
  Accessibility,
};

export function resolveIcon(name: string | undefined | null): LucideIcon {
  if (!name) return Folder;
  return ICONS[name] ?? Folder;
}

export const ACCENT_COLORS = [
  "teal",
  "sky",
  "violet",
  "amber",
  "rose",
  "emerald",
  "cyan",
  "indigo",
  "fuchsia",
  "slate",
] as const;

type AccentClasses = { gradient: string; iconBg: string; badgeText: string; solidBg: string };

const ACCENT_MAP: Record<string, AccentClasses> = {
  teal: { gradient: "from-teal-600 to-teal-800", iconBg: "bg-teal-500/20", badgeText: "text-teal-700", solidBg: "bg-teal-700" },
  sky: { gradient: "from-sky-600 to-sky-800", iconBg: "bg-sky-500/20", badgeText: "text-sky-700", solidBg: "bg-sky-700" },
  violet: { gradient: "from-violet-600 to-violet-800", iconBg: "bg-violet-500/20", badgeText: "text-violet-700", solidBg: "bg-violet-700" },
  amber: { gradient: "from-amber-600 to-amber-800", iconBg: "bg-amber-500/20", badgeText: "text-amber-700", solidBg: "bg-amber-700" },
  rose: { gradient: "from-rose-600 to-rose-800", iconBg: "bg-rose-500/20", badgeText: "text-rose-700", solidBg: "bg-rose-700" },
  emerald: { gradient: "from-emerald-600 to-emerald-800", iconBg: "bg-emerald-500/20", badgeText: "text-emerald-700", solidBg: "bg-emerald-700" },
  cyan: { gradient: "from-cyan-600 to-cyan-800", iconBg: "bg-cyan-500/20", badgeText: "text-cyan-700", solidBg: "bg-cyan-700" },
  indigo: { gradient: "from-indigo-600 to-indigo-800", iconBg: "bg-indigo-500/20", badgeText: "text-indigo-700", solidBg: "bg-indigo-700" },
  fuchsia: { gradient: "from-fuchsia-600 to-fuchsia-800", iconBg: "bg-fuchsia-500/20", badgeText: "text-fuchsia-700", solidBg: "bg-fuchsia-700" },
  slate: { gradient: "from-slate-600 to-slate-800", iconBg: "bg-slate-500/20", badgeText: "text-slate-700", solidBg: "bg-slate-700" },
};

export function resolveAccent(color: string | undefined | null): AccentClasses {
  if (!color) return ACCENT_MAP.slate!;
  return ACCENT_MAP[color] ?? ACCENT_MAP.slate!;
}
