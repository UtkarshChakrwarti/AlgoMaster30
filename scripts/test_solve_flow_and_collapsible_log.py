import json
import time
import urllib.request
import subprocess
import websocket

PORT = 9223

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
            "--user-data-dir=/tmp/chrome-cdp-test-profile",
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

    def evaluate(self, expr):
        res = self.send("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": False
        })
        if "exceptionDetails" in res:
            raise Exception(f"JS Exception in '{expr}': {res['exceptionDetails']}")
        return res.get("result", {}).get("value")

    def navigate(self, url):
        self.send("Page.navigate", {"url": url})
        time.sleep(2)

def run():
    runner = ChromeTestRunner()
    try:
        runner.start()
        print("Chrome connected successfully!")
        runner.navigate("http://localhost:8092/index.html")

        # 1. Switch to Day 1, Solve subtab
        runner.evaluate("switchDay(1, true); switchDaySubTab('solve');")
        time.sleep(0.3)
        prob_title = runner.evaluate("document.getElementById('wizardProblemTitle').textContent")
        print(f"Problem 1 active: '{prob_title}'")
        assert "Two Sum" in prob_title, "Expected Two Sum"

        # 2. Advance to Step 2
        runner.evaluate("setProblemStep(2)")
        time.sleep(0.2)
        step2_btn = runner.evaluate("document.getElementById('btnStep2MarkSolved').textContent.trim()")
        print(f"Step 2 Mark Solved Button: '{step2_btn}'")
        assert "Mark as Solved" in step2_btn

        # 3. Quick Mark as Solved in Step 2 (without filling debrief)
        runner.evaluate("quickMarkProblemSolved(true)")
        time.sleep(0.3)

        # Check mastery state
        mastery = runner.evaluate("AppState.mastery[1]")
        print(f"Mastery for Problem 1: '{mastery}'")
        assert mastery == "cold", f"Expected cold mastery, got {mastery}"

        # Check Step 3 success card
        success_vis = runner.evaluate("document.getElementById('step3QuickSuccessCard').style.display")
        success_title = runner.evaluate("document.querySelector('#step3QuickSuccessCard .success-title').textContent")
        next_btn_text = runner.evaluate("document.getElementById('btnStep3NextProblem').textContent.trim()")
        print(f"Success card display: '{success_vis}', title: '{success_title}'")
        print(f"Next problem button text: '{next_btn_text}'")
        assert success_vis == "flex", "Success card should be visible"
        assert "Contains Duplicate" in next_btn_text, f"Expected Contains Duplicate in next button, got {next_btn_text}"

        # Check Interview Pitch unlocked
        pitch_vis = runner.evaluate("document.getElementById('wizardPitchRewardCard').style.display")
        print(f"Pitch script card display: '{pitch_vis}'")
        assert pitch_vis == "flex", "Pitch script card should be visible and unlocked"

        # Check problem pills show ✓ Cold
        pill_badge = runner.evaluate("document.querySelector('#dailyProblemPills .practice-pill-btn').innerHTML")
        print(f"Problem pill contains checkmark: {'✓ Cold' in pill_badge}")
        assert "✓ Cold" in pill_badge, "Problem pill should have ✓ Cold badge"

        # 4. Advance to Next Problem via Next button
        runner.evaluate("advanceToNextDailyProblem()")
        time.sleep(0.3)
        prob2_title = runner.evaluate("document.getElementById('wizardProblemTitle').textContent")
        prob2_idx = runner.evaluate("AppState.activeProblemIndex")
        print(f"Navigated to Problem 2: '{prob2_title}', Index: {prob2_idx}")
        assert prob2_idx == 1, "Expected index 1 for Problem 2"
        assert "Contains Duplicate" in prob2_title, "Expected Contains Duplicate"

        # 5. On Problem 2, test Step 3 direct quick mark & next
        runner.evaluate("setProblemStep(3)")
        time.sleep(0.2)
        quick_next_btn = runner.evaluate("document.getElementById('btnStep3QuickNext').textContent.trim()")
        print(f"Step 3 Quick Next button: '{quick_next_btn}'")
        assert "Next Problem" in quick_next_btn

        # Mark solved & next problem in one shot
        runner.evaluate("quickMarkAndNextProblem()")
        time.sleep(0.3)
        prob3_idx = runner.evaluate("AppState.activeProblemIndex")
        prob3_title = runner.evaluate("document.getElementById('wizardProblemTitle').textContent")
        print(f"One-shot solve & jump to Problem 3: '{prob3_title}', Index: {prob3_idx}")
        assert prob3_idx == 2, "Expected index 2 for Problem 3"
        assert "Valid Anagram" in prob3_title, "Expected Valid Anagram"

        # Check Problem 2 is marked cold
        mastery2 = runner.evaluate("AppState.mastery[3]")
        print(f"Mastery for Problem 2 (id 3): '{mastery2}'")
        assert mastery2 == "cold", "Expected Problem 2 to be cold"

        # 6. Check last problem of day next button
        runner.evaluate("quickMarkProblemSolved(true)")
        time.sleep(0.2)
        next_day_btn = runner.evaluate("document.getElementById('btnStep3NextProblem').textContent.trim()")
        print(f"Problem 3 (last problem of day) next button: '{next_day_btn}'")
        assert "Day 2" in next_day_btn or "Day 1 Conquered" in next_day_btn

        # 7. Check Profile view collapsible Mistake Journal
        curr_view = runner.evaluate("AppState.currentView")
        timer_run = runner.evaluate("TimerEngine.isTimerRunning()")
        modal_open = runner.evaluate("document.getElementById('appleCustomDialogModal').classList.contains('open')")
        print(f"Before switchView: view={curr_view}, timer={timer_run}, modal={modal_open}")

        runner.evaluate("switchView('profile')")
        time.sleep(0.3)
        curr_view_after = runner.evaluate("AppState.currentView")
        modal_open_after = runner.evaluate("document.getElementById('appleCustomDialogModal').classList.contains('open')")
        print(f"After switchView: view={curr_view_after}, modal={modal_open_after}")
        journal_details = runner.evaluate("document.getElementById('profileJournalDetails') !== null")
        print(f"Collapsible journal details element exists: {journal_details}")
        assert journal_details, "profileJournalDetails should exist"

        filter_count = runner.evaluate("document.querySelectorAll('#journalFilterPills .journal-filter-btn').length")
        print(f"Journal filter pills count: {filter_count}")
        assert filter_count == 4, f"Expected 4 filter pills, got {filter_count}"

        # Test filter switching
        runner.evaluate("filterJournalByOutcome('cold')")
        time.sleep(0.2)
        active_filter = runner.evaluate("journalLogState.activeFilter")
        print(f"Active filter: '{active_filter}'")
        assert active_filter == "cold"

        # Test accordion row toggle
        rows = runner.evaluate("document.querySelectorAll('.journal-card-item').length")
        print(f"Rendered journal items: {rows}")
        if rows > 0:
            runner.evaluate("toggleJournalItemDetails(0)")
            body_display = runner.evaluate("document.getElementById('journalBody_0').style.display")
            print(f"Toggled first row body display: '{body_display}'")
            assert body_display == "flex", "Expanded row should be flex"

        # Test search filter
        runner.evaluate("filterJournalLog('Two Sum')")
        time.sleep(0.2)
        search_query = runner.evaluate("journalLogState.searchQuery")
        assert search_query == "Two Sum"

        print("\nALL SOLVE FLOW & COLLAPSIBLE LOG TESTS PASSED WITH 100% SUCCESS!")

    finally:
        runner.stop()

if __name__ == "__main__":
    run()
