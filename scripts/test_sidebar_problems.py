import json
import time
import urllib.request
import subprocess
import websocket

PORT = 9227

class ChromeTestRunner:
    def __init__(self):
        self.proc = None
        self.ws = None
        self.msg_id = 0

    def start(self):
        cmd = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "--headless=new",
            f"--remote-debugging-port={PORT}",
            "--remote-allow-origins=*",
            "--user-data-dir=/tmp/chrome-cdp-sidebar-test-profile",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check"
        ]
        self.proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(2)

        req = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list")
        tabs = json.loads(req.read().decode())
        ws_url = tabs[0]["webSocketDebuggerUrl"]
        self.ws = websocket.create_connection(ws_url)

        self.send("Runtime.enable")
        self.send("Page.enable")
        self.send("DOM.enable")

    def stop(self):
        if self.ws:
            self.ws.close()
        if self.proc:
            self.proc.terminate()
            self.proc.wait()

    def send(self, method, params=None):
        self.msg_id += 1
        curr = self.msg_id
        payload = {"id": curr, "method": method, "params": params or {}}
        self.ws.send(json.dumps(payload))
        while True:
            res = json.loads(self.ws.recv())
            if res.get("id") == curr:
                return res.get("result", {})

    def evaluate(self, expr, await_promise=False):
        res = self.send("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": await_promise
        })
        if "exceptionDetails" in res:
            raise Exception(f"JS Exception: {res['exceptionDetails']}")
        return res.get("result", {}).get("value")

    def navigate(self, url):
        self.send("Page.navigate", {"url": url})
        time.sleep(2.5)

