---
layout: default
title: Quick HTTP server
parent: JavaScript
grand_parent: Notes and bookmarks
nav_order: 3
---

# Quick HTTP server to test projects locally

`npx http-server`

Serve the files in the `./public` directory if it exists, or `./` otherwise, at `localhost:8080`.

---

For better performance, install the [http-server](https://www.npmjs.com/package/http-server) npm package globally:

`npm i -g http-server`

Now, to start the server, simply run:

`http-server [-p port]`

See all [options](https://www.npmjs.com/package/http-server#available-options).


