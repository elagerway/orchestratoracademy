#!/usr/bin/env node
/**
 * Generate the thumbnail for routines-vs-n8n-vs-make.
 * Pattern: dark bg, Leo on left, bold 3-line title on right with one
 * accent word, OA watermark top-right.
 * Output: 1280x720 PNG.
 *
 * Matches the production news-thumbnail pattern (openclaw,
 * anthropic-orchestration-core-engineering-skill-2026, etc.).
 */
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEO_PATH = path.resolve(__dirname, "../output/News/karpathy-20-80/leo-frame.png");
const OUT_DIR = path.resolve(__dirname, "../output/claude-routines-vs-n8n-vs-make-assets");
const OUT_PATH = path.join(OUT_DIR, "thumbnail.png");

if (!fs.existsSync(LEO_PATH)) {
  console.error("Leo frame missing:", LEO_PATH);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const leoBase64 = fs.readFileSync(LEO_PATH).toString("base64");
const OA_GREEN = "#3ECF8E";

const html = `<!DOCTYPE html>
<html><head><style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1280px; height: 720px; background: #0a0a0a; overflow: hidden; font-family: 'Sora', sans-serif; }
  .stage { position: relative; width: 1280px; height: 720px; }
  .leo {
    position: absolute;
    top: 0;
    left: 0;
    width: 720px;  /* keep 16:9 crop, Leo sits center-left */
    height: 720px;
    background-image: url('data:image/png;base64,${leoBase64}');
    background-size: cover;
    background-position: center 30%;
    /* soft vignette fade into black on the right edge */
    mask-image: linear-gradient(to right, black 72%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 72%, transparent 100%);
  }
  .title {
    position: absolute;
    right: 64px;
    top: 140px;
    text-align: right;
    line-height: 0.92;
    letter-spacing: -3px;
    font-weight: 900;
    color: #ffffff;
    font-size: 120px;
  }
  .title .accent { color: ${OA_GREEN}; }
  .oa {
    position: absolute;
    top: 28px;
    right: 36px;
    width: 54px;
    height: 54px;
    background: #0a0a0a;
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -1px;
  }
</style></head>
<body>
  <div class="stage">
    <div class="leo"></div>
    <div class="title">
      ROUTINES<br/>
      <span class="accent">vs n8n</span><br/>
      vs MAKE
    </div>
    <div class="oa">OA</div>
  </div>
</body></html>`;

const htmlPath = path.join(OUT_DIR, "thumbnail.html");
fs.writeFileSync(htmlPath, html);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });
await page.screenshot({ path: OUT_PATH, type: "png", omitBackground: false });
await browser.close();

console.log("wrote:", OUT_PATH);
