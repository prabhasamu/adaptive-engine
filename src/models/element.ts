export type ElementType =
  | "headline"
  | "image"
  | "price"
  | "cta"
  | "logo";

export interface AdElement {
  id: string;
  type: ElementType;

  content: string;

  priority: number;

  minWidth: number;
  minHeight: number;

  preferredWidth: number;
  preferredHeight: number;

  aspectRatio?: number;
}
