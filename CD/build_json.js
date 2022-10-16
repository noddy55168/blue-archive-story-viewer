import chalk from "chalk";
import fs from "fs";
import jsYaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        const pathname = path.join(dir, file);
        fs.stat(pathname, (err, stats) => {
          if (err) {
            console.log(err);
          } else if (stats.isDirectory()) {
            walk(pathname, callback);
          } else {
            callback(pathname);
          }
        });
      });
    }
  });
}

walk(path.resolve(__dirname, "..", "public", "config", "yaml"), (pathname) => {
  fs.readFile(pathname, "utf8", (err, data) => {
    if (err) {
      console.log(`[${chalk.red("ERROR")}] ${pathname}\n${chalk.red(err)}`);
    } else {
      const yaml = data.replaceAll("，", ",");
      const json = jsYaml.load(yaml);
      const jsonPath = pathname.replaceAll(/ya?ml/gi, "json");
      fs.writeFile(jsonPath, JSON.stringify(json, null, 0), (err) => {
        if (err) {
          console.log(`[${chalk.red("ERROR")}] ${jsonPath}\n${chalk.red(err)}`);
        } else {
          console.log(`[${chalk.green("SUCCESS")}] ${jsonPath}`);
        }
      });
    }
  });
});
