# npm

## Documentation

+ [npm docs home](https://docs.npmjs.com/)
+ [npm install](https://docs.npmjs.com/cli/install)

> When installing a package that will be bundled into your production bundle, you should use `npm install --save`. If you're installing a package for development purposes (e.g. a linter, testing libraries, etc.) then you should use `npm install --save-dev`.

+ [Introduction to npm scripts](https://medium.freecodecamp.org/introduction-to-npm-scripts-1dbb2ae01633)

> Custom NPM scripts must be preceded by either `run-script` or `run` for them to be executed correctly.

+ [How to keep a node server running](https://stackoverflow.com/questions/12701259/how-to-make-a-node-js-application-run-permanently)

## Quick HTTP server to test projects locally

`npx http-server`

Serve the files in the `./public` directory if it exists, or `./` otherwise, at `localhost:8080`.

---

For better performance, install the [http-server](https://www.npmjs.com/package/http-server) npm package globally:

`npm i -g http-server`

Now, to start the server, simply run:

`http-server [-p port]`

See all [options](https://www.npmjs.com/package/http-server#available-options).

## Cheatsheet

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

