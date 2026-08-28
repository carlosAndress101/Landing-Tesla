import { NAV_LINKS, NAV_LINKS_SECONDARY } from "../types/navigation";

// Centralized navigation — as const already in types, re-exported readonly
export const PRIMARY_NAV = NAV_LINKS;
export const SECONDARY_NAV = NAV_LINKS_SECONDARY;

// Theme mapping — demonstrates Record<Theme, string>
import type { Theme } from "../types/theme";

export const THEME_HEADER_COLOR: Record<Theme, string> = {
  light: "#171a20",
  dark: "white",
} as const;

export const THEME_BG: Record<Theme, string> = {
  light: "bg-white text-[#171a20]",
  dark: "bg-black text-white",
} as const;
