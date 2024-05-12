<!-- deno-fmt-ignore-file -->

x-forwarded-fetch
=================

[![JSR][JSR badge]][JSR]
[![npm][npm badge]][npm]

This small library provides a middleware for `fetch()` behind a reverse proxy
that supports `X-Forwarded-Host` and `X-Forwarded-Proto` headers.

This is useful when you have a reverse proxy in front of your server that
handles SSL termination and forwards requests to your server over HTTP.

[JSR]: https://jsr.io/@hongminhee/x-forwarded-fetch
[JSR badge]: https://jsr.io/badges/@hongminhee/x-forwarded-fetch
[npm]: https://npmjs.com/package/x-forwarded-fetch
[npm badge]: https://img.shields.io/npm/v/x-forwarded-fetch?logo=npm


Installation
------------

### Deno

~~~~ sh
deno add @hongminhee/x-forwarded-fetch
~~~~

### Bun

~~~~ sh
bun add x-forwarded-fetch
~~~~

### Node

~~~~ sh
npm install x-forwarded-fetch
~~~~


Usage
-----

Wrap your `fetch()` with `behindProxy()` to make it aware of
the `X-Forwarded-Host` and `X-Forwarded-Proto` headers.  For instance, in Deno:

~~~~ typescript
import { behindProxy } from "@hongminhee/x-forwarded-fetch";

Deno.serve(behindProxy(req => new Response(`The URL: ${req.url}`)));
~~~~

In Bun:

~~~~ typescript
import { behindProxy } from "x-forwarded-fetch";

Bun.serve({
  fetch: behindProxy(req => new Response(`The URL: ${req.url}`))
});
~~~~

In Node with [@hono/node-server]:

~~~~ typescript
import { serve } from "@hono/node-server";
import { behindProxy } from "x-forwarded-fetch";

serve({
  fetch: behindProxy(req => new Response(`The URL: ${req.url}`))
});
~~~~

[@hono/node-server]: https://github.com/honojs/node-server
