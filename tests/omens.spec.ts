import { test } from '@playwright/test';
import OmensCrawler from '../crawlers/OmensCrawler';

test.setTimeout(240000)

test('Crawl Magic Omens', async ({ page }) => {
    await new OmensCrawler().crawl(page);
});


