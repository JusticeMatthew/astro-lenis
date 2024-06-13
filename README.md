# `astro-lenis`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that adds simple and performant smooth-scrolling with [Lenis](https://lenis.darkroom.engineering/).

## Usage

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
npx astro add astro-lenis
```

```bash
pnpm astro add astro-lenis
```

```bash
yarn astro add astro-lenis
```

Or install it **manually**:

1. Install the required dependencies

```bash
npm install astro-lenis
```

```bash
pnpm add astro-lenis
```

```bash
yarn add astro-lenis
```

2. Add the integration to your `astro.config.mjs`

```diff
+import lenis from "astro-lenis";

export default defineConfig({
  integrations: [
+    lenis(),
  ],
});
```

### Configuration

This package is meant to be a simple drop-in smooth-scroll solution using the default Lenis configuration. If you need a more complex solution visit the [Lenis Github](https://github.com/darkroomengineering/lenis).

## Licensing

[MIT Licensed](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt). Made with ❤️ by [Matthew Justice](https://github.com/JusticeMatthew).

## Acknowledgements

@Bryceguy for helping me out so much with this in the discord<br/>
@Florian for making the template<br/>
@Houston because you're cute
