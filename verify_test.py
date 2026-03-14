import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        print("Navigating to http://localhost:3000/")
        await page.goto("http://localhost:3000/")

        # Give page time to load
        await page.wait_for_timeout(2000)

        # Selectors: There might be more or fewer selects
        selects = await page.locator("select").all()
        print(f"Found {len(selects)} selects")

        for i, select in enumerate(selects):
            val = await select.evaluate("el => el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : 'No selection'")
            print(f"Select {i} value: {val}")

        # Find the submit button for voting
        submit_btn = page.locator("button:has-text('Connectez-vous pour voter')")
        if not await submit_btn.is_visible():
            submit_btn = page.locator("button:has-text('Voter maintenant')")

        if await submit_btn.is_visible():
            print("Submit button text:", await submit_btn.inner_text())
            await submit_btn.click()
            await page.wait_for_timeout(1000)

            # Check for error toast
            toast = page.locator(".fixed.top-4.right-4.z-50")
            if await toast.is_visible():
                print("Toast appeared:", await toast.inner_text())
        else:
            print("Submit button not found!")

        await browser.close()

asyncio.run(run())
