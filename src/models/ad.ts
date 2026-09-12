import type { AdElement } from "./element";

export interface AdSpec {
  id: string;
  name: string;

  background: string;

  elements: AdElement[];
}
