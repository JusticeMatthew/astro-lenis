import assert from "node:assert/strict";
import test from "node:test";
import lenis, { astroLenis } from "../dist/index.js";

async function injectedScripts(options) {
  const integration = lenis(options);
  const scripts = [];
  await integration.hooks["astro:config:setup"]({
    injectScript(stage, content) {
      scripts.push({ stage, content });
    },
  });
  return scripts;
}

test("keeps the default and named integration exports", () => {
  assert.equal(lenis, astroLenis);
  assert.equal(lenis().name, "astro-lenis");
});

test("does not inject scripts when disabled", async () => {
  assert.deepEqual(await injectedScripts({ enabled: false }), []);
});

test("injects a guarded runtime with configured Lenis options", async () => {
  const scripts = await injectedScripts({
    options: { duration: 1.2, smoothWheel: false },
  });

  assert.deepEqual(
    scripts.map(({ stage }) => stage),
    ["page", "head-inline"],
  );
  assert.match(scripts[0].content, /if \(!window\[globalKey]\)/);
  assert.match(scripts[0].content, /"duration":1\.2/);
  assert.match(scripts[0].content, /astro:before-swap/);
  assert.match(scripts[0].content, /astro:page-load/);
  assert.match(scripts[1].content, /data-astro-lenis-styles/);
});

test("rejects callback options that cannot cross the Astro config boundary", () => {
  assert.throws(
    () => lenis({ options: { onUpdate: () => undefined } }),
    /callback options are not supported/,
  );
});
