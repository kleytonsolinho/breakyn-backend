const puppeteerExtra = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const chromium = require("@sparticuz/chromium");

const URL = "https://books.toscrape.com/";

module.exports.handler = async (event, context) => {
  try {
    puppeteerExtra.use(stealthPlugin());

    const browser = await puppeteerExtra.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: 'new',
      ignoreHTTPSErrors: true,
    });

    await page.goto(URL, {
      waitUntil: "domcontentloaded",
    });

    const bookData = await page.evaluate(() => {
      const bookPods = Array.from(document.querySelectorAll('.product_pod'));

      const data = bookPods.map((book) => ({
        title: book.querySelector('h3 a').getAttribute('title'),
        price: book.querySelector('.price_color').innerText,
        imgSrc: book.querySelector('img').getAttribute('src'),
        rating: book.querySelector('.star-rating').getAttribute('class').split(' ')[1],
      }))

      return data
    });

    console.log(bookData)

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: browser,
        message: 'Success',
      }),
    };
 } catch(err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: err,
        message: 'Error',
      }),
    };
 }};