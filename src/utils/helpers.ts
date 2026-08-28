import type { Theme } from "../types/theme";

/** Pure, typed helpers — no `any` */

export function isDarkTheme(theme: Theme): boolean {
  return theme === "dark";
}

export function getHeaderColor(theme: Theme): string {
  return theme === "dark" ? "white" : "#171a20";
}

// Example of Pick / Omit usage for component props
import type { TeslaSection } from "../types/section";

export type SectionHeaderProps = Pick<TeslaSection, "id" | "title" | "subtitle" | "theme">;
export type SectionMediaProps = Pick<TeslaSection, "media"> & { eager?: boolean };
export type SectionActionsProps = Pick<Required<TeslaSection>, "actions">;

// Template literal type — demonstrates TS 5 value
export type SectionHref = `#${string}`;
export function toSectionHref(id: string): SectionHref {
  return `#${id}`;
}

// ReturnType example
export function createObserverConfig(threshold: number) {
  return { threshold } as const;
}
export type ObserverConfig = ReturnType<typeof createObserverConfig>;
