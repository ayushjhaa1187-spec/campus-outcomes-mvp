from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Login Page
        print("Navigating to login.html")
        page.goto('http://localhost:8000/frontend/login.html')
        page.screenshot(path='verification/login.png')
        print("Captured login.png")

        # Verify Register Page
        print("Navigating to register.html")
        page.goto('http://localhost:8000/frontend/register.html')
        page.screenshot(path='verification/register.png')
        print("Captured register.png")

        # Verify Dashboard Page
        print("Navigating to dashboard.html")
        page.goto('http://localhost:8000/frontend/dashboard.html')
        page.wait_for_timeout(1000)
        page.screenshot(path='verification/dashboard.png')
        print("Captured dashboard.png")

        browser.close()

if __name__ == "__main__":
    run()
