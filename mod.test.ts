import { assertEquals } from "@std/assert/assert-equals";
import { assertFalse } from "@std/assert/assert-false";
import { getXForwardedRequest } from "./mod.ts";

Deno.test("getXForwardedRequest()", async () => {
  const getRequest = new Request(
    "http://localhost:3000/foo/bar?baz=qux",
    {
      headers: {
        "X-Forwarded-Proto": "https",
        "X-Forwarded-Host": "example.com",
      },
    },
  );
  const getRequestResult = getXForwardedRequest(getRequest);
  assertEquals(getRequestResult.url, "https://example.com/foo/bar?baz=qux");
  assertFalse(getRequestResult.headers.has("X-Forwarded-Proto"));
  assertFalse(getRequestResult.headers.has("X-Forwarded-Host"));
  assertEquals(getRequestResult.headers.get("Host"), "example.com");

  const body = new FormData();
  body.set("foo", "bar");
  body.set("baz", "qux");
  const postRequest = new Request(
    "http://localhost:3000/foo/bar",
    {
      method: "POST",
      headers: {
        "X-Forwarded-Proto": "https",
        "X-Forwarded-Host": "example.com",
      },
      body,
    },
  );
  const postRequestResult = getXForwardedRequest(postRequest);
  assertEquals(postRequestResult.url, "https://example.com/foo/bar");
  assertFalse(postRequestResult.headers.has("X-Forwarded-Proto"));
  assertFalse(postRequestResult.headers.has("X-Forwarded-Host"));
  assertEquals(postRequestResult.headers.get("Host"), "example.com");
  const bodyResult = await postRequestResult.formData();
  assertEquals([...bodyResult.keys()], ["foo", "baz"]);
  assertEquals(bodyResult.get("foo"), "bar");
  assertEquals(bodyResult.get("baz"), "qux");
});
