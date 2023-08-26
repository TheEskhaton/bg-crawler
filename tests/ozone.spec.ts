import { test } from '@playwright/test';
import OzoneCrawler from '../crawlers/OzoneCrawler';

test.setTimeout(240000)

test('Crawl Ozone Strategy', async ({ page }) => {
    await new OzoneCrawler("https://www.ozone.hr/slagalice-i-igre/drustvene-igre/strateske-igre/", "./data/ozoneStrategyProducts.json").crawl(page);
});

test('Crawl Ozone Family', async ({ page }) => {
    await new OzoneCrawler("https://www.ozone.hr/slagalice-i-igre/drustvene-igre/obiteljske-igre/", "./data/ozoneFamilyProducts.json").crawl(page);
});

test('Crawl Ozone Fun', async ({ page }) => {
    await new OzoneCrawler("https://www.ozone.hr/slagalice-i-igre/drustvene-igre/zabavne-igre/", "./data/ozoneFunProducts.json").crawl(page);
});

