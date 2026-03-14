from playwright.sync_api import sync_playwright
import time

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:3000/")

        # We don't even need to submit to test validation, wait actually we do.
        # Let's take a screenshot before clicking to see what's happening
        page.locator("button:has(i.fa-vote-yea)").click()
        page.wait_for_timeout(1000)

        login_btn = page.locator("button:has(i.fa-sign-in-alt)")
        if login_btn.count() > 0:
            login_btn.click()
            page.wait_for_timeout(500)
            page.locator("input[type='email']").fill("testuser@example.com")
            page.locator("input[type='password']").fill("password123")
            page.locator("button[type='submit']").click()
            page.wait_for_timeout(4000)

        page.screenshot(path="debug_pw.png")
        browser.close()
except Exception as e:
    print("Error:", e)
