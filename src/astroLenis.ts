import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "astro/zod";
import { defineIntegration } from "astro-integration-kit";
import type { LenisOptions } from "lenis";

const absoluteStylesPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "lenis-styles.css",
);

export interface AstroLenisConfig {
  /**
   * Enables the integration. Defaults to true.
   */
  enabled?: boolean;
  /**
   * Disables smooth scrolling when the user prefers reduced motion.
   * Defaults to true.
   */
  respectReducedMotion?: boolean;
  /**
   * Options passed to the Lenis constructor.
   *
   * Callback and DOM-valued options cannot be serialized from astro.config.
   */
  options?: LenisOptions;
}

const optionsSchema = z
  .object({
    enabled: z.boolean().default(true),
    respectReducedMotion: z.boolean().default(true),
    options: z
      .custom<LenisOptions>(
        (value) =>
          typeof value === "object" && value !== null && !Array.isArray(value),
        "Lenis options must be an object",
      )
      .optional(),
  })
  .default({});

function serializeOptions(options: LenisOptions | undefined): string {
  try {
    return JSON.stringify(options ?? {}, (_key, value: unknown) => {
      if (typeof value === "function") {
        throw new TypeError(
          "callback options are not supported in astro.config; initialize Lenis in client code instead",
        );
      }
      if (typeof value === "bigint") {
        throw new TypeError("bigint values are not supported");
      }
      return value;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `astro-lenis: Lenis options must be JSON serializable. ${message}`,
    );
  }
}

export const astroLenis = defineIntegration({
  name: "astro-lenis",
  optionsSchema,
  setup({ options }) {
    const serializedOptions = serializeOptions(options.options);
    const cssContent = JSON.stringify(
      readFileSync(absoluteStylesPath, "utf-8"),
    );

    return {
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          if (!options.enabled) {
            return;
          }

          injectScript(
            "page",
            `
              import Lenis from "lenis";

              const globalKey = "__astroLenis";
              const config = {
                options: ${serializedOptions},
                respectReducedMotion: ${options.respectReducedMotion},
              };

              if (!window[globalKey]) {
                let state;

                const destroy = () => {
                  if (!state) return;
                  cancelAnimationFrame(state.rafId);
                  state.lenis.destroy();
                  if (window.lenis === state.lenis) {
                    window.lenis = undefined;
                  }
                  state = undefined;
                };

                const create = () => {
                  if (
                    state ||
                    (config.respectReducedMotion &&
                      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                  ) {
                    return;
                  }

                  const lenis = new Lenis(config.options);
                  window.lenis = lenis;

                  const raf = (time) => {
                    lenis.raf(time);
                    state.rafId = requestAnimationFrame(raf);
                  };

                  state = {
                    lenis,
                    rafId: requestAnimationFrame(raf),
                  };
                };

                const mediaQuery = window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                );
                const onMotionPreferenceChange = () => {
                  if (mediaQuery.matches) {
                    destroy();
                  } else {
                    create();
                  }
                };

                if (config.respectReducedMotion) {
                  mediaQuery.addEventListener(
                    "change",
                    onMotionPreferenceChange
                  );
                }

                document.addEventListener("astro:before-swap", () => {
                  state?.lenis.stop();
                });
                document.addEventListener("astro:page-load", () => {
                  if (state) {
                    state.lenis.start();
                  } else {
                    create();
                  }
                });
                window.addEventListener("pagehide", destroy);
                window.addEventListener("pageshow", create);

                window[globalKey] = { destroy };
                create();
              }
            `,
          );

          injectScript(
            "head-inline",
            `
              if (!document.head.querySelector("[data-astro-lenis-styles]")) {
                const style = document.createElement("style");
                style.dataset.astroLenisStyles = "true";
                style.textContent = ${cssContent};
                document.head.appendChild(style);
              }
            `,
          );
        },
      },
    };
  },
});
