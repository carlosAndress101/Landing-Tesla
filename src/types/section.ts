import type { MediaContent } from "./media";
import type { Theme } from "./theme";
import type { ActionButton } from "./button";

export interface TeslaSection {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly theme: Theme;
  readonly media: MediaContent;
  readonly actions?: readonly ActionButton[];
}

// Strict variant used by data/sections.ts
export type SectionData = TeslaSection;
