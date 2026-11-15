# Contributing

Thanks for contributing to `astro-lenis`.

## Development

```bash
npm install
npm run format:check
npm run typecheck
npm test
npm run build
```

Keep the package small and preserve the default export and `window.lenis`
compatibility unless a breaking change is explicitly discussed. New runtime
behavior should account for Astro ClientRouter navigation, reduced motion, and
cleanup.

## Pull requests

Explain the user-facing behavior, include relevant tests or reproduction steps,
and update the README when the public configuration or lifecycle changes.
Run `npm run format` before submitting changes.
