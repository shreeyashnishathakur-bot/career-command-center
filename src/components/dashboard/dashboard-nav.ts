import {
  Award,
  BriefcaseBusiness,
  FileText,
  Gauge,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Mail,
  Settings,
  Sparkles,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  /** Existing route. When absent the item renders as an inert "Soon" entry. */
  to?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Only items that map to a route that exists today are linkable. Everything
 * else is shown but inert, so the sidebar previews the full product without
 * producing broken links.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      { label: "Career Profile", icon: UserRound, to: "/onboarding" },
      { label: "Resumes", icon: FileText, to: "/resumes" },
      { label: "Job Match", icon: Target },
      { label: "Applications", icon: BriefcaseBusiness },
    ],
  },
  {
    label: "Career",
    items: [
      { label: "Cover Letters", icon: Mail },
      { label: "Interview Prep", icon: GraduationCap },
      { label: "Skill Gap", icon: Gauge },
      { label: "Certifications", icon: Award },
      { label: "Portfolio", icon: Layers },
    ],
  },
  {
    label: "AI",
    items: [{ label: "Career AI", icon: Sparkles }],
  },
];

export const NAV_BOTTOM: NavItem[] = [
  { label: "Settings", icon: Settings },
  { label: "Help", icon: HelpCircle },
];
