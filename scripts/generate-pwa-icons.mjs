import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const svg = await readFile(resolve("public/icon.svg"), "utf8");
const source = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const browser = await chromium.launch();
try {
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}img{display:block;width:100%;height:100%}</style><img src="${source}" alt="">`);
    await page.screenshot({ path: resolve(`public/icon-${size}.png`), omitBackground: true });
    await page.close();
  }
} finally {
  await browser.close();
}
