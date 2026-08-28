import type { TeslaSection } from "../types/section";

export const sections = [
  {
    id: "hero",
    title: "Experience Tesla",
    subtitle: "Schedule a Demo Drive Today",
    theme: "dark",
    media: {
      type: "video",
      src: "/public_video.webm",
      poster: "/image-car.avif",
      alt: "Tesla driving experience on coastal road",
    },
    actions: [{ label: "Demo Drive", href: "#hero", variant: "ghost" }],
  },
  {
    id: "model-y",
    title: "Model Y",
    subtitle: "View Inventory",
    theme: "light",
    media: {
      type: "image",
      src: "/image-car.avif",
      alt: "Tesla Model Y Pearl White parked in a driveway",
    },
    actions: [
      { label: "Explore Inventory", href: "#model-y", variant: "primary" },
      { label: "Custom Order", href: "#model-y", variant: "secondary" },
    ],
  },
  {
    id: "model-3",
    title: "Model 3",
    subtitle: "Starting at $32,740 · View Inventory",
    theme: "light",
    media: {
      type: "image",
      src: "/Homepage-Model-3-Desktop-LHD.avif",
      alt: "Tesla Model 3 Midnight Silver Metallic on mountain road",
    },
    actions: [
      { label: "Explore Inventory", href: "#model-3", variant: "primary" },
      { label: "Custom Order", href: "#model-3", variant: "secondary" },
    ],
  },
  {
    id: "model-s",
    title: "Model S",
    subtitle: "Explore Inventory",
    theme: "light",
    media: {
      type: "image",
      src: "/Model-S-homepage-desktop.avif",
      alt: "Tesla Model S Ultra Red in motion on highway",
    },
    actions: [
      { label: "Custom Order", href: "#model-s", variant: "primary" },
      { label: "Demo Drive", href: "#model-s", variant: "secondary" },
    ],
  },
  {
    id: "model-x",
    title: "Model X",
    subtitle: "Explore Inventory",
    theme: "light",
    media: {
      type: "image",
      src: "/Homepage-Model-X-Desktop-LHD.avif",
      alt: "Tesla Model X Pearl White with falcon wing doors open",
    },
    actions: [
      { label: "Custom Order", href: "#model-x", variant: "primary" },
      { label: "Demo Drive", href: "#model-x", variant: "secondary" },
    ],
  },
  {
    id: "solar-panels",
    title: "Solar Panels",
    subtitle: "Schedule a Virtual Consultation",
    theme: "light",
    media: {
      type: "image",
      src: "/425_HP_SolarPanels_D.avif",
      alt: "Modern home with Tesla solar panels on roof at sunset",
    },
    actions: [
      { label: "Order Now", href: "#solar-panels", variant: "primary" },
      { label: "Learn More", href: "#solar-panels", variant: "secondary" },
    ],
  },
  {
    id: "solar-roof",
    title: "Solar Roof",
    subtitle: "Produce Clean Energy From Your Roof",
    theme: "light",
    media: {
      type: "image",
      src: "/Homepage-SolarRoof-Desktop-Global.avif",
      alt: "House with Tesla Solar Roof tiles integrated seamlessly",
    },
    actions: [
      { label: "Order Now", href: "#solar-roof", variant: "primary" },
      { label: "Learn More", href: "#solar-roof", variant: "secondary" },
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    theme: "light",
    media: {
      type: "image",
      src: "/Desktop_Accessories.avif",
      alt: "Tesla Wall Connector and accessories on minimal background",
    },
    actions: [{ label: "Shop Now", href: "#accessories", variant: "primary" }],
  },
] as const satisfies readonly TeslaSection[];

// Derived types — demonstrates keyof/typeof
export type SectionId = (typeof sections)[number]["id"];
export type SectionById = Extract<(typeof sections)[number], { id: SectionId }>;
