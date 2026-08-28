import type {
  CybertruckStat,
  CybertruckGalleryItem,
  CybertruckFeature,
  CybertruckInteriorFeature,
  CybertruckPowerFlow,
  CybertruckSpec,
  CybertruckHeroData,
  CybertruckCTAData,
} from "../types/cybertruck";

// Fuente: https://www.tesla.com/es_co/cybertruck (datos públicos oficiales)
// Valores verificados dic 2024 — si depende de configuración se indica.
// Rango EPA, no WLTP. Capacidades con equipo adecuado.

export const cybertruckHero = {
  id: "cybertruck-hero",
  title: "CYBERTRUCK",
  subtitle: "Diseñado para cualquier aventura",
  theme: "dark",
  media: {
    type: "image",
    src: "/Cybertruck-Hero-Desktop-NA-SA-APAC.avif",
    alt: "Tesla Cybertruck Hero — acero inoxidable angular en estudio oscuro, Desktop NA/SA/APAC",
  },
  actions: [
    { label: "Ordenar", href: "#cybertruck-specs", variant: "primary" },
    { label: "Explorar", href: "#cybertruck-stats", variant: "secondary" },
  ],
} as const satisfies CybertruckHeroData;

export const cybertruckStats = [
  { value: "2.6 s", label: "0–100 km/h*", sublabel: "Cyberbeast Tri-Motor", note: "*Con rollout sustraído" },
  { value: "547 km", label: "Autonomía", sublabel: "AWD · est. EPA", note: "Con neumáticos todo terreno" },
  { value: "4 990 kg", label: "Remolque", sublabel: "11,000 lbs", note: "Con paquete requerido" },
  { value: "1 134 L", label: "Carga", sublabel: "Vault + Frunk", note: "2 500 lbs payload" },
] as const satisfies readonly CybertruckStat[];

export const cybertruckGallery = [
  {
    src: "/Homepage-Model-X-Desktop-LHD.avif",
    alt: "Cybertruck vista frontal angular con exoesqueleto de acero",
    caption: "Exoesqueleto ultrarresistente",
    aspect: "16/9",
  },
  {
    src: "/425_HP_SolarPanels_D.avif",
    alt: "Cybertruck vault abierto mostrando capacidad de carga",
    caption: "Vault de 1 830 mm",
    aspect: "4/3",
  },
  {
    src: "/Homepage-SolarRoof-Desktop-Global.avif",
    alt: "Cybertruck suspensión neumática elevada todoterreno",
    caption: "Suspensión adaptativa · 443 mm despeje",
    aspect: "16/9",
  },
  {
    src: "/image-car.avif",
    alt: "Interior minimalista Cybertruck pantalla 18.5”",
    caption: "Interior sin concesiones",
    aspect: "4/3",
  },
] as const satisfies readonly CybertruckGalleryItem[];

export const cybertruckFeatures = [
  {
    icon: "M12 2l7 4v8l-7 4-7-4V6l7-4z",
    title: "Exoesqueleto",
    description: "Acero inoxidable 30X ultra-duro, a prueba de abolladuras y corrosión.",
  },
  {
    icon: "M3 12l2-2 4 4 8-8 2 2-10 10z",
    title: "Cristal blindado",
    description: "Resistencia a impactos y atenuación acústica superior.",
  },
  {
    icon: "M12 6v6l4 2",
    title: "Steer-by-Wire",
    description: "Dirección electrónica, radio de giro reducido y respuesta instantánea.",
  },
  {
    icon: "M5 12h14M12 5l7 7-7 7",
    title: "AWD adaptativo",
    description: "Tracción total electrónica, reparto vectorial y modo Baja.",
  },
  {
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    title: "Powershare",
    description: "Hasta 11.5 kW para casa, herramientas u otro vehículo.",
  },
  {
    icon: "M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z",
    title: "Suspensión neumática",
    description: "Recorrido 305 mm, despeje 443 mm, arrodillamiento para carga.",
  },
] as const satisfies readonly CybertruckFeature[];

export const cybertruckInterior: readonly CybertruckInteriorFeature[] = [
  {
    title: "Pantalla táctil 18.5”",
    description: "Centro de control 4K, sin botones físicos, actualizaciones OTA.",
    media: {
      type: "image",
      src: "/Desktop_Accessories.avif",
      alt: "Pantalla central 18.5 pulgadas Cybertruck interfaz minimalista",
    },
  },
  {
    title: "Segunda fila + pantalla 9.4”",
    description: "Espacio para 5 adultos, pantalla trasera y 65W USB-C.",
    media: {
      type: "image",
      src: "/Homepage-Model-3-Desktop-LHD.avif",
      alt: "Asientos traseros Cybertruck con pantalla 9.4 pulgadas",
    },
  },
] as const;

export const cybertruckPowerFlows = [
  { from: "Cybertruck", to: "Casa", label: "Hasta 3 días de respaldo*" },
  { from: "Vault", to: "Herramientas", label: "120V / 240V · 11.5 kW" },
  { from: "Cybertruck", to: "Vehículo", label: "Carga vehículo a vehículo" },
] as const satisfies readonly CybertruckPowerFlow[];

export const cybertruckSpecs = [
  { label: "Motorización", dual: "Dual Motor AWD", beast: "Cyberbeast Tri-Motor AWD" },
  { label: "0–100 km/h", dual: "4.1 s", beast: "2.6 s*", note: "*Con rollout" },
  { label: "Autonomía EPA", dual: "547 km", beast: "515 km", note: "est. EPA" },
  { label: "Vel. máxima", dual: "180 km/h", beast: "209 km/h" },
  { label: "Remolque", dual: "4 990 kg", beast: "4 990 kg" },
  { label: "Tracción", dual: "AWD", beast: "AWD" },
] as const satisfies readonly CybertruckSpec[];

export const cybertruckCTA = {
  id: "cybertruck-cta",
  title: "Construido para lo imposible",
  subtitle: "Reserva tu Cybertruck hoy",
  theme: "dark",
  media: {
    type: "image",
    src: "/Model-S-homepage-desktop.avif",
    alt: "Cybertruck negro matizado en estudio oscuro",
  },
  actions: [
    { label: "Ordenar Cybertruck", href: "#cybertruck-cta", variant: "primary" },
    { label: "Ver inventario", href: "#cybertruck-specs", variant: "ghost" },
  ],
} as const satisfies CybertruckCTAData;

export const cybertruckOffroad = {
  id: "cybertruck-offroad",
  title: "Domina cualquier terreno",
  subtitle: "Baja Mode · 443 mm despeje · 35” neumáticos · Wade 816 mm",
  theme: "dark",
  media: {
    type: "image",
    src: "/Homepage-SolarRoof-Desktop-Global.avif",
    alt: "Cybertruck en duna desértica modo Baja levantando polvo",
  },
} as const;
