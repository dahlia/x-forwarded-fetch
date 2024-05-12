/**
 * A type for `fetch()` function.
 */
export type Fetch = (request: Request) => Promise<Response> | Response;

/**
 * A middleware for `fetch()` behind a reverse proxy with `X-Forwarded-*`
 * headers.  Decorated `fetch()` function will apply `X-Forwarded-*` headers
 * to the request object so that the request has the same URL and host as the
 * original request from the client.
 * @param fetch A `fetch()` function to be decorated.
 * @returns A decorated `fetch()` function.
 */
export function behindProxy(fetch: Fetch): Fetch {
  return async (request: Request) => await fetch(getXForwardedRequest(request));
}

/**
 * Returns a new {@link Request} object with `X-Forwarded-*` headers applied.
 * @param request A request object to be transformed.
 * @returns A new request object with `X-Forwarded-*` headers applied.
 */
export function getXForwardedRequest(request: Request): Request {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  const proto = request.headers.get("X-Forwarded-Proto");
  if (proto != null) {
    url.protocol = `${proto}:`;
    headers.delete("X-Forwarded-Proto");
  }
  const host = request.headers.get("X-Forwarded-Host");
  if (host != null) {
    url.host = host;
    const portMatch = host.match(/:(\d+)$/);
    if (portMatch) url.port = portMatch[1];
    else url.port = "";
    headers.delete("X-Forwarded-Host");
    headers.delete("Host");
    headers.set("Host", host);
  }
  return new Request(url, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-ignore: TS2353
    duplex: "half",
    referrer: "referrer" in request ? request.referrer as string : undefined,
    // deno-lint-ignore no-explicit-any
    referrerPolicy: request.referrerPolicy as any,
    mode: request.mode,
    credentials: request.credentials,
    // @ts-ignore: TS2353
    cache: request.cache,
    redirect: request.redirect,
    integrity: request.integrity,
    keepalive: request.keepalive,
    signal: request.signal,
  });
}
