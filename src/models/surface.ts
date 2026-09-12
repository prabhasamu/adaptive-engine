export interface SafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Surface {
  id: string;
  name: string;

  width: number;
  height: number;

  padding: number;

  safeArea?: SafeArea;

  minTapTarget?: number;

  minTextSize?: number;

  viewingDistance?: "near" | "medium" | "far";

  touchOnly?: boolean;
}