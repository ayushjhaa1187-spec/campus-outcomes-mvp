from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        cwd = os.getcwd()
        frontend_path = os.path.join(cwd, 'frontend')

        # Verify Login Page
        print(f"Navigating to file://{frontend_path}/login.html")
        page.goto(f'file://{frontend_path}/login.html', wait_until='domcontentloaded')
        page.screenshot(path='verification/login.png')
        print("Captured login.png")

        # Verify Register Page
        print(f"Navigating to file://{frontend_path}/register.html")
        page.goto(f'file://{frontend_path}/register.html', wait_until='domcontentloaded')
        page.screenshot(path='verification/register.png')
        print("Captured register.png")

        # Verify Dashboard Page
        print(f"Navigating to file://{frontend_path}/dashboard.html")
        page.goto(f'file://{frontend_path}/dashboard.html', wait_until='domcontentloaded')
        page.wait_for_timeout(1000)
        page.screenshot(path='verification/dashboard.png')
        print("Captured dashboard.png")

        browser.close()

if __name__ == "__main__":
    run()
