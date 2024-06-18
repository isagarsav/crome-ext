const puppeteer = require('puppeteer');

async function scrapeProductInfo(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let productInfo = {};

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    productInfo = await page.evaluate(() => {
      const getImageSelector = () =>
        [
          'img , img[aria-label] , .product-image, .product-image-main, .main-image, .primary-image, ._396cs4, ._0DkuPH, ._2r_T1I, #imgTagWrapperId img, .s-image'
        ]

      const getPriceSelector = () =>
        [
          'span[class*="price"], span[class*="Price"], span[class*="a-color-price"], span[id="priceblock_ourprice"], span[id="priceblock_dealprice"], ._30jeq3, .CxhGGd , [aria-label*="price"], [aria-label*="Price"] , .product-price, .price, .amount, .a-price-whole, .a-price-fraction, ._30jeq3, .CxhGGd',
        ]

      const getNameSelector = () =>
 [
          'span[id="productTitle"], span[class*="B_NuCI"], .VU-ZEz, .chakra-heading, .css-15dmqho ,meta[property="og:title"] , [aria-label*="product name"], [aria-label*="Product Name"], .chakra-heading, .css-15dmqho, .product-title, .product-name, .title, .chakra-heading, .css-15dmqho,h1']

      function getBestImage() {
        const images = Array.from(
          document.querySelectorAll(getImageSelector())
        );
        console.log('Images found:', images.length);
        const bestImage = images.reduce(
          (best, img) => {
            const rect = img.getBoundingClientRect();
            const area = rect.width * rect.height;
            return area > best.area ? { src: img.src, area } : best;
          },
          { src: '', area: 0 }
        );
        return bestImage.src || 'Image not found';
      }

      function getPrice() {
        const priceElement = document.querySelector(getPriceSelector());
        console.log('Price element:', priceElement);
        if (priceElement) {
          const priceText = (
            priceElement.innerText ||
            priceElement.textContent ||
            ''
          )
            .trim()
            .replace(/\s+/g, ' ');
          return priceText || 'Price not found';
        }
        return 'Price not found';
      }

      function getProductName() {
        const nameElement = document.querySelector(getNameSelector());
        console.log('Name element:', nameElement);
        if (nameElement) {
          const productName = (
            nameElement.innerText ||
            nameElement.textContent ||
            nameElement.getAttribute('content') ||
            ''
          ).trim();
          return productName || 'Product name not found';
        }
        return 'Product name not found';
      }

      return {
        productImage: getBestImage(),
        productPrice: getPrice(),
        productName: getProductName(),
      };
    });

    console.log(productInfo);
  } catch (error) {
    console.error('Error scraping the product info:', error);
  } finally {
    await browser.close();
  }
}
const urls = [
  'https://www.flipkart.com/bersache-premium-sports-gym-trending-stylish-running-shoes-walking-men/p/itmfaaf21d9d98cb?pid=SHOHFGZDK24ZK87E&lid=LSTSHOHFGZDK24ZK87EF8S9PR&marketplace=FLIPKART&store=osp%2Fcil%2F1cu&srno=b_1_1&otracker=pp_reco_You%2Bmight%2Bbe%2Binterested%2Bin_3_37.dealCard.OMU_cid%3AS_F_N_osp_cil_1cu__d_70-100__NONE_ALL%3Bnid%3Aosp_cil_1cu_%3Bet%3AS%3Beid%3Aosp_cil_1cu_%3Bmp%3AF%3Bct%3Ad%3Bat%3ADEFAULT%3B&otracker1=pp_reco_PINNED_productRecommendation%2FAugmentSelling_You%2Bmight%2Bbe%2Binterested%2Bin_BANNER_HORIZONTAL_dealCard_cc_3_NA_view-all&fm=search-autosuggest&iid=en_c-CwN5k3G-EYccqz4supE7XeNWlpk3kLbgDOGTYgOIBT7SFaS4jokDAtfPo5smHxCFCkDxWgW0F9rCDuQtgwj_UFjCTyOHoHZs-Z5_PS_w0%3D&ppt=browse&ppn=browse',
  'https://www.amazon.in/Fastrack-Earbuds-Playtime-Crystal-NitroFast/dp/B0C1PC9Y9D/?_encoding=UTF8&pd_rd_w=hs0oC&content-id=amzn1.sym.721fe359-5b18-49d2-bb73-de80fe9d4a7b%3Aamzn1.symc.acc592a4-4352-4855-9385-357337847763&pf_rd_p=721fe359-5b18-49d2-bb73-de80fe9d4a7b&pf_rd_r=ZAGMRNH4MQ12KWPZYD36&pd_rd_wg=JMrXI&pd_rd_r=ec5eef20-647f-499f-a5d8-29cab90f6133&ref_=pd_hp_d_btf_ci_mcx_mr_hp_d',
  'https://uae.sharafdg.com/product/apple-iphone-15-pro-256gb-white-titanium-with-facetime-middle-east-version/?promo=3257232&dg=false',
  'https://www.gap.ae/everyday-soft-henley-t-shirt/1TO216950583xWICKER.html?color=WICKER&size=XS&pid=216951662',
  'https://www.rivolishop.com/en-ae/product/00Tissot-TISSOT-PRX-T137-407-11-351-00',
  'https://www.sivvi.com/uae-en/ZC351A8922633CD22677FZ-1/p/',
  'https://en-ae.rituals.com/the-ritual-of-oudh-foaming-shower-gel-rt-1116066-multi.html',
  'https://www.clarksstores.ae/collections/womens-sandals/products/womens-mira-bay-261772864',
  'https://thebodyshop.ae/en/ginger-anti-dandruff-shampoo-p198000',
  'https://storeus.com/emporio-armani-womens-ar11355-watch-rose-gold-2',
  'https://en-ae.tommy.com/contrast-heel-leather-cupsole-trainers-th-en0en02273bds.html',
  'https://ae.cosstores.com/en/buy-scoop-neck-ribbed-swimsuit-black-dark.html',
  'https://stylishop.com/bh/en/product-styli-limited-paisley-print-square-neck-shirred-top-7004976436',
  'https://en-ae.crocsgulf.com/toddlers-crocband-cruiser-shark-sandal-cr-210031-007-light-grey.html',
  'https://ae.puma.com/mb-03-kid-super-basketball-shoes-379328-01.html?color=16474',
  'https://tedbaker.ae/products/avinnn-floral-off-the-shoulder-maxi-cover-up-natural',
  'https://www.noon.com/uae-en/65-inch-crystal-uhd-4k-smart-tv-2023-65cu7000-ua65cu7000uxzn-black/N53398626A/p/?o=c7e6279066c6d0ed',
  'https://www.swarovski.ae/harmonia-stud-earrings-cushion-cut-gold-tone-gold-tone-plated/5640044.html',
  'https://www.clarksstores.ae/collections/view-all-kids/products/girls-tidal-star-toddler-261760636',
  'https://www.sandro.ae/products/sfpju01136-slit-midi-skirt-black',
  'https://www.basharacare.com/ae_en/skinceuticals-c-e-ferulic-30ml',
  'https://www.namshi.com/uae-en/buy-adidas-originals-handball-spezial/Z4006CFED7CE678F970D2Z/p/',
  'https://www.aldoshoes.me/ae/en/call-it-spring/adreddia-cis-30adreddia600-red-ss24.html',
  'https://www.watsons.ae/products/alia-tea-tree-face-oil-10ml?variant=43812122853620',
  'https://www.aceuae.com/en-ae/living-space-metal-5-tier-storage-shelf-90-x-50-x-180-cm/258596.html',
  'https://en-ae.dropkicks.com/new-balance-bb550-shoes/NBBB550VGB-D.html',
  'https://www.underarmour.ae/en/mens-ua-launch-short-sleeve/UA1383233-001.html',
  'https://www.linzi.me/en-ae/petra-blue-petra-blue.html',
  'https://bloomingdales.ae/soraia-bodysuit-CLO217110760xYellow.html',
  'https://www.joigifts.com/en-ae/dubai',
  'https://en-ae.sssports.com/nike-mens-giannis-immortality-3-basketball-shoes/NKDZ7533-100.html',
  'https://theluxurycloset.com/uae-en/',
  'https://www.fnp.ae/gift/get-well-soon-wishes-basket?promo=desk_hp_row1_pos_1',
  'https://www.danubehome.com/ae/en/p/helen-180x200-king-bed-2-night-stand-grey-gold-810100100336',
  'https://www.mumzworld.com/en/sugar-rush-2pc-set-short-sleeves-shirt-shorts-green',
  'https://www.levelshoes.com/duke-dexter-wilde-sacred-spring-penny-loafers-black-leather-men-loafers-6goeuj.html',
  'https://www.ounass.ae/shop-oris-aquis-date-calibre-400-watch-36-5mm-for-unisex-217291513_13.html',
  'https://uae.sharafdg.com/product/apple-iphone-15-pro-256gb-white-titanium-with-facetime-middle-east-version/?promo=3257232&dg=false',
  ,
  'https://me.fragrance.com/en-ae/white-diamonds-edt-spray-3-3-oz-121881.html',
];

async function render() {
  for await (const url of urls) {
    console.log({ url });
    await scrapeProductInfo(url);
  }
}
render();
