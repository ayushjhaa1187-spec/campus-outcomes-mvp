from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Disable JS
        context = browser.new_context(java_script_enabled=False)
        page = context.new_page()

        cwd = os.getcwd()
        frontend_path = os.path.join(cwd, 'frontend')

        # Verify Login Page
        print(f"Navigating to file://{frontend_path}/login.html")
        page.goto(f'file://{frontend_path}/login.html')
        page.screenshot(path='verification/login_nojs.png')
        print("Captured login_nojs.png")

        browser.close()

if __name__ == "__main__":
    run()
