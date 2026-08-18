import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
export const plugin = () => {};
export const $ = () => {};
export const file = (p: string) => ({
  text: () => readFile(p, "utf8"),
  json: async () => JSON.parse(await readFile(p, "utf8")),
});
export const write = (p: string, data: any) => writeFile(p, data, "utf8");
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const stringWidth = (str: string) => {
  if (!str) return 0;
  return str.length;
};
export const stdin = {
  async text() {
    if (process.stdin.isTTY) return "";
    try {
      return fs.readFileSync(0, "utf8");
    } catch {
      return "";
    }
  },
};
export default { plugin, $, file, write, sleep, stringWidth, stdin };

