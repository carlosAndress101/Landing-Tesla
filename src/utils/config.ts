// Centralized, typed config — satisfies + Readonly
export const siteConfig = {
  title: "Tesla — Cybertruck, Electric Cars, Solar & Clean Energy",
  description:
    "Tesla Landing — Cybertruck, Electric cars, solar and clean energy. Experience Cybertruck, Model Y, Model 3, Model S, Model X, Solar Roof and Solar Panels.",
  canonical: "https://tesla-landing.example.com/",
  ogImage: "/Homepage-SolarRoof-Desktop-Global.avif",
  twitterCard: "summary_large_image" as const,
  themeColor: "#171a20",
} as const satisfies Record<string, string>;

export const animationConfig = {
  revealThreshold: 0.2,
  headerThreshold: 0.9,
  indicatorThreshold: 0.6,
  loaderDelayMs: 500,
  parallaxFactor: 0.04,
} as const satisfies Record<string, number>;

export type SiteConfig = typeof siteConfig;
export type AnimationConfig = typeof animationConfig;
