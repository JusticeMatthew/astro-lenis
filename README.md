# `package-name`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that TODO:description

## Usage

### Prerequisites

TODO:

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add package-name
```# `astro-lenis`

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


```bash
npx astro add package-name
```

```bash
yarn astro add package-name
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add package-name
```

```bash
npm install package-name
```

```bash
yarn add package-name
```

2. Add the integration to your astro config

```diff
+import integration from "package-name";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/TODO:/blob/main/LICENSE). Made with ❤️ by [TODO:](https://github.com/TODO:).

## Acknowledgements

TODO:
