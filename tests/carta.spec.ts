import { test } from '@playwright/test';
import CartaCrawler from '../crawlers/CartaCrawler';

test.setTimeout(240000)

test('Crawl Carta Magica', async ({ page }) => {
    await new CartaCrawler().crawl(page);
});


