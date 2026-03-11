from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to frontend files
        cwd = os.getcwd()
        frontend_path = os.path.join(cwd, 'frontend')

        # Verify Login Page
        page.goto(f'file://{frontend_path}/login.html')
        page.screenshot(path='verification/login.png')
        print("Captured login.png")

        # Verify Register Page
        page.goto(f'file://{frontend_path}/register.html')
        page.screenshot(path='verification/register.png')
        print("Captured register.png")

        # Verify Dashboard Page
        page.goto(f'file://{frontend_path}/dashboard.html')
        # Dashboard might try to load data and fail, but we want to see the layout
        # Wait a bit for layout
        page.wait_for_timeout(1000)
        page.screenshot(path='verification/dashboard.png')
        print("Captured dashboard.png")

        browser.close()

if __name__ == "__main__":
    run()
