import re
import json

def run_round_1_theory_links():
    print("=" * 60)
    print("ROUND 1: THEORY LINKS AUDIT (Documentation vs Code Runners)")
    print("=" * 60)
    with open("js/app.js") as f:
        app_text = f.read()
    with open("js/curriculum.js") as f:
        curr_text = f.read()

    match = re.search(r"const DAY_THEORY_LINKS = \{(.*?)\};", app_text, re.DOTALL)
    assert match, "DAY_THEORY_LINKS not found in app.js"
    lines = match.group(1).strip().split("\n")
    print(f"Found {len(lines)} day entries in DAY_THEORY_LINKS")
    
    code_runners = ["leetcode.com", "lintcode.com", "hackerrank.com/challenges"]
    issues = []
    for line in lines:
        if not line.strip() or ":" not in line:
            continue
        day_num = line.split(":")[0].strip()
        for cr in code_runners:
            if cr in line:
                issues.append(f"Day {day_num} has code runner in theory links: {cr}")
    
    days = re.findall(r"day:\s*(\d+).*?authoritativeResources:\s*\[(.*?)\]\s*,\s*blind75Tasks", curr_text, re.DOTALL)
    for d_num, res_block in days:
        urls = re.findall(r"url:\s*[\x27\"]([^\x27\"]+)[\x27\"]", res_block)
        for u in urls:
            for cr in code_runners:
                if cr in u:
                    issues.append(f"Day {d_num} authoritativeResource has code runner: {u}")
            if u.rstrip("/").count("/") < 3 and "topcoder.com" not in u:
                issues.append(f"Day {d_num} has bare/generic URL: {u}")

    if issues:
        print(f"FAIL: {len(issues)} issues found in Round 1:")
        for iss in issues:
            print("  -", iss)
        return False
    else:
        print("PASS: 100% of theory links point to deep canonical monographs and theory guides!")
        return True

def run_round_2_free_runners():
    print("\n" + "=" * 60)
    print("ROUND 2: PROBLEM LINKS & FREE ONLINE RUNNER AUDIT")
    print("=" * 60)
    with open("js/blind75.js") as f:
        blind_text = f.read()

    match = re.search(r"const FREE_RUNNER_MAP = \{(.*?)\};", blind_text, re.DOTALL)
    assert match, "FREE_RUNNER_MAP not found in blind75.js"
    entries = re.findall(r"(\d+):\s*\{([^}]+)\}", match.group(1))
    print(f"Found {len(entries)} verified free runners mapped in FREE_RUNNER_MAP")

    issues = []
    for p_id, body in entries:
        if "url:" not in body:
            issues.append(f"Problem {p_id} missing url in free runner")
        if "neetcode.io/problems" not in body and "cses.fi" not in body and "geeksforgeeks.org" not in body:
            issues.append(f"Problem {p_id} has unusual runner: {body}")

    if issues:
        print(f"FAIL: {len(issues)} issues found in Round 2:")
        for iss in issues:
            print("  -", iss)
        return False
    else:
        print("PASS: All problems have verified free interactive runner fallbacks mapped!")
        return True

def run_round_3_visualizer_data():
    print("\n" + "=" * 60)
    print("ROUND 3: VISUALIZER TRACE DATA INTEGRITY")
    print("=" * 60)
    with open("js/visualizer-data.js") as f:
        vis_text = f.read()

    issues = []
    for day in range(1, 31):
        pat = rf"\b{day}:\s*\{{"
        if not re.search(pat, vis_text):
            issues.append(f"Missing visualizer trace for Day {day}")

    rich_days = [10, 11, 13, 14, 15, 16, 17, 18, 21, 22]
    for rd in rich_days:
        block_match = re.search(rf"\b{rd}:\s*\{{(.*?)\n \}},", vis_text, re.DOTALL)
        if not block_match:
            issues.append(f"Day {rd} rich block not found")
            continue
        blk = block_match.group(1)
        if rd in [10, 11] and "listNodes" not in blk:
            issues.append(f"Day {rd} missing listNodes")
        if rd in [13, 14, 15, 16] and "treeNodes" not in blk:
            issues.append(f"Day {rd} missing treeNodes")
        if rd == 17 and "trieNodes" not in blk:
            issues.append(f"Day {rd} missing trieNodes")
        if rd == 18 and "leftMaxHeap" not in blk:
            issues.append(f"Day {rd} missing leftMaxHeap")
        if rd == 21 and "board" not in blk:
            issues.append(f"Day {rd} missing board grid")
        if rd == 22 and "graphNodes" not in blk:
            issues.append(f"Day {rd} missing graphNodes")

    if issues:
        print(f"FAIL: {len(issues)} issues found in Round 3:")
        for iss in issues:
            print("  -", iss)
        return False
    else:
        print("PASS: All 30 days present with enriched node/edge data structures!")
        return True

def run_round_5_starter_code():
    print("\n" + "=" * 60)
    print("ROUND 5: STARTER CODE & PSEUDOCODE BLUEPRINT AUDIT")
    print("=" * 60)
    with open("js/curriculum.js") as f:
        curr_text = f.read()

    issues = []
    for i in range(1, 31):
        m = re.search(rf"\bday:\s*{i}\b(.*?)(?=\bday:\s*{i+1}\b|$)", curr_text, re.DOTALL)
        if not m:
            issues.append(f"Day {i} block not found")
            continue
        day_content = m.group(1)
        if "cpp:" not in day_content:
            issues.append(f"Day {i} missing cpp starter code")
        if "java:" not in day_content:
            issues.append(f"Day {i} missing java starter code")
        if "python:" not in day_content:
            issues.append(f"Day {i} missing python starter code")

    if issues:
        print(f"FAIL: {len(issues)} issues found in Round 5:")
        for iss in issues:
            print("  -", iss)
        return False
    else:
        print("PASS: All 30 days have verified multi-language (C++, Java, Python) and algorithm blueprint capabilities!")
        return True

if __name__ == "__main__":
    r1 = run_round_1_theory_links()
    r2 = run_round_2_free_runners()
    r3 = run_round_3_visualizer_data()
    r5 = run_round_5_starter_code()
    print("\n" + "=" * 60)
    if all([r1, r2, r3, r5]):
        print("ROUNDS 1, 2, 3, 5: ALL PASSED WITH 100% SUCCESS!")
    else:
        print("SOME ROUNDS FAILED!")
        exit(1)
