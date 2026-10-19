import json
import urllib.request
import websocket
import subprocess
import time
import base64
import os

PORT = 9226
ARTIFACT_DIR = "/Users/typhoone/.gemini/antigravity-ide/brain/01d115ba-e469-4c15-9ecd-a9b7d2da9586"

def main():
    os.system("rm -rf /tmp/chrome-cdp-visual-verify")
    cmd = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--remote-allow-origins=*",
        "--user-data-dir=/tmp/chrome-cdp-visual-verify",
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
        ws = websocket.create_connection(ws_url)

        msg_id = 0
        def send(method, params=None):
            nonlocal msg_id
            msg_id += 1
            ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                resp = json.loads(ws.recv())
                if resp.get("id") == msg_id:
                    return resp.get("result", {})

        send("Runtime.enable")
        send("Page.enable")
        send("DOM.enable")
        send("Page.navigate", {"url": "http://localhost:8092/index.html"})
        time.sleep(2)

        send("Emulation.setDeviceMetricsOverride", {
            "width": 1280,
            "height": 820,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        time.sleep(0.5)

        # 1. Capture Learn / Pattern Principles tab (matching user screenshot)
        send("Runtime.evaluate", {
            "expression": """
            switchDay(1);
            doSwitchDaySubTab("learn");
            renderRoadmap();
            """
        })
        time.sleep(0.8)

        shot1 = send("Page.captureScreenshot", {"format": "png"})
        out1 = os.path.join(ARTIFACT_DIR, "screenshot_learn_principles_fixed.png")
        with open(out1, "wb") as f:
            f.write(base64.b64decode(shot1["data"]))
        print(f"Captured: {out1}")

        # 2. Capture Solve tab with Problem 1
        send("Runtime.evaluate", {
            "expression": """
            doSwitchDaySubTab("solve");
            selectDailyProblem(0);
            renderRoadmap();
            """
        })
        time.sleep(0.8)

        shot2 = send("Page.captureScreenshot", {"format": "png"})
        out2 = os.path.join(ARTIFACT_DIR, "screenshot_solve_tab_fixed.png")
        with open(out2, "wb") as f:
            f.write(base64.b64decode(shot2["data"]))
        print(f"Captured: {out2}")

        # 3. Capture Dark mode of Learn tab
        send("Runtime.evaluate", {
            "expression": """
            toggleTheme();
            doSwitchDaySubTab("learn");
            """
        })
        time.sleep(0.8)

        shot3 = send("Page.captureScreenshot", {"format": "png"})
        out3 = os.path.join(ARTIFACT_DIR, "screenshot_learn_dark_fixed.png")
        with open(out3, "wb") as f:
            f.write(base64.b64decode(shot3["data"]))
        print(f"Captured: {out3}")

        ws.close()
    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    main()
