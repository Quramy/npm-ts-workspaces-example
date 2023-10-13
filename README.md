# How to build TypeScript mono-repo project

[![github actions](https://github.com/Quramy/npm-ts-workspaces-example/workflows/build/badge.svg)](https://github.com/Quramy/npm-ts-workspaces-example/actions)

This repository explains how to create monorepos project using npm and TypeScript.

## ToC

- [Tools](#tools)
- [Directory Structure](#directory-structure)
- [Workspaces](#workspaces)
- [Dependencies across packages](#dependencies-across-packages)
- [Resolve dependencies as TypeScript projects](#resolve-dependencies-as-typescript-projects)
- [How to execute scripts for each package ?](#how-to-execute-scripts-for-each-package-)
- [License](#license)

## Tools

- npm cli(v7 or later)
- TypeScript

## Directory Structure

Put each package under the `packages` directory.

```
.
├── node_modules/
├── README.md
├── package-lock.json
├── package.json
├── packages
│   ├── x-cli
│   │   ├── lib
│   │   │   ├── cli.d.ts
│   │   │   ├── cli.js
│   │   │   ├── cli.js.map
│   │   │   ├── main.d.ts
│   │   │   ├── main.js
│   │   │   └── main.js.map
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── cli.ts
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   └── x-core
│       ├── lib
│       │   ├── index.d.ts
│       │   ├── index.js
│       │   └── index.js.map
│       ├── package.json
│       ├── src
│       │   └── index.ts
│       └── tsconfig.json
├── tsconfig.build.json
└── tsconfig.json
```

## Workspaces

Using [npm workspaces feature](https://github.com/npm/rfcs/blob/latest/implemented/0026-workspaces.md), configure the following files:

Open `package.json` and append the `workspaces` key.

```js
/* package.json */

{
  "name": "npm-ts-workspaces-example",
  "private": true,
  ...
  "workspaces": ["packages/*"]
}
```

Exec `npm install`. After successful running, all dependencies included from each package are downloaded under the repository root `node_modules` directory.

## Dependencies across packages

In this example, the `x-cli` package depends on another package, `x-core`. So to execute (or test) `x-cli`, `x-core` packages should be installed.
But in development the `x-core` package is not published so you can't install it.

For example, `packages/x-cli/src/main.spec.ts` is a test code for `main.ts`, which depends on `packages/x-core/src/index.ts` .

```ts
/* packages/x-cli/src/main.ts.*/

import { awesomeFn } from "@quramy/x-core";

export async function main() {
  // dependencies across child packages
  const out = await awesomeFn();
  return out;
}
```

So we need to link `x-core` package from `x-cli` to execute the `x-cli` 's test.

Workspaces feature of npm also solves this problem. `npm i` creates sim-links of each package into the top-level `node_modules` dir.

## Resolve dependencies as TypeScript projects

As mentioned above, npm cli resolves dependencies across packages. It's enough for "runtime". However considering TypeScript sources, in other words "static", it's not.

We need to tell "x-cli package depends on x-core" to TypeScript compiler. TypeScript provides much useful feature to do this, ["Project References"](https://www.typescriptlang.org/docs/handbook/project-references.html).

First, you add `composite: true` to project-root tsconfig.json to use project references feature.

```js
/* tsconfig.json */

{
  "compilerOptions": {
    ...
    "composite": true
  }
}
```

Second, configure each package's tsconfig and configure dependencies across packages.

```js
/* packages/x-cli/tsconfig.json */

{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  },
  "references": [{ "path": "../x-core" }]
}
```

And create a project which depends on all packages:

```js
/* tsconfig.build.json */

{
  "files": [],
  "references": [{ "path": "packages/x-core" }, { "path": "packages/x-cli" }]
}
```

Let's exec `npx tsc --build tsconfig.build.json`. The .ts files included in all packages are build at once!

## How to execute scripts for each package ?

We can use [`--workspaces` option](https://docs.npmjs.com/cli/v10/using-npm/workspaces#running-commands-in-the-context-of-workspaces).

```sh
# Excecute npm test in all workspaces
$ npm test --workspaces
```

```sh
# Bump up packages in all workspaces
$ npm version --workspaces patch

# Publish packages in all workspaces
$ npm publish --workspaces
```

## License

The MIT License (MIT)
