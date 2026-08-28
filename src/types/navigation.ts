export type NavLink = string;

export interface NavigationProps {
  readonly primary: readonly NavLink[];
  readonly secondary: readonly NavLink[];
}

export const NAV_LINKS = ["Vehicles", "Energy", "Charging", "Discover", "Shop"] as const;
export const NAV_LINKS_SECONDARY = ["Shop", "Account", "Menu"] as const;

export type PrimaryNavLink = typeof NAV_LINKS[number];
export type SecondaryNavLink = typeof NAV_LINKS_SECONDARY[number];
