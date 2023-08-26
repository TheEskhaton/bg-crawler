import { Page } from "@playwright/test";
import BaseCrawler from "./BaseCrawler";


export default class CartaCrawler extends BaseCrawler {

    fileName: string = "./data/cartaProducts.json";
    protected async processPage(page: Page, pageNumber: number) {
        await page.goto(`https://www.cartamagica.hr/kategorija/6/${pageNumber}/boardgames`);
        const productElements = await page.locator('.ebox').all();
        for (const productEl of productElements) {
          const name = await productEl.locator('.prom').textContent();
          const price = await productEl.locator('.proc > b').first().textContent();
          const available = true;
          this.products.push({ name: String(name).replace(/\n/g, ''), price: Number(price?.replace('eur', '').replace(',', '.').replace(' ', '')), available });
        }
    }

    public async crawl(page: Page) {
        await page.goto(`https://www.cartamagica.hr/kategorija/6/1/boardgames`);
        const lastPageLink = await page.locator(".pg2").first();
        const numberOfPages = Number((await lastPageLink.textContent())?.split('/')[1].replace(' ', ''));
        for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
          console.log("Processing page %d", pageNumber);
          await this.processPage(page, pageNumber);
          console.log("Found %d products", this.products.length);
        }
      
        await this.save();
    }
}