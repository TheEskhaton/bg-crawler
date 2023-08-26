import { Page } from "@playwright/test";
import BaseCrawler from "./BaseCrawler";


export default class OmensCrawler extends BaseCrawler {

    fileName: string = "./data/omensProducts.json";
    protected async processPage(page: Page, pageNumber: number) {
        await page.goto(`https://magicomens.com/collections/boardgames?page=${pageNumber}`);
        const productElements = await page.locator('.product-item').all();
        for (const productEl of productElements) {
            const name = await productEl.locator('.product-item__title').textContent();
            const price = await productEl.locator('.money').first().textContent();
            const available = await productEl.locator('.product-item__action-button').first().isEnabled();
            this.products.push({ name: String(name), price: Number(price?.replace('€', '')), available });
        }
    }

    public async crawl(page: Page) {
        await page.goto(`https://magicomens.com/collections/boardgames`);
        const lastPageLink = await page.locator(".pagination__nav > .pagination__nav-item").last()
        const numberOfPages = Number(await lastPageLink.textContent());
        for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
            console.log("Processing page %d", pageNumber);
            await this.processPage(page, pageNumber);
            console.log("Found %d products", this.products.length);
        }

        await this.save();
    }
}