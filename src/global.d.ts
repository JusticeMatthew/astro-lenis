import type Lenis from "lenis";

declare global {
  interface Window {
    lenis?: Lenis;
    __astroLenis?: {
      destroy: () => void;
    };
  }
}

export {};
