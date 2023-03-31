import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  const { url, as } = req.query;
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    // executablePath: "/usr/bin/google-chrome-stable", // use this when running locally.
    headless: true,
    ignoreHTTPSErrors: true,
  });

  let page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  if (as === "pdf") {
    const pdf = await page.pdf({ format: "A4" });
    await close(browser);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Disposition", `inline; filename=screenshot.pdf`);
    res.send(imageBuffer);
  } else {
    await close(browser);
    const imageBuffer = await page.screenshot();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Disposition", `inline; filename=screenshot.png`);
    res.send(imageBuffer);
  }
}

async function close(browser) {
  if (browser !== null) {
    await browser.close();
  }
}
