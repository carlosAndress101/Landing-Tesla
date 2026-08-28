// Central re-export — single import surface for types
export type { Theme } from "./theme";
export { THEMES } from "./theme";
export type { MediaType, MediaContent } from "./media";
export type { ButtonVariant, ButtonProps, ActionButton } from "./button";
export { BUTTON_VARIANTS } from "./button";
export type { NavLink, NavigationProps, PrimaryNavLink, SecondaryNavLink } from "./navigation";
export { NAV_LINKS, NAV_LINKS_SECONDARY } from "./navigation";
export type { TeslaSection, SectionData } from "./section";

// Layout
export interface LayoutProps {
  readonly title: string;
  readonly description?: string;
}
