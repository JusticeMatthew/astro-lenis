import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig((options) => {
  const dev = !!options.watch;
  return {
    entry: ["src/**/*.(ts|js)"],
    format: ["esm"],
    target: "node18",
    bundle: true,
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    minify: !dev,
    external: [...Object.keys(pkg.peerDependencies)],
    tsconfig: "tsconfig.json",
    onSuccess: async () => {
      const srcCss = "src/lenis-styles.css";
      const destCss = "dist/lenis-styles.css";

      if (existsSync(srcCss)) {
        mkdirSync(dirname(destCss), { recursive: true });
        copyFileSync(srcCss, destCss);
      }
    }
  };
});
