/**
 * Lightweight clsx — typed, zero deps.
 * Usage: cls("px-4", variant === "primary" && "bg-black", { "opacity-0": !open })
 */
type ClassValue = string | boolean | undefined | null | Record<string, boolean>;

export function cls(...inputs: ClassValue[]): string {
  return inputs
    .flatMap((v) => {
      if (!v) return [];
      if (typeof v === "string") return [v];
      if (typeof v === "object") return Object.entries(v).filter(([, ok]) => ok).map(([k]) => k);
      return [];
    })
    .join(" ");
}
