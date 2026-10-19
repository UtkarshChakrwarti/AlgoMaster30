import json
import urllib.request
import urllib.parse
import websocket
import subprocess
import time
import sys

PORT = 9223

class BrowserSession:
    def __init__(self):
        self.proc = None
        self.ws = None
        self.msg_id = 0

    def start(self):
        cmd = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "--headless=new",
            f"--remote-debugging-port={PORT}",
            "--window-size=1280,800",
            "--remote-allow-origins=*",
            "--user-data-dir=/tmp/chrome-cdp-benchmark-runner-test",
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
        payload = {"id": self.msg_id, "method": method, "params": params or {}}
        self.ws.send(json.dumps(payload))
        while True:
            resp = json.loads(self.ws.recv())
            if resp.get("id") == self.msg_id:
                return resp.get("result", {})

    def evaluate(self, expr):
        res = self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        if "exceptionDetails" in res:
            raise Exception(f"JS Exception: {res['exceptionDetails']}")
        return res.get("result", {}).get("value")

def main():
    print("=== STARTING QA VALIDATION FOR BENCHMARK, SIDEBAR COLLAPSE, TOP PILL, CODE RUNNER ===")
    session = BrowserSession()
    try:
        session.start()
        session.send("Page.navigate", {"url": "http://localhost:8092/index.html"})
        time.sleep(2)
        session.send("Emulation.setDeviceMetricsOverride", {
            "width": 1280,
            "height": 800,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        time.sleep(0.5)

        # TEST 1: Top Pill Switcher Centering across different days & views
        print("\n[TEST 1] Testing Top Segmented Pill Centering...")
        centering_results = session.evaluate("""
        (() => {
            const results = [];
            const switcher = document.querySelector('.apple-nav-switcher');
            const nav = document.querySelector('.apple-global-nav');
            const winWidth = window.innerWidth;
            const style = window.getComputedStyle(switcher);

            // Check Day 1
            switchDay(1);
            const rect1 = switcher.getBoundingClientRect();
            const center1 = rect1.left + rect1.width / 2;
            results.push({
                day: 1,
                winWidth,
                pos: style.position,
                left: style.left,
                transform: style.transform,
                rect1Left: rect1.left,
                rect1Width: rect1.width,
                center1,
                centerDiff: Math.abs(center1 - winWidth / 2)
            });

            // Check Day 15 (Longer title)
            switchDay(15);
            const rect15 = switcher.getBoundingClientRect();
            const center15 = rect15.left + rect15.width / 2;
            results.push({ day: 15, centerDiff: Math.abs(center15 - winWidth / 2) });

            // Check Day 28
            switchDay(28);
            const rect28 = switcher.getBoundingClientRect();
            const center28 = rect28.left + rect28.width / 2;
            results.push({ day: 28, centerDiff: Math.abs(center28 - winWidth / 2) });

            // Switch back to Day 1
            switchDay(1);
            return results;
        })()
        """)
        print("Centering results:", centering_results)
        for r in centering_results:
            assert r["centerDiff"] <= 1.0, f"Top pill switcher not centered on day {r['day']}: diff {r['centerDiff']}px"
        print("✓ Top pill switcher is mathematically centered on screen across all days!")

        # TEST 2: Left Side Rail Collapse
        print("\n[TEST 2] Testing Sidebar Rail Hide / Collapse...")
        rail_res = session.evaluate("""
        (() => {
            const workstation = document.getElementById("viewGrind");
            const sidebar = document.querySelector(".apple-sidebar");
            const initialWidth = sidebar.getBoundingClientRect().width;
            
            // Ensure sidebar is open
            if (workstation.classList.contains("sidebar-collapsed")) {
                toggleSidebar();
            }
            const openWidth = sidebar.getBoundingClientRect().width;

            // Toggle to collapse
            toggleSidebar();
            const collapsedWidth = sidebar.getBoundingClientRect().width;
            const isCollapsed = workstation.classList.contains("sidebar-collapsed");

            // Toggle back to expand
            toggleSidebar();
            const reexpandedWidth = sidebar.getBoundingClientRect().width;

            return {
                openWidth,
                collapsedWidth,
                isCollapsed,
                reexpandedWidth
            };
        })()
        """)
        print("Sidebar rail collapse test:", rail_res)
        assert rail_res["collapsedWidth"] == 0, f"Sidebar width not 0 when collapsed: {rail_res['collapsedWidth']}"
        assert rail_res["reexpandedWidth"] > 200, f"Sidebar failed to re-expand: {rail_res['reexpandedWidth']}"
        print("✓ Sidebar rail collapse and expand working flawlessly (0px collapsed, ~250px expanded)!")

        # TEST 3: Left Side Accordion Days Collapse
        print("\n[TEST 3] Testing Left Side Accordion Days Collapse & Expand All...")
        acc_res = session.evaluate("""
        (() => {
            switchDay(1);
            renderRoadmap();

            // 1. Day 1 is expanded initially
            const day1InitialExpanded = AppState.expandedRoadmapDays.has(1);

            // 2. Click Day 1 chevron to collapse
            toggleDayRoadmapExpansion(1);
            const day1AfterToggle = AppState.expandedRoadmapDays.has(1);

            // 3. Click Day 1 again to re-expand
            toggleDayRoadmapExpansion(1);
            const day1ReExpanded = AppState.expandedRoadmapDays.has(1);

            // 4. Test Expand All (from 1 open day to all 30 open days)
            toggleExpandAllSidebarProblems();
            const sizeAfterExpandAll = AppState.expandedRoadmapDays.size;

            // 5. Test Collapse All (from all 30 open days to 0 open days)
            toggleExpandAllSidebarProblems();
            const sizeAfterCollapseAll = AppState.expandedRoadmapDays.size;

            // Reset to Day 1 expanded
            AppState.expandedRoadmapDays.clear();
            AppState.expandedRoadmapDays.add(1);
            renderRoadmap();

            return {
                day1InitialExpanded,
                day1AfterToggle,
                day1ReExpanded,
                sizeAfterCollapseAll,
                sizeAfterExpandAll
            };
        })()
        """)
        print("Accordion collapse test:", acc_res)
        assert acc_res["day1InitialExpanded"] == True
        assert acc_res["day1AfterToggle"] == False, "Day 1 failed to collapse when toggled!"
        assert acc_res["day1ReExpanded"] == True, "Day 1 failed to re-expand!"
        assert acc_res["sizeAfterCollapseAll"] == 0, f"Collapse All failed: size is {acc_res['sizeAfterCollapseAll']}"
        assert acc_res["sizeAfterExpandAll"] == 30, f"Expand All failed: size is {acc_res['sizeAfterExpandAll']}"
        print("✓ Accordion day collapse and Expand/Collapse All working perfectly!")

        # TEST 4: Benchmark Selection Discrepancy & Synchronization
        print("\n[TEST 4] Testing Benchmark Selection & Left/Right Synchronization...")
        bm_res = session.evaluate("""
        (() => {
            switchDay(1);
            selectDailyProblem(0); // Select Two Sum first
            renderDailyProblemPills(1);
            renderRoadmap();

            const twoSumActiveInitially = document.querySelector("#dailyProblemPills .practice-pill-btn")?.classList.contains("active");

            // Now Click Benchmark Pill
            const dayData = CURRICULUM_DATABASE.find(d => d.day === 1);
            selectDailyBossFight(dayData.extremeProblem);

            // Inspect Center Pills
            const pills = Array.from(document.querySelectorAll("#dailyProblemPills .practice-pill-btn"));
            const bossPill = pills.find(p => p.classList.contains("boss-pill-btn") || p.textContent.includes("Benchmark:"));
            const regularPillsActive = pills.filter(p => p !== bossPill && p.classList.contains("active")).length;
            const bossPillActive = bossPill ? bossPill.classList.contains("active") : false;

            // Inspect Sidebar
            const sidebarBossRow = document.querySelector('.sidebar-problem-row.boss-row[data-day="1"]');
            const sidebarBossActive = sidebarBossRow ? sidebarBossRow.classList.contains("active") : false;
            const sidebarRegularActive = Array.from(document.querySelectorAll('.sidebar-problem-row:not(.boss-row)[data-day="1"]'))
                                              .filter(r => r.classList.contains("active")).length;

            // Inspect Links and Title
            const titleText = document.getElementById("wizardProblemTitle")?.textContent;
            const diffText = document.getElementById("wizardProblemDiff")?.textContent;
            const portalUrl = document.getElementById("btnSolvePortalMain")?.href;
            const advBtnText = document.getElementById("btnAdvanceToStep2")?.textContent;

            return {
                twoSumActiveInitially,
                bossPillActive,
                regularPillsActive,
                sidebarBossActive,
                sidebarRegularActive,
                titleText,
                diffText,
                portalUrl,
                advBtnText,
                expectedUrl: dayData.extremeProblem.url
            };
        })()
        """)
        print("Benchmark selection test:", bm_res)
        assert bm_res["bossPillActive"] == True, "Benchmark pill in center is not active!"
        assert bm_res["regularPillsActive"] == 0, f"Regular pills still active when benchmark selected: {bm_res['regularPillsActive']}"
        assert bm_res["sidebarBossActive"] == True, "Sidebar boss row is not active!"
        assert bm_res["sidebarRegularActive"] == 0, f"Sidebar regular rows still active when benchmark selected: {bm_res['sidebarRegularActive']}"
        assert "Distinct Numbers" in bm_res["titleText"], f"Wizard title incorrect: {bm_res['titleText']}"
        assert bm_res["portalUrl"] == bm_res["expectedUrl"], f"Portal URL mismatch: {bm_res['portalUrl']} vs {bm_res['expectedUrl']}"
        assert "CSES" in bm_res["advBtnText"], f"Advance button does not point to CSES: {bm_res['advBtnText']}"
        print("✓ Benchmark selection discrepancy fully resolved! Left sidebar, center pills, URLs, and advance CTA are 100% synchronized!")

        # TEST 5: Interactive In-Browser Code Runner & External Compilers
        print("\n[TEST 5] Testing Interactive Code Runner & Online Compiler Integration...")
        runner_res = session.evaluate("""
        (() => {
            setProblemStep(2);
            const card = document.getElementById("interactiveCodeRunnerCard");
            const iframe = document.getElementById("embeddedCodeRunnerFrame");
            const wrap = document.getElementById("runnerIframeWrap");
            const collapseBtn = document.getElementById("btnToggleRunnerCollapse");

            // Initial iframe src (C++)
            const initialSrc = iframe ? iframe.src : "";

            // Switch to Python
            const pyBtn = Array.from(document.querySelectorAll(".runner-lang-btn")).find(b => b.textContent.includes("Python"));
            if (pyBtn) switchEmbeddedRunnerLang("python", pyBtn);
            const pySrc = iframe ? iframe.src : "";
            const pyBtnActive = pyBtn ? pyBtn.classList.contains("active") : false;

            // Test collapse / hide
            toggleEmbeddedRunner();
            const displayAfterHide = wrap ? wrap.style.display : "";
            const labelAfterHide = collapseBtn ? collapseBtn.textContent : "";

            // Test expand
            toggleEmbeddedRunner();
            const displayAfterExpand = wrap ? wrap.style.display : "";
            const labelAfterExpand = collapseBtn ? collapseBtn.textContent : "";

            // External tool links
            const compileBytesLink = document.querySelector('.runner-ext-chip[href*="compilebytes.com"]')?.href;
            const godboltLink = document.querySelector('.runner-ext-chip[href*="godbolt.org"]')?.href;

            return {
                cardExists: !!card,
                initialSrc,
                pySrc,
                pyBtnActive,
                displayAfterHide,
                labelAfterHide,
                displayAfterExpand,
                labelAfterExpand,
                compileBytesLink,
                godboltLink
            };
        })()
        """)
        print("Code runner test:", runner_res)
        assert runner_res["cardExists"] == True, "Interactive code runner card not found!"
        assert "onecompiler.com/embed/cpp" in runner_res["initialSrc"], f"Default runner src wrong: {runner_res['initialSrc']}"
        assert "onecompiler.com/embed/python" in runner_res["pySrc"], f"Python runner src wrong: {runner_res['pySrc']}"
        assert runner_res["pyBtnActive"] == True, "Python tab button not active!"
        assert runner_res["displayAfterHide"] == "none", "Wrap not hidden after hide click!"
        assert runner_res["labelAfterHide"] == "Expand", "Label not Expand after hide click!"
        assert runner_res["displayAfterExpand"] == "block", "Wrap not block after expand click!"
        assert runner_res["labelAfterExpand"] == "Hide", "Label not Hide after expand click!"
        assert "compilebytes.com/tools/cpp" in runner_res["compileBytesLink"], "CompileBytes external link missing!"
        print("✓ Interactive code runner & CompileBytes integration working flawlessly!")

        # TEST 6: Auto-Hiding Scrollbar
        print("\n[TEST 6] Testing Auto-Hiding Scrollbar Engine...")
        scroll_res = session.evaluate("""
        (() => {
            // Trigger scroll handler
            handleGlobalScrollActivity();
            const isScrollingActive = document.body.classList.contains("is-scrolling");
            return { isScrollingActive };
        })()
        """)
        print("Scroll handler test:", scroll_res)
        assert scroll_res["isScrollingActive"] == True, "body.is-scrolling not active on scroll!"
        
        # Wait for debounce timer to clear (accounting for headless timer throttling)
        time.sleep(1.5)
        scroll_cleared = session.evaluate("!document.body.classList.contains('is-scrolling')")
        print("Scroll cleared after timeout:", scroll_cleared)
        assert scroll_cleared == True, "body.is-scrolling did not auto-clear after idle timeout!"
        print("✓ Auto-hiding scrollbar engine verified!")

        print("\n=== ALL QA TESTS PASSED WITH 100% SUCCESS! ===")
    finally:
        session.stop()

if __name__ == "__main__":
    main()
