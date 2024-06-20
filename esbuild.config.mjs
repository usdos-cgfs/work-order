import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/app_bundle.js"],
  bundle: true,
  minify: false,
  outdir: "dist",
});
