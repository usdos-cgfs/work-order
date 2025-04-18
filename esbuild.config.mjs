import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";

await esbuild.build({
  entryPoints: ["./src/app_bundle.js", "./src/app.css", "./src/report.js"],
  bundle: true,
  minify: false,
  sourcemap: true,
  outdir: "dist",
});

const referenceFiles = ["app_bundle.txt", "report.txt"];

referenceFiles.forEach(copyReferenceFiles);
function copyReferenceFiles(filePath) {
  const srcTextFile = path.resolve("src/" + filePath);
  const destTextFile = path.resolve("dist/" + filePath);
  fs.copyFileSync(srcTextFile, destTextFile);
}
