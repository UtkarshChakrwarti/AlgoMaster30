# AlgoMaster 30 — Focused Flow Workspace & 100% Blind 75 Confidence Companion

> A calm, distraction-free desktop algorithm companion designed for software engineers preparing for senior technical interviews. Eliminates cognitive overload with Progressive Disclosure and guarantees 100% cold pattern recognition across all 75 Blind 75 problems + 30 CSES/Hard Boss fights.

---

## ⚡ The Problem with Traditional LeetCode Dashboards

Most algorithm practice platforms and study dashboards overwhelm you with 14+ widgets simultaneously (code editors, timers, nudges, dropdowns, telemetry charts, and debrief forms all fighting for attention at once). Visual fatigue sets in before you even read the problem statement.

Furthermore, on a designated "Two Pointers Day", solving a problem gives false confidence because you already know what pattern to use. In a real technical interview, nobody tells you the topic.

---

## 🎯 Key Features & Pedagogical Architecture

### 1. Radical Visual Simplicity (Progressive Disclosure)
- **Calm 2-Column Guided Flow**: Collapsible 30-day roadmap rail (`240px`, toggled with `[`) + centered focus stage (`max-width: 920px`, generous breathing room).
- **Two Focused Day Tabs**:
  - `📖 1. Learn Today's Pattern (10m)`: Shows *only* the Coach's 2-sentence briefing, interactive memory array dry-run stepper (`⏮`, `◀`, `▶`, `Step ▶`), and Core Rule & 3 Traps cards.
  - `🎯 2. Solve Today's Problems (One by One)`: Clean horizontal problem pills showing *only one problem on screen at a time*.

### 2. The 3-Step Guided Problem Wizard
- **Step 1: Think on Paper First**: 15:00 countdown timer, pre-code sanity check (with a *"Check My Thinking"* toggle), and 3 collapsed Coach's Nudges.
- **Step 2: Coding on Online Portal**: Distraction-free coding stopwatch while you solve directly on LeetCode / CSES. Includes a *"Copy Clean Starter Template"* button.
- **Step 3: Honest Debrief & 30-Second Interview Pitch**:
  - 4 outcome ratings: `🔥 Solved Cold`, `⚠️ Tripped on Bug`, `💡 Needed Nudge`, `📖 Read Editorial`.
  - 1-line note to future self.
  - **Unlocked Speaking Script**: 30-second interview pitch covering *The Naive Trap*, *The Key Insight*, and *The Complexity Guarantee*.

### 3. The 100% Blind 75 Confidence System
- **2-Pass Cold Mastery Tracker**:
  - `⚪ Unsolved`
  - `🟡 Pass 1: Solved on Topic Day` (or needed hints)
  - `🟢 Pass 2: Proven Cold (100% Interview Ready)` (earned only when solved cold with zero hints under 20m or passed a cold rematch).
- **Spaced Repetition Rematch Queue**:
  - Automatically schedules rematches (`+1d` for editorial, `+3d` for nudge, `+5d` for bug, `+7d` for cold verification).
- **⚡ 60-Second Blind Pattern Drill**:
  - Hides topic, category, and day number.
  - Prompts you to pick the data structure/pattern and optimal time complexity cold.
  - Gives instant evaluation and displays the 1-Sentence Trick + 30-Second Interview Pitch.
- **📊 All 75 Mastery Matrix**:
  - Filterable directory across all 75 Blind 75 problems and 30 boss fights with status indicators and mistake notes.

---

## 🚀 Getting Started

AlgoMaster 30 is built using Vanilla HTML5, CSS3, and ES6+ JavaScript with zero build steps or heavy dependencies.

```bash
# Clone the repository
git clone git@github.com:UtkarshChakrwarti/AlgoMaster30.git
cd AlgoMaster30

# Serve locally using any static HTTP server:
python3 -m http.server 8090
# Open http://localhost:8090 in your browser
```

### Keyboard Shortcuts
| Key | Action |
| :--- | :--- |
| `[` or `]` | Toggle 30-Day Sidebar |
| `,` or `.` | Navigate Previous / Next Day |
| `Space` | Play / Pause Dry-Run Stepper |
| `Esc` | Close Modals & Overlays |

---

## 🛠️ Tech Stack & Aesthetics

- **Core**: Vanilla HTML5, modern semantic markup, ES6+ modular JavaScript.
- **Styling**: Vanilla CSS with Vercel Geist / Linear dark obsidian design system (`#09090B` root, specular borders, `#131318` elevated focus cards).
- **Typography**: Inter (UI) and JetBrains Mono (Code / Tabular numbers).
- **Persistence**: `localStorage` with JSON backup export and import.

---

## 📜 License
MIT License. Crafted for engineers aiming for top-tier algorithmic mastery.
