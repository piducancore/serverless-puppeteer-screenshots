import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  const { url } = req.query;
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    // executablePath: "/usr/bin/google-chrome-stable", // use this when running locally.
    headless: true,
    ignoreHTTPSErrors: true,
  });

  let page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  const imageBuffer = await page.screenshot();

  if (browser !== null) {
    await browser.close();
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Disposition", `inline; filename=screenshot.png`);
  res.send(imageBuffer);
}
