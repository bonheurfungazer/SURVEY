from playwright.sync_api import sync_playwright

def test_functionalities():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        print("--- Test des fonctionnalités ---")

        # 1. Test Navigation to Vote Tab
        page.locator("button:has(i.fa-vote-yea)").click()
        page.wait_for_timeout(500)

        # 2. Test Slider Reactivity (Alpine.js)
        print("Vérification de la réactivité du slider d'intensité...")
        # Get initial value text
        initial_text = page.locator("span.text-success.bg-success\\/10").inner_text()
        print(f"Valeur initiale: {initial_text}")

        # Change slider value
        # The input is type="range", we can evaluate JS to change its value and dispatch input event
        page.evaluate('''() => {
            const slider = document.querySelector('input[type="range"]');
            slider.value = 5;
            slider.dispatchEvent(new Event('input'));
        }''')
        page.wait_for_timeout(500)

        # Get updated value text
        new_text = page.locator("span.text-success.bg-success\\/10").inner_text()
        print(f"Nouvelle valeur après modification: {new_text}")

        if new_text == "5/10":
            print("✅ La réactivité Alpine.js fonctionne parfaitement (slider lié au texte).")
        else:
            print("❌ Erreur de réactivité sur le slider.")

        # 3. Test Text Input
        print("Vérification de la saisie de texte...")
        email_input = page.locator("input[placeholder='Email ou n° WhatsApp']")
        email_input.fill("test@example.com")
        input_value = email_input.input_value()
        print(f"Valeur saisie dans l'email: {input_value}")
        if input_value == "test@example.com":
            print("✅ Le champ de saisie fonctionne correctement.")
        else:
            print("❌ Erreur sur le champ de saisie.")

        # 4. Check "Soumettre" button
        print("Vérification du bouton de soumission...")
        submit_btn = page.locator("button:has-text('Soumettre mon vote')")
        if submit_btn.is_visible() and submit_btn.is_enabled():
            print("✅ Le bouton de soumission est interactif.")

        browser.close()

if __name__ == "__main__":
    test_functionalities()
