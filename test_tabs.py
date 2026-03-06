from playwright.sync_api import sync_playwright

def test_tabs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Test Home Tab
        home_visible = page.locator("text=L'API Unifiée").first.is_visible()
        print(f"Écran 1 (Home) visible: {home_visible}")

        # Click Vote Tab
        page.locator("button:has(i.fa-vote-yea)").click()
        page.wait_for_timeout(500)
        vote_visible = page.locator("text=Votez le prochain LLM").first.is_visible()
        print(f"Écran 2 (Vote) visible: {vote_visible}")

        # Click Admin Tab
        page.locator("button:has(i.fa-chart-line)").click()
        page.wait_for_timeout(500)
        admin_visible = page.locator("text=ADMIN CONSOLE").first.is_visible()
        print(f"Écran 3 (Admin) visible: {admin_visible}")

        if home_visible and vote_visible and admin_visible:
            print("✅ Tous les 3 écrans fonctionnent parfaitement et la navigation est fluide !")
        else:
            print("❌ Problème détecté avec la navigation.")

        browser.close()

if __name__ == "__main__":
    test_tabs()
