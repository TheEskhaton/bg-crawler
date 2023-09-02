import { Page } from "@playwright/test";
import { Product } from "../types";
import { writeFile } from 'fs/promises';
export default abstract class BaseCrawler {
    protected products : Product[] = [];
    protected abstract fileName : string;
    protected abstract processPage(page: Page, pageNumber: number) : void;

    protected async save() {
        await writeFile(this.fileName, JSON.stringify({ products: this.products }, undefined, ' '));

    }

    public abstract crawl(page: Page) : void;
}