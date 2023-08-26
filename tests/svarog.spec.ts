import { test } from '@playwright/test';
import SvarogCrawler from '../crawlers/SvarogCrawler';

test.setTimeout(240000)

test('Crawl Svarogs Den', async ({ page }) => {
    await new SvarogCrawler().crawl(page);
});
