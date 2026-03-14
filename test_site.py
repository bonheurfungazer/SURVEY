import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:3000/")
        await page.wait_for_timeout(3000)

        # Take a screenshot to see what's actually rendering
        await page.screenshot(path="site_render.png", full_page=True)

        print("Done. Check site_render.png")
        await browser.close()

asyncio.run(run())
