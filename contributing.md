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
-   [Rollup](https://rollupjs.org/guide/en/) - For bundling
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

## Modifying the code

First, ensure that you have the latest [Node.js](http://nodejs.org/) and
[npm](http://npmjs.org/) installed.

1. Fork and clone the repo.
1. Run `npm install` to get the project's dependencies
1. Run `npm npm start` to start build in watch mode By default only lightGallery
   core module is compiled and watched If you want to compile any plugins along
   with the core module, you can run `LG_PLUGINS=['thumbnails','pager']`
   Alternatively, you can run `LG_PLUGINS='all' npm start` to compile all plugin
   simultaneously // To tun all plugin - LG_PLUGINS='all' npm start
1. Navigate to `site/` folder and run npm run start to see preview
   `cd site && npm run start`

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
