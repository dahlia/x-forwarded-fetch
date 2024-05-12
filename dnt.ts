import { build, emptyDir } from "@deno/dnt";
import metadata from "./deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  package: {
    // package.json properties
    name: "x-forwarded-fetch",
    version: Deno.args[0] ?? metadata.version,
    description:
      "A middleware for fetch() behind a reverse proxy with X-Forwarded-* headers.",
    keywords: [
      "fetch",
      "proxy",
      "reverse proxy",
      "x-forwarded-host",
      "x-forwarded-proto",
    ],
    license: "MIT",
    author: {
      name: "Hong Minhee",
      email: "hong@minhee.org",
      url: "https://hongminhee.org/",
    },
    homepage: "https://github.com/dahlia/x-forwarded-fetch",
    repository: {
      type: "git",
      url: "git+https://github.com/dahlia/x-forwarded-fetch.git",
    },
    bugs: {
      url: "https://github.com/dahlia/x-forwarded-fetch/issues",
    },
  },
  outDir: "./npm",
  entryPoints: ["./mod.ts"],
  importMap: "./deno.json",
  shims: {
    "deno": "dev",
  },
  typeCheck: "both",
  declaration: "separate",
  declarationMap: true,
  test: true,
  async postBuild() {
    await Deno.copyFile("LICENSE", "npm/LICENSE");
    await Deno.copyFile("README.md", "npm/README.md");
  },
});

// cSpell: ignore Minhee
