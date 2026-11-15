import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const dev = !!options.watch;
  return {
    entry: ["src/index.ts"],
    format: ["esm"],
    target: "node18",
    bundle: true,
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    minify: !dev,
    external: ["astro", "lenis"],
    tsconfig: "tsconfig.json",
    onSuccess: async () => {
      const srcCss = "src/lenis-styles.css";
      const destCss = "dist/lenis-styles.css";

      if (existsSync(srcCss)) {
        mkdirSync(dirname(destCss), { recursive: true });
        copyFileSync(srcCss, destCss);
      }
    },
  };
});
