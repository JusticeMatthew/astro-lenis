import { defineIntegration } from "astro-integration-kit";
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const absoluteStylesPath = resolve(dirname(fileURLToPath(import.meta.url)), 'lenis-styles.css')

export const astroLenis = defineIntegration({
	name: "astro-lenis",
	setup() {
		return {
			hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript('page', `
            import Lenis from 'lenis';
            const lenis = new Lenis();

            function raf(time) {
              lenis.raf(time);
              requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
          `)
          injectScript('page-ssr', JSON.stringify(absoluteStylesPath))
        },
      },
		};
	},
});
