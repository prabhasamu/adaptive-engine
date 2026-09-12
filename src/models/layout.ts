export interface ResolvedElement {
  id: string;

  x: number;
  y: number;

  width: number;
  height: number;

  visible: boolean;

  fontSize?: number;

  priority: number;

  originalWidth: number;
  originalHeight: number;

  degradation:
    | "none"
    | "compressed"
    | "hidden";

  reason: string;
}

export interface ResolvedLayout {
  surfaceWidth: number;
  surfaceHeight: number;

  elements: ResolvedElement[];

  overflow: boolean;
}