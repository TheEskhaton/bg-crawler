import { Page } from "@playwright/test";
import BaseCrawler from "./BaseCrawler";


export default class SvarogCrawler extends BaseCrawler {

    fileName: string = "./data/svarogProducts.json";
    protected async processPage(page: Page, pageNumber: number) {
        await page.goto(`https://svarogsden.com/board-games-shop/page/${pageNumber}/?filters=product_cat[22]`);
        const productElements = await page.locator('.product_cat-card').all();
        for (const productEl of productElements) {
          const name = await productEl.locator('.woocommerce-loop-product__title').textContent();
          const price = await productEl.locator('bdi').first().textContent();
          const available = await productEl.locator('.ajax_add_to_cart').first().isVisible();
          this.products.push({ name: String(name), price: Number(price?.replace('€', '').replace(',', '.').replace(' ', '')), available,  dateCrawled: new Date() });
        }
    }

    public async crawl(page: Page) {
        await page.goto(`https://svarogsden.com/board-games-shop/?filters=product_cat[22]`);
        const lastPageLink = await page.locator(".page-numbers > li").nth(7);
        const numberOfPages = Number(await lastPageLink.textContent());
      
      
        for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
          console.log("Processing page %d", pageNumber);
          await this.processPage(page, pageNumber);
          console.log("Found %d products", this.products.length);
        }
      
        await this.save();
    }
}