# Contributing

You're more than welcome to contribute to this project. Please note: your code
may be used as part of a commercial product if merged.

## Important notes

Please don't edit files in the `dist` subdirectory as they are generated via npm
script. You'll find source code in the `src` subdirectory!

### Code style

Regarding code style like indentation and whitespace, **follow the conventions
you see used in the source already.**

## Technology stack

lightGallery built on top of
[typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)
by [ Alex Jover](https://github.com/alexjoverm) with several modification.

-   TypeScript
-   SCSS
-   [Hugo](https://gohugo.io/) - For documentation website
-   [Type Doc](http://typedoc.org/) - For building documentation
-   [Vite](https://vitejs.dev/) - For bundling (library mode, Rollup under the hood)
-   [Jest](https://jestjs.io/) - For testing
-   [Prettier](https://prettier.io/) and [eslint](https://eslint.org/) for code
    formatting and consistency

### React component

lightGallery react component is created with
[create-react-app](https://github.com/facebook/create-react-app) navigate to
`lightgallery-react` folder and follow create react app documentation to start
building

### Vue.js component

lightGallery Vue.js component is created with [Vue CLI](https://cli.vuejs.org/)
navigate to `lightgallery-vue` folder and follow Vue CLI documentation to start
building

### Angular component

lightGallery Angular component is created with
[angular cli](https://angular.io/cli) navigate to `lightgallery-angular` folder
and follow Angular CLI documentation to start building.

lightgallery angular follows
[angular workspace](https://angular.io/guide/workspace-config) folder structure.

inside `lightgallery-angular > projects` you'll find two folders. `angular-demo`
and `lightgallery-angular`. `lightgallery-angular` is for the library and
`angular-demo` is for viewing the preview.

#### Example of creating new angular build

- cd lightgallery-angular (navigate to lightgallery-angular folder)
- npm install  @angular/cli@17.0.4
- ng new 17 --create-application false
- cd 17
- ng generate application angular-demo
- ng generate library lightgallery-angular (Uses folder name as package name)
- open package.json and add `"build:library": "ng build lightgallery-angular"`

- Go to lightGallery dist folder and run npm link
- Go to lightgallery-angular/17 folder and run npm link lightgallery
- Change package name to lightgallery/angular/17

- Need to compile library before using it
- Replace both lib and app folder from previous version

Docs
- https://angular.io/guide/file-structure
- https://angular.io/guide/creating-libraries


## Modifying the code

First, ensure that you have [Node.js](http://nodejs.org/) 24 LTS and
[pnpm](https://pnpm.io/) 9 installed. This repo is a pnpm workspace; use
`pnpm` (not `npm`) so the single lockfile stays consistent.

1. Fork and clone the repo.
1. Run `pnpm install` to get the project's dependencies.
1. Run `pnpm run build` to build the library (core + 13 plugins) with Vite into
   `dist/`.
1. Run `pnpm run test:prod` to run the production gate (lint + coverage tests).
   It must pass on Node 24 without any heap flags.
1. Run `pnpm start` for an incremental Vite watch build of the core module while
   developing.
1. Navigate to the `site/` folder and run `pnpm start` to preview the docs
   site: `cd site && pnpm start`.

## Submitting pull requests

Pull requests are very welcome. Note that if you are going to propose drastic
changes, be sure to open an issue for discussion first, to make sure that your
PR will be accepted before you spend effort coding it.

-   Create a new branch, please don't work in your `master` branch directly.
-   Add failing tests for the change you want to make. Run `npm run build` to
    see the tests fail.
-   Fix stuff.
-   Run `npm run build` to see if the tests pass. Repeat steps 2-4 until done.
-   Update the documentation to reflect any changes.
-   Push to your fork and submit a pull request.
