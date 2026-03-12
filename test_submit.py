import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Grant clipboard-read to avoid permission errors
        context = await browser.new_context(permissions=['clipboard-read', 'clipboard-write'])
        page = await context.new_page()

        await page.goto("http://localhost:3000/")
        await page.wait_for_timeout(2000)

        # Click vote tab
        tabs = await page.locator("nav button, .fixed.bottom-4 button").all()
        for i, tab in enumerate(tabs):
            if "fa-vote-yea" in await tab.inner_html():
                await tab.click()
                break

        await page.wait_for_timeout(1000)

        # Take screenshot of vote tab
        await page.screenshot(path="vote_tab_submit.png", full_page=True)

        # Test clicking submit button - "Connectez-vous pour voter" actually just opens the login modal.
        # But if the user is authenticated, it says "Voter maintenant".
        # Let's mock a logged in state or just click the connect button to check behavior.
        buttons = await page.locator("button").all()
        for btn in buttons:
            text = await btn.inner_text()
            if "Connectez-vous pour voter" in text:
                print(f"Found submit button: {text}")
                await btn.click()
                await page.wait_for_timeout(1000)
                await page.screenshot(path="after_click_connect.png")
                break

        await browser.close()

asyncio.run(run())
