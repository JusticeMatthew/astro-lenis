# astro-lenis

An Astro integration that adds simple, performant smooth scrolling with
[Lenis](https://lenis.darkroom.engineering/).

## Features

- Zero-component setup with the existing `astro-lenis` integration API.
- Lenis 1.x configuration through `astro.config`.
- One guarded Lenis instance per page.
- Automatic RAF scheduling and cleanup.
- Astro ClientRouter/View Transitions lifecycle support.
- Reduced-motion support by default.
- The existing `window.lenis` escape hatch remains available.

## Requirements

- Astro 5 or 6
- Lenis 1.3.11 or newer within the 1.x range
- Node.js 18 or newer

## Installation

```bash
npx astro add astro-lenis
```

Or install it manually:

```bash
npm install astro-lenis lenis
# pnpm add astro-lenis lenis
# yarn add astro-lenis lenis
```

Add the integration to `astro.config.mjs` (or `.ts`):

```ts
import { defineConfig } from "astro/config";
import lenis from "astro-lenis";

export default defineConfig({
  integrations: [lenis()],
});
```

The integration injects the Lenis runtime and its required CSS. No layout
component or client-side script is required.

## Configuration

All options are optional:

```ts
import lenis from "astro-lenis";

export default defineConfig({
  integrations: [
    lenis({
      enabled: true,
      respectReducedMotion: true,
      options: {
        smoothWheel: true,
        duration: 1.2,
        touchMultiplier: 1.5,
      },
    }),
  ],
});
```

### Integration options

| Option                 | Type           | Default | Description                                                          |
| ---------------------- | -------------- | ------- | -------------------------------------------------------------------- |
| `enabled`              | `boolean`      | `true`  | Enable or disable the integration.                                   |
| `respectReducedMotion` | `boolean`      | `true`  | Do not create Lenis when `prefers-reduced-motion: reduce` is active. |
| `options`              | `LenisOptions` | `{}`    | Options passed to `new Lenis()`.                                     |

`LenisOptions` is imported from Lenis, so TypeScript provides completion and
type checking for current Lenis settings such as `duration`, `lerp`,
`orientation`, `smoothWheel`, `wrapper`, and `autoResize`.

The integration configuration is evaluated at build time. Values in
`options` must therefore be JSON-serializable. DOM elements and callback
options such as `prevent`, `virtualScroll`, and `onUpdate` are not supported
through `astro.config`; use a custom Lenis setup for those cases.

### Default settings

When no options are supplied, Lenis uses its own defaults. The integration
defaults are:

```ts
{
  enabled: true,
  respectReducedMotion: true,
  options: {},
}
```

### Disabling the integration

```ts
export default defineConfig({
  integrations: [lenis({ enabled: false })],
});
```

This injects neither the Lenis runtime nor the Lenis styles.

## Astro ClientRouter and View Transitions

The runtime listens for `astro:before-swap` and `astro:page-load`. It pauses
Lenis during a client navigation and resumes it after the new page is ready.
The existing instance is reused, preventing duplicate RAF loops and duplicate
instances when using Astro's ClientRouter.

No additional integration-specific setup is needed:

```astro
---
import { ClientRouter } from "astro:transitions";
---

<ClientRouter />
```

## GSAP ScrollTrigger

Use the global instance after the page has loaded, and update ScrollTrigger
from Lenis' scroll event:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = window.lenis;
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
```

The example above is for a custom GSAP-driven RAF loop. Do not use it together
with the integration's default RAF loop; choose one scheduler.

## Accessibility and reduced motion

`respectReducedMotion` is enabled by default. When the browser reports
`prefers-reduced-motion: reduce`, Lenis is not initialized. If the preference
changes while the page is open, the integration creates or destroys Lenis
accordingly. Set it to `false` only when your project has a deliberate
alternative accessibility policy.

The integration does not disable native keyboard scrolling, focus management,
or semantic HTML. Continue to test dialogs, nested scroll areas, keyboard
navigation, and touch devices in your application.

## Troubleshooting

### `window.lenis` is undefined

Check that `enabled` is not `false`, that Lenis is installed, and that reduced
motion is not active. Access it from client-side code after page load.

### My Lenis callback or DOM option is rejected

Astro serializes integration configuration into the browser bundle. Callback
functions and DOM nodes cannot cross that boundary. Use `enabled: false` and
initialize Lenis in a client-side script when those options are required.

### Scrolling is initialized twice

Remove any separate `new Lenis()` code or custom RAF loop. `astro-lenis`
already guards the global instance and schedules `requestAnimationFrame`.

### A modal or nested area should scroll natively

Use Lenis' `data-lenis-prevent` attribute or configure a client-side Lenis
instance with the appropriate `prevent` callback.

## FAQ

### Does this add a component?

No. It is an Astro integration and works from `astro.config`.

### Can I access Lenis directly?

Yes. The backwards-compatible `window.lenis` reference is set when Lenis is
active.

### Does this work with static output?

Yes. The integration injects browser code into the generated pages and does
not require a server runtime.

## Contributing

Bug reports and pull requests are welcome. Please keep changes focused,
preserve the public integration API, and include a reproduction or testable
example for behavior changes. See [CONTRIBUTING.md](CONTRIBUTING.md) for local
development commands.

## Development and testing

```bash
npm install
npm run format:check
npm run typecheck
npm test
npm run build
```

`npm run format` formats supported project files with Prettier, while
`npm run format:check` verifies formatting without changing files. `npm test`
runs the TypeScript check and production package build. The build writes
distributable JavaScript, declarations, source maps, and the packaged Lenis
stylesheet to `dist/`.

## License

MIT © Matthew Justice. See [LICENSE](LICENSE).
