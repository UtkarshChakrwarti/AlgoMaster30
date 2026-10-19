import json
import urllib.request
import websocket
import subprocess
import time
import base64
import os

PORT = 9225
ARTIFACT_DIR = "/Users/typhoone/.gemini/antigravity-ide/brain/01d115ba-e469-4c15-9ecd-a9b7d2da9586"

def main():
    cmd = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--remote-allow-origins=*",
        "--user-data-dir=/tmp/chrome-cdp-clean-screenshot",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2)

    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list")
        tabs = json.loads(req.read().decode())
        ws_url = tabs[0]["webSocketDebuggerUrl"]
        ws = websocket.create_connection(ws_url, timeout=10)

        msg_id = 0
        def send(method, params=None):
            nonlocal msg_id
            msg_id += 1
            ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                resp = json.loads(ws.recv())
                if resp.get("id") == msg_id:
                    return resp.get("result", {})

        send("Page.navigate", {"url": "http://localhost:8092/index.html"})
        time.sleep(2)

        send("Emulation.setDeviceMetricsOverride", {
            "width": 1280,
            "height": 820,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        time.sleep(0.5)

        # 1. Switch to solve tab and select benchmark
        send("Runtime.evaluate", {
            "expression": """
            switchDay(1);
            doSwitchDaySubTab("solve");
            const dayData = CURRICULUM_DATABASE.find(d => d.day === 1);
            selectDailyBossFight(dayData.extremeProblem);
            """
        })
        time.sleep(0.8)

        # Capture Screenshot 1: Benchmark Active on Solve Stage
        shot1 = send("Page.captureScreenshot", {"format": "png"})
        out1 = os.path.join(ARTIFACT_DIR, "screenshot_benchmark_selected.png")
        with open(out1, "wb") as f:
            f.write(base64.b64decode(shot1["data"]))
        print(f"Captured: {out1}")

        # 2. Advance to Step 2 to show In-Browser Code Runner
        send("Runtime.evaluate", {
            "expression": "setProblemStep(2);"
        })
        time.sleep(1.0)

        # Capture Screenshot 2: In-Browser Code Runner
        shot2 = send("Page.captureScreenshot", {"format": "png"})
        out2 = os.path.join(ARTIFACT_DIR, "screenshot_interactive_code_runner.png")
        with open(out2, "wb") as f:
            f.write(base64.b64decode(shot2["data"]))
        print(f"Captured: {out2}")

        ws.close()
    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    main()
