export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  readonly label: string;
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly id?: string;
}

export interface ActionButton extends ButtonProps {}

export const BUTTON_VARIANTS = ["primary", "secondary", "ghost"] as const satisfies readonly ButtonVariant[];
