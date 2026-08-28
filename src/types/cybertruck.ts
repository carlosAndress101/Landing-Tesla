import type { Theme } from "./theme";
import type { ButtonVariant } from "./button";

export type CybertruckMediaType = "image" | "video";

export interface CybertruckMedia {
  readonly type: CybertruckMediaType;
  readonly src: string;
  readonly poster?: string;
  readonly alt: string;
}

export interface CybertruckAction {
  readonly label: string;
  readonly href: string;
  readonly variant: ButtonVariant;
}

// Hero
export interface CybertruckHeroData {
  readonly id: "cybertruck-hero";
  readonly title: string;
  readonly subtitle: string;
  readonly theme: Theme;
  readonly media: CybertruckMedia;
  readonly actions: readonly CybertruckAction[];
}

// Stats — valores oficiales Tesla (indicar si depende de configuración)
export interface CybertruckStat {
  readonly value: string;
  readonly label: string;
  readonly sublabel?: string;
  readonly note?: string;
}

// Gallery
export type GalleryAspect = "16/9" | "4/3" | "1/1" | "21/9";
export interface CybertruckGalleryItem {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly aspect?: GalleryAspect;
}

// Features (exoesqueleto, etc.)
export interface CybertruckFeature {
  readonly icon: string; // SVG path data (ligero, no lib)
  readonly title: string;
  readonly description: string;
}

// Interior / Power items
export interface CybertruckInteriorFeature {
  readonly title: string;
  readonly description: string;
  readonly media: CybertruckMedia;
}

export interface CybertruckPowerFlow {
  readonly from: string;
  readonly to: string;
  readonly label: string;
}

// Specs — tabla comparativa sin <table> gigante
export type SpecVariant = "dual" | "beast";
export interface CybertruckSpec {
  readonly label: string;
  readonly dual: string;
  readonly beast: string;
  readonly note?: string;
}

// CTA
export interface CybertruckCTAData {
  readonly id: "cybertruck-cta";
  readonly title: string;
  readonly subtitle: string;
  readonly theme: Theme;
  readonly media: CybertruckMedia;
  readonly actions: readonly CybertruckAction[];
}

// Re-export helper for data validation
export type CybertruckSectionId =
  | "cybertruck-hero"
  | "cybertruck-stats"
  | "cybertruck-gallery"
  | "cybertruck-features"
  | "cybertruck-interior"
  | "cybertruck-utility"
  | "cybertruck-power"
  | "cybertruck-offroad"
  | "cybertruck-specs"
  | "cybertruck-cta";
