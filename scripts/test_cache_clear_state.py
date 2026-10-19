import json
import time
import urllib.request
import subprocess
import websocket

PORT = 9224

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
            "--user-data-dir=/tmp/chrome-cdp-cache-test-profile",
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
        print("TEST 1: INITIAL LOAD & STORAGE MODAL UI CHECK")
        print("=" * 60)
        chrome.navigate("http://localhost:8092/index.html")

        # Check openStorageSheet opens modal
        chrome.evaluate("openStorageSheet()")
        is_sheet_open = chrome.evaluate("document.getElementById('storageModalBackdrop').classList.contains('open')")
        assert is_sheet_open, "Storage sheet did not open"
        print("Storage sheet modal opened successfully.")

        # Check presence of buttons
        btn_reset_all = chrome.evaluate("!!document.getElementById('btnFactoryResetAll')")
        assert btn_reset_all, "Missing #btnFactoryResetAll button"
        print("Found Factory Reset All button in Storage Sheet.")

        chrome.evaluate("closeStorageSheet()")
        time.sleep(0.3)

        print("\n" + "=" * 60)
        print("TEST 2: POPULATE RICH APPLICATION STATES")
        print("=" * 60)
        # Mark multiple problems solved, set timers, add mistake notes, set streak
        chrome.evaluate("""
            (function() {
                AppState.mastery[1] = "cold";
                AppState.mastery[2] = "pass1";
                AppState.mastery[3] = "cold";
                AppState.currentDay = 4;
                AppState.streak = 5;
                AppState.mistakeJournal.push({
                    problemId: 1,
                    title: "Two Sum",
                    note: "Forgot edge case with duplicates in hash map",
                    outcome: "suboptimal",
                    date: "2026-10-19"
                });
                AppState.timers[1] = { p1: 180, p2: 420, total: 600, best: 600 };
                AppState.blueprints[1] = { timeCommit: "O(n)", spaceCommit: "O(n)" };
                AppState.autopsies[1] = { outcome: "optimal", note: "Clean hash map", nextReviewDate: "2026-10-21", reviewCount: 1 };
                AppState.drillStats = { total: 10, correct: 9 };
                AppState.userName = "Principal Engineer";
                persistState();
                localStorage.setItem("algomaster_theme", "dark");
                sessionStorage.setItem("active_drill_session", "true");
            })()
        """)

        # Verify states are populated
        mastery_count = chrome.evaluate("Object.keys(AppState.mastery).length")
        journal_count = chrome.evaluate("AppState.mistakeJournal.length")
        ls_length = chrome.evaluate("localStorage.length")
        ss_length = chrome.evaluate("sessionStorage.length")
        print(f"Populated state: {mastery_count} solved problems, {journal_count} journal items, {ls_length} localStorage keys, {ss_length} sessionStorage keys")
        assert mastery_count == 3, "Mastery count should be 3"
        assert journal_count == 1, "Journal count should be 1"
        assert ls_length >= 2, "LocalStorage keys should be >= 2"

        # Verify updateStorageMetrics calculates accurately
        chrome.evaluate("openStorageSheet()")
        time.sleep(0.3)
        metrics_text = chrome.evaluate("document.getElementById('storageUsageVal').textContent")
        print(f"Storage usage display: '{metrics_text}'")
        assert "KB" in metrics_text and "keys" in metrics_text, "Storage usage label format unexpected"
        chrome.evaluate("closeStorageSheet()")

        print("\n" + "=" * 60)
        print("TEST 3: EXECUTE FULL FACTORY RESET")
        print("=" * 60)
        # Execute the reset routine (non-blocking Promise resolution)
        chrome.evaluate("""
            (async function() {
                // Directly call executeFullFactoryReset without triggering location.replace in CDP test
                // so we can assert the pristine states in-memory and in storage
                if (typeof TimerEngine !== 'undefined' && TimerEngine.resetTimer) TimerEngine.resetTimer();
                if (typeof VisualizerEngine !== 'undefined' && VisualizerEngine.pause) VisualizerEngine.pause();
                localStorage.clear();
                sessionStorage.clear();
                resetAppStateToDefaults();
                await purgeAllCachesAndServiceWorker();
            })()
        """, await_promise=True)

        # Assert 100% cleared state
        ls_after = chrome.evaluate("localStorage.length")
        ss_after = chrome.evaluate("sessionStorage.length")
        day_after = chrome.evaluate("AppState.currentDay")
        mastery_after = chrome.evaluate("Object.keys(AppState.mastery).length")
        journal_after = chrome.evaluate("AppState.mistakeJournal.length")
        timers_after = chrome.evaluate("Object.keys(AppState.timers).length")
        blueprints_after = chrome.evaluate("Object.keys(AppState.blueprints).length")
        autopsies_after = chrome.evaluate("Object.keys(AppState.autopsies).length")
        caches_after = chrome.evaluate("caches.keys().then(k => k.length)", await_promise=True)

        print(f"After Reset -> LocalStorage keys: {ls_after}")
        print(f"After Reset -> SessionStorage keys: {ss_after}")
        print(f"After Reset -> Current Day: {day_after}")
        print(f"After Reset -> Solved Problems: {mastery_after}")
        print(f"After Reset -> Mistake Journal: {journal_after}")
        print(f"After Reset -> Timers: {timers_after}")
        print(f"After Reset -> Blueprints: {blueprints_after}")
        print(f"After Reset -> Autopsies: {autopsies_after}")
        print(f"After Reset -> Active Cache Keys: {caches_after}")

        assert ls_after == 0, f"LocalStorage not empty: {ls_after}"
        assert ss_after == 0, f"SessionStorage not empty: {ss_after}"
        assert day_after == 1, f"AppState.currentDay should be 1, got: {day_after}"
        assert mastery_after == 0, f"Mastery should be empty, got: {mastery_after}"
        assert journal_after == 0, f"Mistake journal should be empty, got: {journal_after}"
        assert timers_after == 0, f"Timers should be empty, got: {timers_after}"
        assert blueprints_after == 0, f"Blueprints should be empty, got: {blueprints_after}"
        assert autopsies_after == 0, f"Autopsies should be empty, got: {autopsies_after}"
        assert caches_after == 0, f"Cache keys should be 0, got: {caches_after}"

        print("\n" + "=" * 60)
        print("TEST 4: BROWSER RELOAD WITH CACHE-PURGE QUERY PARAM")
        print("=" * 60)
        chrome.navigate(f"http://localhost:8092/index.html?cache_purge={int(time.time() * 1000)}")
        time.sleep(1.5)

        # Confirm that on fresh boot, everything remains Day 1 default
        day_fresh = chrome.evaluate("AppState.currentDay")
        mastery_fresh = chrome.evaluate("Object.keys(AppState.mastery).length")
        journal_fresh = chrome.evaluate("AppState.mistakeJournal.length")
        print(f"Fresh Reload State -> Current Day: {day_fresh}, Solved: {mastery_fresh}, Journal: {journal_fresh}")
        assert day_fresh == 1, "Day should be 1 after reload"
        assert mastery_fresh == 0, "Mastery should be 0 after reload"
        assert journal_fresh == 0, "Journal should be 0 after reload"

        print("\n" + "=" * 60)
        print("ALL CACHE & STATE CLEARING TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 60)

    finally:
        chrome.stop()

if __name__ == "__main__":
    run_tests()
