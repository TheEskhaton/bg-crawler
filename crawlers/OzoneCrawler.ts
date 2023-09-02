import { Page } from "@playwright/test";
import BaseCrawler from "./BaseCrawler";

export default class OzoneStrategyCrawler extends BaseCrawler {
    private baseUri: string;
    fileName: string = "./data/ozoneStrategyProducts.json";
    protected async processPage(page: Page, pageNumber: number) {
        await page.goto(`${this.baseUri}?limit=100&p=${pageNumber}`);
        console.log(pageNumber)
        const productElements = await page.locator('.product-box').all();
        for (const productEl of productElements) {
            const name = await productEl.locator('.title').textContent();
            let price : string | null = "";
            const discountIsVisible = await productEl.locator('.special-price > .price').first().isVisible();
            if(discountIsVisible) {
                price = await productEl.locator('.special-price > .price').first().textContent();
            }
            else {
                price = await productEl.locator('.price-box  .price').first().textContent();
            }
            const available = true;
            this.products.push({
                name: String(name)
                    .replace(/\n/g, '')
                    .replace('Društvena igra ', '')
                    .replace('- strateška', '')
                    .replace('- obiteljska', '')
                    .replace('- kooperativna', '')
                    .replace('- zabava', '')
                    .replace('- zabavna', '')
                    .replace(', strateška', '')
                    .replace('za dvoje ', '')
                    .replace('Proširenje za društvenu igru ', '')
                    .replace('Proširenje za kartašku igru ', '')
                    .trim(),
                price: Number(price?.replace('€', '').replace(',', '.').replace(' ', '').replace(/\n/g, '')),
                available,
                dateCrawled: new Date()
            });
        }
    }

    public async crawl(page: Page) {
        await page.goto(`${this.baseUri}?limit=100`);
        const lastPageLink = await page.locator(".pages > a:has(+ .next)").first();
        const numberOfPages = Number(await lastPageLink.textContent());
        for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
            console.log("Processing page %d", pageNumber);
            await this.processPage(page, pageNumber);
            console.log("Found %d products", this.products.length);
        }

        await this.save();
    }
    /**
     *
     */
    constructor(baseUri: string, fileName?: string) {
        super();
        this.baseUri = baseUri;
        this.fileName = fileName || this.fileName;
    }
}