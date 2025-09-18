import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineIntegration } from "astro-integration-kit";

const absoluteStylesPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "lenis-styles.css"
);

export const astroLenis = defineIntegration({
  name: "astro-lenis",
  setup() {
    return {
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript(
            "page",
            `
            import Lenis from 'lenis';
            const lenis = new Lenis();
            window.lenis = lenis;

            function raf(time) {
              lenis.raf(time);
              requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
          `
          );

          const cssContent = readFileSync(absoluteStylesPath, "utf-8");
          injectScript(
            "head-inline",
            `
            const style = document.createElement('style');
            style.textContent = \`${cssContent}\`;
            document.head.appendChild(style);
          `
          );
        },
      },
    };
  },
});
