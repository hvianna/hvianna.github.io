---
layout: default
title: node / npm basics
parent: JavaScript
grand_parent: Notes and bookmarks
nav_order: 2
---

# node / npm basics

+ [npm docs home](https://docs.npmjs.com/) / [npm install](https://docs.npmjs.com/cli/install)

> When installing a package that will be bundled into your production bundle, you should use `npm install --save`. If you're installing a package for development purposes (e.g. a linter, testing libraries, etc.) then you should use `npm install --save-dev`.

+ [Introduction to npm scripts](https://medium.freecodecamp.org/introduction-to-npm-scripts-1dbb2ae01633)

> Custom NPM scripts must be preceded by either `run-script` or `run` for them to be executed correctly.

+ [How to keep a node server running](https://stackoverflow.com/questions/12701259/how-to-make-a-node-js-application-run-permanently)

### Get a list of globally installed packages

`npm list -g --depth 0`

### Remove unused packages from project (no longer in `package.json`)

`npm prune`

### Check outdated packages

`npm outdated`

### Force update of major version

`npm install <package>@latest`

### Publishing a beta version of a package to npm

`npm publish --tag beta`

Reference: https://medium.com/@kevinkreuzer/publishing-a-beta-or-alpha-version-to-npm-46035b630dd7


### Bundling node modules for usage in a browser

+ https://webpack.js.org/

### Compiling a node.js script to a standalone application

+ [pkg](https://github.com/zeit/pkg)
+ [nexe](https://github.com/nexe/nexe)
+ [Electron](https://electronjs.org/)