def run_tests():
    chrome = ChromeTestRunner()
    chrome.start()
    try:
        print("\n" + "=" * 60)
        print("TEST 1: INITIAL LOAD & ACTIVE DAY SIDEBAR PROBLEMS CHECK")
        print("=" * 60)
        chrome.navigate("http://localhost:8092/index.html")

        # Check Day 1 is expanded and has problem items
        day1_problems = chrome.evaluate("""
            Array.from(document.querySelectorAll('.roadmap-day-group')[0].querySelectorAll('.sidebar-problem-row'))
                .map(el => el.querySelector('.sidebar-problem-title').textContent.trim())
        """)
        print(f"Day 1 Problems in Sidenav: {day1_problems}")
        assert len(day1_problems) >= 3, f"Expected at least 3 problems for Day 1, got {len(day1_problems)}"
        assert any("Two Sum" in p for p in day1_problems), "Missing Two Sum in Day 1 sidebar"
        assert any("Contains Duplicate" in p for p in day1_problems), "Missing Contains Duplicate in Day 1 sidebar"
        assert any("Valid Anagram" in p for p in day1_problems), "Missing Valid Anagram in Day 1 sidebar"
        assert any("Distinct Numbers" in p for p in day1_problems), "Missing Distinct Numbers boss fight in Day 1 sidebar"
        print("PASS: Day 1 problem items rendered cleanly in sidebar!")

        print("\n" + "=" * 60)
        print("TEST 2: CLICK PROBLEM IN SIDENAV (JUMP TO PROBLEM)")
        print("=" * 60)
        # Click problem #3 (Contains Duplicate) in sidebar
        chrome.evaluate("""
            (function() {
                const row = document.querySelector('.sidebar-problem-row[data-problem-id=\"3\"]');
                if (row) row.click();
            })()
        """)
        time.sleep(0.3)

        active_id = chrome.evaluate("AppState.activeProblemId")
        active_idx = chrome.evaluate("AppState.activeProblemIndex")
        stage_title = chrome.evaluate("document.getElementById('wizardProblemTitle').textContent")
        is_row_active = chrome.evaluate("document.querySelector('.sidebar-problem-row[data-problem-id=\"3\"]').classList.contains('active')")

        print(f"Active Problem ID: {active_id}, Index: {active_idx}, Stage Title: '{stage_title}', Row Active: {is_row_active}")
        assert active_id == 3, f"Expected activeProblemId 3, got {active_id}"
        assert active_idx == 1, f"Expected activeProblemIndex 1, got {active_idx}"
        assert "Contains Duplicate" in stage_title, f"Stage title mismatch: {stage_title}"
        assert is_row_active, "Sidebar problem row for #3 should have .active class"
        print("PASS: Clicking problem in sidebar seamlessly opens that problem in the stage!")

        print("\n" + "=" * 60)
        print("TEST 3: EXPAND ALL PROBLEMS ACROSS ALL 30 DAYS")
        print("=" * 60)
        # Click Expand All button in sidebar header
        chrome.evaluate("toggleExpandAllSidebarProblems()")
        time.sleep(0.3)

        btn_text = chrome.evaluate("document.getElementById('btnToggleAllSidebarProblems').textContent")
        total_problems_in_sidebar = chrome.evaluate("document.querySelectorAll('.sidebar-problem-row').length")
        print(f"Button text: '{btn_text}', Total problem rows in sidenav: {total_problems_in_sidebar}")

        assert btn_text == "Collapse All", f"Expected button text 'Collapse All', got '{btn_text}'"
        assert total_problems_in_sidebar >= 100, f"Expected >= 100 problems & benchmarks in sidebar, got {total_problems_in_sidebar}"
        print(f"PASS: All 30 days expanded! All {total_problems_in_sidebar} problems are now visible in the sidenav!")

        print("\n" + "=" * 60)
        print("TEST 4: DIRECT JUMP TO PROBLEM ON ANOTHER DAY VIA SIDENAV")
        print("=" * 60)
        # Click problem #11 (Container With Most Water) on Day 4
        chrome.evaluate("""
            (function() {
                const row = document.querySelector('.sidebar-problem-row[data-problem-id=\"11\"]');
                if (row) row.click();
            })()
        """)
        time.sleep(0.4)

        current_day = chrome.evaluate("AppState.currentDay")
        current_prob_id = chrome.evaluate("AppState.activeProblemId")
        day_heading = chrome.evaluate("document.getElementById('dayHeading').textContent")
        prob_title = chrome.evaluate("document.getElementById('wizardProblemTitle').textContent")

        print(f"Current Day: {current_day}, Problem ID: {current_prob_id}")
        print(f"Day Heading: '{day_heading}', Wizard Title: '{prob_title}'")
        assert current_day == 4, f"Expected day 4, got {current_day}"
        assert current_prob_id == 11, f"Expected problem ID 11, got {current_prob_id}"
        assert "Valid Palindrome" in prob_title, f"Unexpected wizard title: {prob_title}"
        print("PASS: Cross-day navigation from sidebar problem item functions seamlessly!")

        print("\n" + "=" * 60)
        print("TEST 5: SEARCH / QUICK FILTER IN SIDENAV")
        print("=" * 60)
        # Search for "Palindrome"
        chrome.evaluate("filterSidebarRoadmap('Palindrome')")
        time.sleep(0.3)
        filtered_count = chrome.evaluate("document.querySelectorAll('.sidebar-problem-row').length")
        filtered_title = chrome.evaluate("document.querySelector('.sidebar-problem-title').textContent")
        print(f"Filtered Count for 'Palindrome': {filtered_count}, First Title: '{filtered_title}'")
        assert filtered_count >= 1, "Should find at least 1 match for Palindrome"
        assert "Palindrome" in filtered_title, "Should match Palindrome"

        # Clear filter
        chrome.evaluate("filterSidebarRoadmap('')")
        time.sleep(0.2)
        print("PASS: Sidebar problem search and filtering verified!")

        print("\n" + "=" * 60)
        print("ALL SIDENAV PROBLEM TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 60)

    finally:
        chrome.stop()

if __name__ == "__main__":
    run_tests()
