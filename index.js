const puppeteer = require('puppeteer');

async function scrapeProductInfo(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const productInfo = await page.evaluate(() => {
        function getBestImage() {
            const images = document.querySelectorAll('img');
            let bestImage = '';
            let maxArea = 0;
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                const area = rect.width * rect.height;
                if (area > maxArea) {
                    maxArea = area;
                    bestImage = img.src;
                }
            });
            return bestImage || 'Image not found';
        }
        function getPrice() {
            const pricePatterns = [/(\$|€|£|₹)\s?\d+[\.,]?\d*/g];
            let priceText = '';
            let maxMatches = 0;
            // Check all text nodes for price patterns
            const treeWalker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            while (treeWalker.nextNode()) {
                const node = treeWalker.currentNode;
                pricePatterns.forEach(pattern => {
                    const matches = node.textContent.match(pattern);
                    if (matches && matches.length > maxMatches) {
                        maxMatches = matches.length;
                        priceText = matches[0];
                    }
                });
            }
            return priceText || 'Price not found';
        }
        const productImage = getBestImage();
        const productPrice = getPrice();
        return { productImage, productPrice };
    });
    console.log(productInfo);
    await browser.close();
}
// Example usage:
// Replace the URL with a valid product URL from any website
scrapeProductInfo('https://www.apple.com/in/iphone-15/?afid=p238%7CsdUuvv563-dc_mtid_187079nc38483_pcrid_702926213930_pgrid_109516736379_pntwk_g_pchan__pexid_131393514416_ptid_kwd-10778630_&cid=aos-IN-kwgo-brand--slid-a0Uo8oxy--product-');