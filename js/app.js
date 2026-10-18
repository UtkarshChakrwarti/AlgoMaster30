// ============================================================================
// ALGOMASTER 30 — APPLE DESIGN SPECIFICATION CONTROLLER
// Strict Apple DESIGN.md • Zero Emojis • Offline-First Native LocalStorage
// ============================================================================

const STORAGE_KEY = "algomaster30_apple_system_v4";

// Application State
const AppState = {
  userName: "",
  currentDay: 1,
  currentView: "today", // 'today' | 'rematch' | 'drill' | 'matrix' | 'profile'
  currentSubTab: "learn", // 'learn' | 'solve'
  activeProblemIndex: 0,
  activeProblemId: 1,
  activeProblemStep: 1, // 1: Think on Paper, 2: Coding on Portal, 3: Debrief & Pitch
  sidebarCollapsed: false,
  
  // 2-Pass Mastery System:
  // 'cold' = Pass 2: Proven Cold (optimal, zero hints)
  // 'pass1' = Pass 1: Solved on topic day or needed hints/editorial
  mastery: {},

  timers: {},      // { [problemId]: { p1: sec, p2: sec, total: sec, best: sec } }
  blueprints: {},  // { [problemId]: { timeCommit, spaceCommit } }
  autopsies: {},   // { [problemId]: { outcome, note, nextReviewDate, reviewCount } }
  mistakeJournal: [], // [ { problemId, title, note, outcome, date } ]
  drillStats: { total: 0, correct: 0 },
  streak: 1
};

// ============================================================================
// HTML NATIVE LOCAL STORAGE & SERVICE WORKER CACHE
// ============================================================================

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.userName) AppState.userName = parsed.userName;
      if (parsed.currentDay) AppState.currentDay = parsed.currentDay;
      if (parsed.currentView) AppState.currentView = parsed.currentView;
      if (parsed.currentSubTab) AppState.currentSubTab = parsed.currentSubTab;
      if (parsed.activeProblemId) AppState.activeProblemId = parsed.activeProblemId;
      if (parsed.activeProblemIndex !== undefined) AppState.activeProblemIndex = parsed.activeProblemIndex;
      if (parsed.sidebarCollapsed !== undefined) AppState.sidebarCollapsed = parsed.sidebarCollapsed;
      if (parsed.mastery) AppState.mastery = parsed.mastery;
      if (parsed.timers) AppState.timers = parsed.timers;
      if (parsed.blueprints) AppState.blueprints = parsed.blueprints;
      if (parsed.autopsies) AppState.autopsies = parsed.autopsies;
      if (parsed.mistakeJournal) AppState.mistakeJournal = parsed.mistakeJournal;
      if (parsed.drillStats) AppState.drillStats = parsed.drillStats;
      if (parsed.streak) AppState.streak = parsed.streak;
    }
  } catch (err) {
    console.warn("Could not load saved state from localStorage:", err);
  }
}

function persistState() {
  try {
    const payload = {
      userName: AppState.userName,
      currentDay: AppState.currentDay,
      currentView: AppState.currentView,
      currentSubTab: AppState.currentSubTab,
      activeProblemId: AppState.activeProblemId,
      activeProblemIndex: AppState.activeProblemIndex,
      sidebarCollapsed: AppState.sidebarCollapsed,
      mastery: AppState.mastery,
      timers: AppState.timers,
      blueprints: AppState.blueprints,
      autopsies: AppState.autopsies,
      mistakeJournal: AppState.mistakeJournal,
      drillStats: AppState.drillStats,
      streak: AppState.streak
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("Could not persist state to localStorage:", err);
  }
}

function registerServiceWorker() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      console.log("AlgoMaster Service Worker active with scope:", reg.scope);
      updateOfflineStatusBadge(true);
    }).catch((err) => {
      console.warn("Service Worker registration error:", err);
      updateOfflineStatusBadge(false);
    });
  }
}

function updateOfflineStatusBadge(isCached) {
  const badge = document.getElementById("appleOfflinePill");
  const label = document.getElementById("appleOfflineText");
  if (!badge || !label) return;
  if (isCached) {
    label.textContent = "Offline Ready";
    badge.style.display = "inline-flex";
  } else {
    label.textContent = "Online Mode";
  }
}

// ============================================================================
// TIMERS & STOPWATCH ENGINE
// ============================================================================

const TimerEngine = {
  activePhase: 0, // 0 = idle, 1 = 15m paper countdown, 2 = portal stopwatch
  phase1Remaining: 15 * 60,
  phase2Seconds: 0,
  intervalId: null,

  formatTime(totalSec) {
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  },

  startPhase1() {
    this.activePhase = 1;
    this.startTicker();
    const btn = document.getElementById("btnWizardPaperTimerStart");
    if (btn) btn.textContent = "Pause";
  },

  pausePhase1() {
    if (this.intervalId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
    }
    this.intervalId = null;
    const btn = document.getElementById("btnWizardPaperTimerStart");
    if (btn) btn.textContent = "Resume";
  },

  togglePhase1() {
    if (this.intervalId) {
      this.pausePhase1();
    } else {
      this.startPhase1();
    }
  },

  switchToPhase2() {
    if (this.intervalId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
    }
    this.activePhase = 2;
    this.startTicker();
    const statusEl = document.getElementById("wizardStopwatchStatus");
    if (statusEl) statusEl.textContent = "Tracking implementation time...";
  },

  stopPhase2() {
    if (this.intervalId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
    }
    this.intervalId = null;
    this.activePhase = 0;
    const statusEl = document.getElementById("wizardStopwatchStatus");
    if (statusEl) statusEl.textContent = `Completed in ${this.formatTime(this.phase2Seconds)}`;
  },

  startTicker() {
    if (this.intervalId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
    }
    const timerFn = typeof window !== "undefined" && window.setInterval ? window.setInterval : (typeof setInterval !== "undefined" ? setInterval : ((fn) => 1));
    this.intervalId = timerFn(() => {
      if (this.activePhase === 1) {
        if (this.phase1Remaining > 0) {
          this.phase1Remaining--;
        }
        const el = document.getElementById("wizardPaperTimerVal");
        if (el) el.textContent = this.formatTime(this.phase1Remaining);
      } else if (this.activePhase === 2) {
        this.phase2Seconds++;
        const el = document.getElementById("wizardStopwatchVal");
        if (el) el.textContent = this.formatTime(this.phase2Seconds);
      }
    }, 1000);
  },

  addFiveMinutes() {
    this.phase1Remaining += 5 * 60;
    const el = document.getElementById("wizardPaperTimerVal");
    if (el) el.textContent = this.formatTime(this.phase1Remaining);
  },

  resetTimer() {
    if (this.intervalId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
    }
    this.intervalId = null;
    this.activePhase = 0;
    this.phase1Remaining = 15 * 60;
    this.phase2Seconds = 0;
    const p1El = document.getElementById("wizardPaperTimerVal");
    if (p1El) p1El.textContent = "15:00";
    const p2El = document.getElementById("wizardStopwatchVal");
    if (p2El) p2El.textContent = "00:00";
    const btn = document.getElementById("btnWizardPaperTimerStart");
    if (btn) btn.textContent = "Start 15m Timer";
  }
};

// ============================================================================
// VISUALIZER INSPECTOR ENGINE
// ============================================================================

const VisualizerEngine = {
  currentStepIndex: 0,
  isPlaying: false,
  speed: 1, // 1x = 1400ms, 2x = 700ms
  timerId: null,

  getTrace() {
    return (typeof VISUALIZER_TRACES !== "undefined" && VISUALIZER_TRACES[AppState.currentDay]) ||
           (typeof VISUALIZER_TRACES !== "undefined" && VISUALIZER_TRACES[1]) ||
           { pattern: "Hash Complement Lookup", inputDescription: "nums = [2, 7, 11, 15], target = 9", steps: [] };
  },

  init() {
    this.currentStepIndex = 0;
    this.pause();
    this.render();
  },

  render() {
    const trace = this.getTrace();
    if (!trace || !trace.steps || trace.steps.length === 0) return;

    const patternEl = document.getElementById("visPatternName");
    if (patternEl) patternEl.textContent = trace.pattern;
    const inputPillEl = document.getElementById("visInputPill");
    if (inputPillEl) inputPillEl.textContent = trace.inputDescription;

    const step = trace.steps[this.currentStepIndex] || trace.steps[0];
    const stage = document.getElementById("visStage");
    if (!stage) return;
    stage.innerHTML = "";

    // 1. Check for 2D Grid / Backtracking Matrix (e.g. Day 20 Word Search In-Place Visited)
    if (step.board && Array.isArray(step.board)) {
      const gridWrap = document.createElement("div");
      gridWrap.className = "vis-grid-container";

      // Target Word Sequence Tracker
      if (trace.targetWord) {
        const tracker = document.createElement("div");
        tracker.className = "vis-word-tracker";
        const lbl = document.createElement("span");
        lbl.className = "vis-word-label";
        lbl.textContent = `Target Word (${step.matchedCount || 0}/${trace.targetWord.length}):`;
        tracker.appendChild(lbl);

        const letters = trace.targetWord.split("");
        letters.forEach((ch, idx) => {
          const charEl = document.createElement("span");
          charEl.className = "vis-word-char";
          if (idx < (step.matchedCount || 0)) {
            charEl.classList.add("matched");
          } else if (idx === (step.matchedCount || 0) && step.activeCell) {
            charEl.classList.add("current");
          }
          charEl.textContent = ch;
          tracker.appendChild(charEl);
        });
        gridWrap.appendChild(tracker);
      }

      // 2D Matrix Board
      const boardEl = document.createElement("div");
      boardEl.className = "vis-matrix-board";
      const cols = (step.board[0] && step.board[0].length) || 4;
      boardEl.style.gridTemplateColumns = `repeat(${cols}, 48px)`;

      step.board.forEach((row, r) => {
        row.forEach((val, c) => {
          const cell = document.createElement("div");
          cell.className = "vis-matrix-cell";

          const isActive = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
          const isVisited = val === "#";
          const isFullMatch = step.matchedCount === (trace.targetWord ? trace.targetWord.length : 6) && isVisited;

          if (isActive) cell.classList.add("active-search");
          if (isVisited) cell.classList.add("visited-marked");
          if (isFullMatch) cell.classList.add("path-matched");

          const valEl = document.createElement("div");
          valEl.className = "vis-cell-val";
          valEl.textContent = val;
          cell.appendChild(valEl);

          const coordEl = document.createElement("div");
          coordEl.className = "vis-cell-coord";
          coordEl.textContent = `${r},${c}`;
          cell.appendChild(coordEl);

          boardEl.appendChild(cell);
        });
      });
      gridWrap.appendChild(boardEl);
      stage.appendChild(gridWrap);
    } else {
      // 2. Parse 1D array items from inputDescription
      const arrayMatch = trace.inputDescription ? trace.inputDescription.match(/\[(.*?)\]/) : null;
      if (arrayMatch) {
        const rawItems = arrayMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        if (rawItems.length > 0 && rawItems[0] !== "") {
          const arrayContainer = document.createElement("div");
          arrayContainer.className = "inspector-array-strip";

        const activeIndices = [];
        if (step.indices) {
          Object.values(step.indices).forEach(v => {
            if (typeof v === "number") activeIndices.push(v);
          });
        }
        let leftIdx = -1;
        let rightIdx = -1;
        if (step.pointers && typeof step.pointers === "string") {
          const lMatch = step.pointers.match(/left\s*=\s*(\d+)/i);
          const rMatch = step.pointers.match(/right\s*=\s*(\d+)/i);
          if (lMatch) leftIdx = parseInt(lMatch[1], 10);
          if (rMatch) rightIdx = parseInt(rMatch[1], 10);
        }

        const isMatchStep = (step.invariantStatus && (step.invariantStatus.includes("Target Met") || step.invariantStatus.includes("Match"))) ||
                            (step.action && step.action.includes("Match"));

        rawItems.forEach((val, idx) => {
          const cellWrapper = document.createElement("div");
          cellWrapper.className = "inspector-slot-column";

          // Pointer marker above cell
          const pointerMarker = document.createElement("div");
          let pointerText = "";
          let pointerClass = "inspector-pointer-tag";

          if (leftIdx === idx && rightIdx === idx) {
            pointerText = "L, R";
            pointerClass += " active left";
          } else if (leftIdx === idx) {
            pointerText = "L";
            pointerClass += " active left";
          } else if (rightIdx === idx) {
            pointerText = "R";
            pointerClass += " active right";
          } else if (activeIndices.includes(idx)) {
            const key = Object.keys(step.indices || {}).find(k => step.indices[k] === idx) || "p";
            pointerText = key;
            pointerClass += " active";
          }

          pointerMarker.className = pointerClass;
          pointerMarker.textContent = pointerText;
          cellWrapper.appendChild(pointerMarker);

          // Value cell
          const cellBox = document.createElement("div");
          let boxClass = "inspector-memory-cell";
          if (isMatchStep && (activeIndices.includes(idx) || (step.hashTable && step.hashTable[step.complement] === idx))) {
            boxClass += " highlight-match";
          } else if (activeIndices.includes(idx) || leftIdx === idx || rightIdx === idx) {
            boxClass += " highlight-active";
          } else if (step.complement !== undefined && String(val) === String(step.complement)) {
            boxClass += " highlight-complement";
          }
          cellBox.className = boxClass;
          cellBox.textContent = val;
          cellWrapper.appendChild(cellBox);

          // Index label
          const indexLabel = document.createElement("div");
          indexLabel.className = "inspector-index-label";
          indexLabel.textContent = `[${idx}]`;
          cellWrapper.appendChild(indexLabel);

          arrayContainer.appendChild(cellWrapper);
        });

        stage.appendChild(arrayContainer);
      }
    }
  }

    // Render Data Badges & Snapshots Row
    const dataRow = document.createElement("div");
    dataRow.className = "inspector-metrics-row";

    if (step.action) {
      const isMatch = step.action.includes("Match") || (step.invariantStatus && step.invariantStatus.includes("Target Met"));
      const actionPill = document.createElement("div");
      actionPill.className = `action-status-pill ${isMatch ? "match" : ""}`;
      actionPill.textContent = step.action;
      dataRow.appendChild(actionPill);
    }

    if (step.indices) {
      Object.entries(step.indices).forEach(([k, v]) => {
        const b = document.createElement("div");
        b.className = "inspector-pill-badge";
        b.innerHTML = `${k}: <b>${v}</b>`;
        dataRow.appendChild(b);
      });
    }

    if (step.currentVal !== undefined) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `val: <b>${step.currentVal}</b>`;
      dataRow.appendChild(b);
    }

    if (step.complement !== undefined) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `need: <b>${step.complement}</b>`;
      dataRow.appendChild(b);
    }

    if (step.currentArea !== undefined) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `area: <b>${step.currentArea}</b>`;
      dataRow.appendChild(b);
    }

    if (step.pointers) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `ptrs: <b>${step.pointers}</b>`;
      dataRow.appendChild(b);
    }

    if (step.stackVals) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `stack: <b>${step.stackVals}</b>`;
      dataRow.appendChild(b);
    }

    if (step.pos) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `pos: <b>${step.pos}</b>`;
      dataRow.appendChild(b);
    }

    if (step.char) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `target: <b>'${step.char}'</b>`;
      dataRow.appendChild(b);
    }

    if (step.matchedCount !== undefined && trace.targetWord) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `matched: <b>${step.matchedCount}/${trace.targetWord.length}</b>`;
      dataRow.appendChild(b);
    }

    if (step.hashTable) {
      const entries = Object.entries(step.hashTable).map(([k, v]) => `${k}->[${v}]`).join(", ") || "none";
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `map: <b>{${entries}}</b>`;
      dataRow.appendChild(b);
    }

    stage.appendChild(dataRow);

    // Update Step Caption Bar
    const explEl = document.getElementById("visExplanation");
    if (explEl) explEl.textContent = `Step ${this.currentStepIndex + 1} of ${trace.steps.length}: ${step.explanation}`;

    const statusTag = document.getElementById("visStatusTag");
    if (statusTag) {
      statusTag.textContent = step.invariantStatus || "Invariant Maintained";
    }
  },

  nextStep() {
    const trace = this.getTrace();
    if (!trace || !trace.steps) return;
    if (this.currentStepIndex < trace.steps.length - 1) {
      this.currentStepIndex++;
      this.render();
    } else {
      this.pause();
    }
  },

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.render();
    }
  },

  reset() {
    this.currentStepIndex = 0;
    this.pause();
    this.render();
  },

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  play() {
    this.isPlaying = true;
    const btn = document.getElementById("btnVisPlay");
    if (btn) btn.textContent = "Pause";
    const delay = this.speed === 1 ? 1400 : 700;
    const timerFn = typeof window !== "undefined" && window.setInterval ? window.setInterval : (typeof setInterval !== "undefined" ? setInterval : ((fn) => 1));
    this.timerId = timerFn(() => {
      const trace = this.getTrace();
      if (this.currentStepIndex >= trace.steps.length - 1) {
        this.currentStepIndex = 0;
      } else {
        this.currentStepIndex++;
      }
      this.render();
    }, delay);
  },

  pause() {
    this.isPlaying = false;
    const btn = document.getElementById("btnVisPlay");
    if (btn) btn.textContent = "Play";
    if (this.timerId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.timerId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.timerId);
    }
    this.timerId = null;
  },

  setSpeed(s) {
    this.speed = s;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }
};

// ============================================================================
// 3-STEP ACCORDION WIZARD
// ============================================================================

function setProblemStep(stepNum) {
  AppState.activeProblemStep = stepNum;

  const card1 = document.getElementById("wizardStep1Card");
  const card2 = document.getElementById("wizardStep2Card");
  const card3 = document.getElementById("wizardStep3Card");

  const body1 = document.getElementById("wizardStep1Body");
  const body2 = document.getElementById("wizardStep2Body");
  const body3 = document.getElementById("wizardStep3Body");

  const stat1 = document.getElementById("step1StatusCaption");
  const stat2 = document.getElementById("step2StatusCaption");
  const stat3 = document.getElementById("step3StatusCaption");

  if (card1 && body1) {
    if (stepNum === 1) {
      card1.className = "wizard-step-tile active";
      body1.style.display = "flex";
      if (stat1) stat1.textContent = "Active Step";
    } else {
      card1.className = "wizard-step-tile completed";
      body1.style.display = "none";
      if (stat1) stat1.textContent = "Completed";
    }
  }

  if (card2 && body2) {
    if (stepNum === 2) {
      card2.className = "wizard-step-tile active";
      body2.style.display = "flex";
      if (stat2) stat2.textContent = "Active Step";
    } else if (stepNum > 2) {
      card2.className = "wizard-step-tile completed";
      body2.style.display = "none";
      if (stat2) stat2.textContent = "Completed";
    } else {
      card2.className = "wizard-step-tile locked";
      body2.style.display = "none";
      if (stat2) stat2.textContent = "Locked";
    }
  }

  if (card3 && body3) {
    if (stepNum === 3) {
      card3.className = "wizard-step-tile active";
      body3.style.display = "flex";
      if (stat3) stat3.textContent = "Active Step";
    } else {
      card3.className = "wizard-step-tile locked";
      body3.style.display = "none";
      if (stat3) stat3.textContent = "Locked";
    }
  }
}

function advanceToStep2() {
  const problem = BLIND_75_DATABASE.find(p => p.id === AppState.activeProblemId);
  if (problem && problem.leetcodeUrl && typeof window !== "undefined") {
    window.open(problem.leetcodeUrl, "_blank");
  }
  setProblemStep(2);
  TimerEngine.switchToPhase2();
}

function advanceToStep3() {
  TimerEngine.stopPhase2();
  setProblemStep(3);

  const autopsy = AppState.autopsies[AppState.activeProblemId];
  if (autopsy) {
    loadSavedDebrief(autopsy);
  }
}

function toggleSanityReveal() {
  const aEl = document.getElementById("wizardSanityAnswer");
  if (!aEl) return;
  aEl.style.display = (aEl.style.display === "none" || !aEl.style.display) ? "block" : "none";
}

function toggleNudgeBody(num) {
  const body = document.getElementById(`wizardNudge${num}`);
  const icon = document.getElementById(`nudgeToggleIcon${num}`);
  if (!body) return;
  if (body.style.display === "block") {
    body.style.display = "none";
    if (icon) icon.textContent = "▾";
  } else {
    body.style.display = "block";
    if (icon) icon.textContent = "▴";
  }
}

function selectOutcomeCard(el, outcome) {
  document.querySelectorAll("#wizardOutcomeGrid .outcome-option-tile").forEach(t => t.classList.remove("selected"));
  el.classList.add("selected");

  const reactionBanner = document.getElementById("wizardReactionBanner");
  if (reactionBanner) {
    const days = outcome === "cold" ? 14 : outcome === "buggy" ? 5 : outcome === "hints" ? 3 : 1;
    reactionBanner.textContent = outcome === "cold"
      ? "Proven Cold achieved. Scheduled for 14-day cold verification."
      : `Scheduled for rematch review in +${days} days.`;
  }
}

function calculateNextReviewDate(outcome) {
  const now = new Date();
  let daysToAdd = outcome === "cold" ? 14 : outcome === "buggy" ? 5 : outcome === "hints" ? 3 : 1;
  const reviewDate = new Date(now.getTime() + daysToAdd * 864e5);
  return reviewDate.toISOString().split("T")[0];
}

function saveWizardDebrief() {
  const problemId = AppState.activeProblemId;
  const problem = BLIND_75_DATABASE.find(p => p.id === problemId);
  if (!problem) return;

  const selectedTile = document.querySelector("#wizardOutcomeGrid .outcome-option-tile.selected");
  const outcome = selectedTile?.dataset?.outcome || "cold";
  const noteEl = document.getElementById("wizardNoteInput");
  const note = noteEl ? noteEl.value.trim() : "";
  const nextReviewDate = calculateNextReviewDate(outcome);

  if (outcome === "cold") {
    AppState.mastery[problemId] = "cold";
  } else {
    if (AppState.mastery[problemId] !== "cold") {
      AppState.mastery[problemId] = "pass1";
    }
  }

  const prev = AppState.autopsies[problemId] || {};
  AppState.autopsies[problemId] = {
    outcome,
    note,
    nextReviewDate,
    reviewCount: (prev.reviewCount || 0) + 1
  };

  if (note.length > 0) {
    AppState.mistakeJournal.unshift({
      problemId,
      title: problem.title,
      note,
      outcome,
      date: new Date().toLocaleDateString()
    });
  }

  persistState();
  updateTopStats();
  renderRoadmap();
  renderDailyProblemPills(AppState.currentDay);

  unlockInterviewPitchCard(problem);
}

function unlockInterviewPitchCard(problem) {
  const pitchCard = document.getElementById("wizardPitchRewardCard");
  if (!pitchCard) return;

  const pitch = problem.interviewPitch || {
    naiveTrap: "A brute-force approach compares all pairs in O(N²), which is too slow.",
    keyInsight: "Instead, as we scan once, we maintain a hash map for immediate O(1) complement lookups.",
    complexityGuarantee: "This guarantees O(N) time and O(N) space, avoiding redundant checks."
  };

  const trapEl = document.getElementById("pitchNaiveTrap");
  if (trapEl) trapEl.textContent = pitch.naiveTrap;

  const insightEl = document.getElementById("pitchKeyInsight");
  if (insightEl) insightEl.textContent = pitch.keyInsight;

  const compEl = document.getElementById("pitchComplexityGuarantee");
  if (compEl) compEl.textContent = pitch.complexityGuarantee;

  pitchCard.style.display = "flex";
}

function copyPitchScript() {
  const trap = document.getElementById("pitchNaiveTrap")?.textContent || "";
  const insight = document.getElementById("pitchKeyInsight")?.textContent || "";
  const comp = document.getElementById("pitchComplexityGuarantee")?.textContent || "";

  const pitchText = `30-Second Interview Explanation:\n1. The Naive Trap: ${trap}\n2. The Key Insight: ${insight}\n3. The Complexity Guarantee: ${comp}`;

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(pitchText).then(() => {
      alert("Interview Pitch script copied to clipboard.");
    });
  }
}

function loadSavedDebrief(autopsy) {
  document.querySelectorAll("#wizardOutcomeGrid .outcome-option-tile").forEach(t => {
    if (t.dataset.outcome === autopsy.outcome) {
      t.classList.add("selected");
    } else {
      t.classList.remove("selected");
    }
  });

  const noteEl = document.getElementById("wizardNoteInput");
  if (noteEl && autopsy.note) noteEl.value = autopsy.note;

  const problem = BLIND_75_DATABASE.find(p => p.id === AppState.activeProblemId);
  if (problem) unlockInterviewPitchCard(problem);
}

function advanceToNextDailyProblem() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay) || CURRICULUM_DATABASE[0];
  const tasks = dayData.blind75Tasks || [];
  if (AppState.activeProblemIndex < tasks.length - 1) {
    selectDailyProblem(AppState.activeProblemIndex + 1);
  } else {
    alert("Practice session complete for today. Review Rematches or drill patterns.");
    switchDaySubTab("learn");
  }
}

// ============================================================================
// DAILY CURRICULUM & PILLS
// ============================================================================

function switchDaySubTab(tab) {
  AppState.currentSubTab = tab;
  persistState();

  const tabBtnLearn = document.getElementById("tabBtnLearn");
  const tabBtnSolve = document.getElementById("tabBtnSolve");
  const panelLearn = document.getElementById("tabPanelLearn");
  const panelSolve = document.getElementById("tabPanelSolve");

  if (tab === "learn") {
    if (tabBtnLearn) tabBtnLearn.classList.add("active");
    if (tabBtnSolve) tabBtnSolve.classList.remove("active");
    if (panelLearn) panelLearn.style.display = "flex";
    if (panelSolve) panelSolve.style.display = "none";
  } else {
    if (tabBtnLearn) tabBtnLearn.classList.remove("active");
    if (tabBtnSolve) tabBtnSolve.classList.add("active");
    if (panelLearn) panelLearn.style.display = "none";
    if (panelSolve) panelSolve.style.display = "flex";
    selectDailyProblem(AppState.activeProblemIndex || 0);
  }
}

function renderDailyProblemPills(dayNumber) {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === dayNumber) || CURRICULUM_DATABASE[0];
  const container = document.getElementById("dailyProblemPills");
  if (!container) return;
  container.innerHTML = "";

  const tasks = dayData.blind75Tasks || [];
  tasks.forEach((task, idx) => {
    const p = BLIND_75_DATABASE.find(x => x.id === task.id) || task;
    const masteryState = AppState.mastery[p.id];

    let masteryBadge = "";
    if (masteryState === "cold") {
      masteryBadge = `<span class="apple-diff-pill Easy" style="font-size:10px;">Cold</span>`;
    } else if (masteryState === "pass1") {
      masteryBadge = `<span class="apple-diff-pill" style="font-size:10px; background:var(--apple-action-subtle); color:var(--apple-action-dark);">Pass 1</span>`;
    }

    const pill = document.createElement("button");
    pill.className = `practice-pill-btn ${idx === AppState.activeProblemIndex ? "active" : ""} ${masteryState === "cold" ? "cold-mastered" : ""}`;
    pill.onclick = () => selectDailyProblem(idx);
    pill.innerHTML = `
      <span>#${p.id}: ${p.title}</span>
      <span class="apple-diff-pill ${p.difficulty}">${p.difficulty}</span>
      ${masteryBadge}
    `;
    container.appendChild(pill);
  });

  // Daily Benchmark Challenge Pill
  if (dayData.extremeProblem) {
    const ext = dayData.extremeProblem;
    const bossPill = document.createElement("button");
    bossPill.className = `practice-pill-btn ${AppState.activeProblemIndex === tasks.length ? "active" : ""}`;
    bossPill.onclick = () => selectDailyBossFight(dayData.extremeProblem);
    bossPill.innerHTML = `
      <span>Benchmark: ${ext.title}</span>
      <span class="apple-diff-pill Boss">Benchmark</span>
    `;
    container.appendChild(bossPill);
  }

  const solveBadge = document.getElementById("tabSolveCountBadge");
  if (solveBadge) {
    solveBadge.textContent = String(tasks.length);
  }
}

function selectDailyProblem(index) {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay) || CURRICULUM_DATABASE[0];
  const tasks = dayData.blind75Tasks || [];
  if (!tasks[index]) return;

  AppState.activeProblemIndex = index;
  const taskId = tasks[index].id;
  AppState.activeProblemId = taskId;
  persistState();

  const problem = BLIND_75_DATABASE.find(p => p.id === taskId);
  if (!problem) return;

  // Highlight active pill
  document.querySelectorAll("#dailyProblemPills .practice-pill-btn").forEach((el, i) => {
    if (i === index) el.classList.add("active");
    else el.classList.remove("active");
  });

  // Populate Step 1
  const titleEl = document.getElementById("wizardProblemTitle");
  if (titleEl) titleEl.textContent = `#${problem.id}: ${problem.title}`;

  const diffBadge = document.getElementById("wizardProblemDiff");
  if (diffBadge) {
    diffBadge.textContent = problem.difficulty;
    diffBadge.className = `apple-diff-pill ${problem.difficulty}`;
  }

  const mainPortalLink = document.getElementById("btnSolvePortalMain");
  if (mainPortalLink) mainPortalLink.href = problem.leetcodeUrl;

  // Sanity Question
  const sanity = (typeof COACH_DATA !== "undefined" && COACH_DATA.sanityChecks && COACH_DATA.sanityChecks[problem.id]) || {
    question: `Before coding #${problem.id} (${problem.title}), what edge case breaks a naive solution?`,
    coachCheck: `Identify the base case immediately. Remember: ${problem.keyInvariant}`
  };
  const qEl = document.getElementById("wizardSanityQuestion");
  if (qEl) qEl.textContent = sanity.question;

  const aEl = document.getElementById("wizardSanityAnswer");
  if (aEl) {
    aEl.style.display = "none";
    aEl.innerHTML = `<b>Coach check:</b> ${sanity.coachCheck}`;
  }

  // Principles / Nudges
  const n1 = document.getElementById("wizardNudge1");
  const n2 = document.getElementById("wizardNudge2");
  const n3 = document.getElementById("wizardNudge3");
  if (dayData.socraticHints) {
    if (n1) n1.textContent = dayData.socraticHints.hint1;
    if (n2) n2.textContent = dayData.socraticHints.hint2;
    if (n3) n3.textContent = dayData.socraticHints.hint3;
  }

  TimerEngine.resetTimer();

  const pitchCard = document.getElementById("wizardPitchRewardCard");
  if (pitchCard) pitchCard.style.display = "none";

  setProblemStep(1);
}

function selectDailyBossFight(boss) {
  AppState.activeProblemIndex = 999;
  const titleEl = document.getElementById("wizardProblemTitle");
  if (titleEl) titleEl.textContent = `Benchmark: ${boss.title}`;

  const diffBadge = document.getElementById("wizardProblemDiff");
  if (diffBadge) {
    diffBadge.textContent = "Benchmark";
    diffBadge.className = "apple-diff-pill Boss";
  }

  const mainPortalLink = document.getElementById("btnSolvePortalMain");
  if (mainPortalLink) mainPortalLink.href = boss.url;

  const qEl = document.getElementById("wizardSanityQuestion");
  if (qEl) qEl.textContent = `Benchmark Challenge: ${boss.whyThisBenchmark}`;

  setProblemStep(1);
}

// ============================================================================
// DAY SWITCHING & ROADMAP
// ============================================================================

function switchDay(dayNumber) {
  if (dayNumber < 1 || dayNumber > 30) return;
  AppState.currentDay = dayNumber;
  AppState.activeProblemIndex = 0;
  persistState();

  const dayData = CURRICULUM_DATABASE.find(d => d.day === dayNumber) || CURRICULUM_DATABASE[0];

  const breadcrumbEl = document.getElementById("globalBreadcrumb");
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = `
      <span class="nav-breadcrumb-phase">${dayData.phase.split(":")[0]}</span>
      <span class="nav-breadcrumb-sep">/</span>
      <span class="nav-breadcrumb-active">Day ${String(dayData.day).padStart(2, "0")}: ${dayData.category}</span>
    `;
  }

  const headingEl = document.getElementById("dayHeading");
  if (headingEl) {
    headingEl.textContent = `Day ${String(dayData.day).padStart(2, "0")}. ${dayData.category}`;
  }

  const subEl = document.getElementById("dayCategorySub");
  if (subEl) {
    const subtitleDetail = dayData.subtitle || dayData.objective || dayData.invariant || "";
    subEl.textContent = subtitleDetail ? `${dayData.phase} — ${subtitleDetail}` : dayData.phase;
  }

  const briefingText = (typeof COACH_DATA !== "undefined" && COACH_DATA.briefings && COACH_DATA.briefings[dayNumber]) ||
    `Focus on establishing the core invariant before writing code. In ${dayData.category}, we eliminate redundant checks by maintaining state in memory.`;
  const briefEl = document.getElementById("briefingText");
  if (briefEl) briefEl.textContent = briefingText;

  const ruleEl = document.getElementById("cardCoreRule");
  if (ruleEl) ruleEl.textContent = dayData.invariant;

  const trapsEl = document.getElementById("cardTraps");
  if (trapsEl && dayData.antiPatterns) {
    trapsEl.innerHTML = dayData.antiPatterns.map(ap => `<div class="trap-bullet-item">${ap}</div>`).join("");
  }

const DAY_DEEP_LINKS = {
  1: { neetcode: "https://neetcode.io/problems/two-integer-sum", usaco: "https://usaco.guide/bronze/intro-sets" },
  2: { neetcode: "https://neetcode.io/problems/group-anagrams", usaco: "https://usaco.guide/silver/prefix-sums" },
  3: { neetcode: "https://neetcode.io/problems/longest-consecutive-sequence", usaco: "https://usaco.guide/silver/more-prefix-sums" },
  4: { neetcode: "https://neetcode.io/problems/three-integer-sum", usaco: "https://usaco.guide/silver/two-pointers" },
  5: { neetcode: "https://neetcode.io/problems/max-water-container", usaco: "https://usaco.guide/silver/two-pointers" },
  6: { neetcode: "https://neetcode.io/problems/longest-substring-without-duplicates", usaco: "https://usaco.guide/silver/prefix-sums" },
  7: { neetcode: "https://neetcode.io/problems/minimum-window-with-characters", usaco: "https://usaco.guide/silver/two-pointers" },
  8: { neetcode: "https://neetcode.io/problems/validate-parentheses", usaco: "https://usaco.guide/gold/stacks" },
  9: { neetcode: "https://neetcode.io/problems/largest-rectangle-in-histogram", usaco: "https://usaco.guide/gold/stacks" },
  10: { neetcode: "https://neetcode.io/problems/eating-bananas", usaco: "https://usaco.guide/silver/binary-search" },
  11: { neetcode: "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array", usaco: "https://usaco.guide/silver/binary-search" },
  12: { neetcode: "https://neetcode.io/problems/reverse-a-linked-list", usaco: "https://usaco.guide/bronze/simulation" },
  13: { neetcode: "https://neetcode.io/problems/merge-k-sorted-linked-lists", usaco: "https://usaco.guide/silver/greedy-sorting" },
  14: { neetcode: "https://neetcode.io/problems/invert-a-binary-tree", usaco: "https://usaco.guide/silver/intro-trees" },
  15: { neetcode: "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree", usaco: "https://usaco.guide/silver/tree-euler" },
  16: { neetcode: "https://neetcode.io/problems/binary-tree-maximum-path-sum", usaco: "https://usaco.guide/silver/tree-euler" },
  17: { neetcode: "https://neetcode.io/problems/implement-prefix-tree", usaco: "https://usaco.guide/gold/string-searching" },
  18: { neetcode: "https://neetcode.io/problems/find-median-in-a-data-stream", usaco: "https://usaco.guide/gold/shortest-paths" },
  19: { neetcode: "https://neetcode.io/problems/combination-target-sum", usaco: "https://usaco.guide/bronze/complete-rec" },
  20: { neetcode: "https://neetcode.io/problems/count-number-of-islands", usaco: "https://usaco.guide/silver/flood-fill" },
  21: { neetcode: "https://neetcode.io/problems/course-schedule", usaco: "https://usaco.guide/gold/toposort" },
  22: { neetcode: "https://neetcode.io/problems/foreign-dictionary", usaco: "https://usaco.guide/gold/dsu" },
  23: { neetcode: "https://neetcode.io/problems/house-robber", usaco: "https://usaco.guide/gold/intro-dp" },
  24: { neetcode: "https://neetcode.io/problems/coin-change", usaco: "https://usaco.guide/gold/knapsack" },
  25: { neetcode: "https://neetcode.io/problems/longest-increasing-subsequence", usaco: "https://usaco.guide/gold/paths-grids" },
  26: { neetcode: "https://neetcode.io/problems/longest-common-subsequence", usaco: "https://usaco.guide/gold/paths-grids" },
  27: { neetcode: "https://neetcode.io/problems/meeting-schedule", usaco: "https://usaco.guide/silver/greedy-sorting" },
  28: { neetcode: "https://neetcode.io/problems/sum-of-two-integers", usaco: "https://usaco.guide/gold/bitwise-ops" },
  29: { neetcode: "https://neetcode.io/problems/rotate-matrix", usaco: "https://usaco.guide/bronze/rect-geom" },
  30: { neetcode: "https://neetcode.io/problems/lru-cache", usaco: "https://usaco.guide/gold/dsu" }
};

  const deepLinks = DAY_DEEP_LINKS[dayNumber] || {
    neetcode: "https://neetcode.io/practice?tab=neetcode150",
    usaco: "https://usaco.guide/silver"
  };

  const linkNeet = document.getElementById("linkNeetcode");
  if (linkNeet) {
    linkNeet.href = (dayData.verifiedLinks && dayData.verifiedLinks.neetcode) || deepLinks.neetcode;
    linkNeet.title = `Open NeetCode Guide for Day ${dayNumber}`;
  }
  const linkUsaco = document.getElementById("linkUsaco");
  if (linkUsaco) {
    const usacoRes = (dayData.authoritativeResources || []).find(r => r.url && r.url.includes("usaco.guide") && r.url.length > 25);
    linkUsaco.href = (usacoRes && usacoRes.url) || (dayData.verifiedLinks && dayData.verifiedLinks.usaco) || deepLinks.usaco;
    linkUsaco.title = `Open USACO Reference for Day ${dayNumber}`;
  }

  renderDailyProblemPills(dayNumber);
  VisualizerEngine.init();
  renderRoadmap();
  switchDaySubTab(AppState.currentSubTab || "learn");
}

function renderRoadmap() {
  const container = document.getElementById("roadmapList");
  if (!container) return;
  container.innerHTML = "";

  const phases = {};
  CURRICULUM_DATABASE.forEach(d => {
    const pName = d.phase.split(":")[0];
    if (!phases[pName]) phases[pName] = [];
    phases[pName].push(d);
  });

  Object.entries(phases).forEach(([phaseName, days]) => {
    const group = document.createElement("div");
    group.className = "roadmap-phase-group";

    const label = document.createElement("div");
    label.className = "roadmap-phase-header";
    label.textContent = phaseName;
    group.appendChild(label);

    days.forEach(d => {
      const row = document.createElement("div");
      row.className = `day-list-item ${d.day === AppState.currentDay ? "active" : ""}`;
      row.onclick = () => switchDay(d.day);

      const tasks = d.blind75Tasks || [];
      const completedTasks = tasks.filter(t => AppState.mastery[t.id]);
      let statusBadge = "";
      if (completedTasks.length === tasks.length && tasks.length > 0) {
        statusBadge = '<span class="day-status-pill complete">Done</span>';
      } else if (completedTasks.length > 0) {
        statusBadge = '<span class="day-status-pill partial">In Progress</span>';
      }

      row.innerHTML = `
        <div class="day-item-left">
          <span class="day-index-label">${String(d.day).padStart(2, "0")}</span>
          <span>${d.category}</span>
        </div>
        ${statusBadge}
      `;
      group.appendChild(row);
    });

    container.appendChild(group);
  });
}

function toggleSidebar() {
  const workstation = document.getElementById("viewGrind");
  if (!workstation) return;
  workstation.classList.toggle("sidebar-collapsed");
  AppState.sidebarCollapsed = workstation.classList.contains("sidebar-collapsed");
  const btn = document.getElementById("btnToggleSidebar");
  if (btn) {
    btn.classList.toggle("is-collapsed", AppState.sidebarCollapsed);
    btn.setAttribute("aria-expanded", String(!AppState.sidebarCollapsed));
    btn.setAttribute("title", AppState.sidebarCollapsed ? "Expand Roadmap Sidebar (Shortcut: [ )" : "Collapse Roadmap Sidebar (Shortcut: [ )");
  }
  persistState();
}

// ============================================================================
// 60-SECOND BLIND PATTERN DRILL
// ============================================================================

const DRILL_PATTERNS = [
  "Two Pointers",
  "Sliding Window",
  "Hash Map / Set",
  "Fast & Slow Pointers",
  "Monotonic Stack",
  "Binary Search",
  "BFS / DFS",
  "1D Dynamic Programming",
  "2D Dynamic Programming",
  "Trie",
  "Union-Find",
  "Heap / Priority Queue",
  "Greedy / Intervals",
  "Backtracking"
];

let activeDrillProblem = null;
let selectedDrillPattern = null;
let selectedDrillComplexity = null;

function initPatternDrill() {
  const container = document.getElementById("drillPatternChips");
  if (!container) return;
  container.innerHTML = "";

  DRILL_PATTERNS.forEach(pat => {
    const btn = document.createElement("button");
    btn.className = "pattern-selection-chip";
    btn.textContent = pat;
    btn.onclick = () => {
      document.querySelectorAll("#drillPatternChips .pattern-selection-chip").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedDrillPattern = pat;
    };
    container.appendChild(btn);
  });

  loadRandomPatternDrill();
}

function loadRandomPatternDrill() {
  selectedDrillPattern = null;
  selectedDrillComplexity = null;

  document.querySelectorAll("#drillPatternChips .pattern-selection-chip").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll("#drillComplexityChips .complexity-selection-chip").forEach(b => b.classList.remove("selected"));

  const feedbackCard = document.getElementById("drillFeedbackCard");
  if (feedbackCard) feedbackCard.style.display = "none";

  const randIdx = Math.floor(Math.random() * BLIND_75_DATABASE.length);
  activeDrillProblem = BLIND_75_DATABASE[randIdx];

  const titleEl = document.getElementById("drillProblemTitle");
  if (titleEl) titleEl.textContent = `#${activeDrillProblem.id}: ${activeDrillProblem.title}`;

  const diffEl = document.getElementById("drillProblemDiff");
  if (diffEl) {
    diffEl.textContent = activeDrillProblem.difficulty;
    diffEl.className = `apple-diff-pill ${activeDrillProblem.difficulty}`;
  }

  const promptEl = document.getElementById("drillProblemPrompt");
  if (promptEl) {
    promptEl.textContent = `Problem Premise: ${activeDrillProblem.keyInvariant}`;
  }
}

function selectDrillComplexity(btn) {
  document.querySelectorAll("#drillComplexityChips .complexity-selection-chip").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedDrillComplexity = btn.dataset.complexity;
}

function checkPatternDrill() {
  if (!activeDrillProblem) return;
  if (!selectedDrillPattern) {
    alert("Please select a pattern/data structure chip first.");
    return;
  }

  const correctPattern = activeDrillProblem.patternTag || "Hash Map / Set";
  const isPatternCorrect = selectedDrillPattern.toLowerCase().replace(/\s+/g, '') === correctPattern.toLowerCase().replace(/\s+/g, '') ||
                          correctPattern.includes(selectedDrillPattern) || selectedDrillPattern.includes(correctPattern);

  const feedbackCard = document.getElementById("drillFeedbackCard");
  const statusEl = document.getElementById("drillFeedbackStatus");
  const trickEl = document.getElementById("drillCoreTrick");
  const trapEl = document.getElementById("drillPitchTrap");
  const insightEl = document.getElementById("drillPitchInsight");
  const guaranteeEl = document.getElementById("drillPitchGuarantee");

  AppState.drillStats.total++;
  if (isPatternCorrect) {
    AppState.drillStats.correct++;
    if (feedbackCard) feedbackCard.className = "drill-feedback-card correct";
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--status-cold);">Correct. Optimal Pattern: ${correctPattern}</span>`;
  } else {
    if (feedbackCard) feedbackCard.className = "drill-feedback-card incorrect";
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--status-danger);">Incorrect. Optimal Pattern: ${correctPattern}</span> (Selected: ${selectedDrillPattern})`;
  }

  const pitch = activeDrillProblem.interviewPitch || {};
  if (trickEl) trickEl.textContent = activeDrillProblem.keyInvariant;
  if (trapEl) trapEl.textContent = pitch.naiveTrap || "A brute force comparison is too slow.";
  if (insightEl) insightEl.textContent = pitch.keyInsight || `We leverage ${correctPattern} for optimal bounds.`;
  if (guaranteeEl) guaranteeEl.textContent = pitch.complexityGuarantee || `Guarantees ${activeDrillProblem.timeComplexity}.`;

  if (feedbackCard) feedbackCard.style.display = "flex";

  const pct = Math.round((AppState.drillStats.correct / AppState.drillStats.total) * 100);
  const statsEl = document.getElementById("drillStatsText");
  if (statsEl) statsEl.textContent = `${AppState.drillStats.correct}/${AppState.drillStats.total} (${pct}%)`;

  persistState();
}

// ============================================================================
// REMATCH QUEUE & 75 INDEX
// ============================================================================

function renderRematchQueueView() {
  const todayStr = new Date().toISOString().split("T")[0];
  const container = document.getElementById("rematchTableContainer");
  if (!container) return;
  container.innerHTML = "";

  const dueProblems = [];
  BLIND_75_DATABASE.forEach(p => {
    const autopsy = AppState.autopsies[p.id];
    if (autopsy && autopsy.nextReviewDate && autopsy.nextReviewDate <= todayStr) {
      dueProblems.push({ problem: p, autopsy });
    }
  });

  if (dueProblems.length === 0) {
    container.innerHTML = `
      <div style="font-size:13px; color:var(--apple-body-muted); padding:24px; background:var(--apple-tile-1); border:1px solid var(--apple-hairline); border-radius:var(--rounded-md); text-align:center;">
        No rematches due today. All active recall targets are up to date.
      </div>
    `;
    return;
  }

  const table = document.createElement("table");
  table.className = "apple-data-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Problem</th>
      <th>Difficulty</th>
      <th>Pattern</th>
      <th>Scheduled Date</th>
      <th>Review Note</th>
      <th>Action</th>
    </tr>
  `;
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  dueProblems.forEach(({ problem: p, autopsy }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><b>#${p.id}: ${p.title}</b></td>
      <td><span class="apple-diff-pill ${p.difficulty}">${p.difficulty}</span></td>
      <td>${p.patternTag || p.category}</td>
      <td style="font-family:var(--font-mono); font-size:11px;">${autopsy.nextReviewDate}</td>
      <td style="font-size:12px; color:var(--apple-body-secondary);">${autopsy.note || "No note recorded."}</td>
      <td>
        <button class="apple-pill-btn" onclick="jumpToProblemFromRematch(${p.dayMapped}, ${p.id})">
          Review Problem →
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  container.appendChild(table);
}

function jumpToProblemFromRematch(day, problemId) {
  switchView("today");
  switchDay(day);
  switchDaySubTab("solve");

  const dayData = CURRICULUM_DATABASE.find(d => d.day === day);
  const tasks = dayData?.blind75Tasks || [];
  const idx = tasks.findIndex(t => t.id === problemId);
  if (idx !== -1) {
    selectDailyProblem(idx);
  }
}

// 75 Matrix View
let currentMatrixFilter = "all";

function setMatrixFilter(filter) {
  currentMatrixFilter = filter;
  ["All", "Cold", "Pass1", "Unsolved"].forEach(name => {
    const btn = document.getElementById(`matrixFilter${name}`);
    if (btn) {
      if (name.toLowerCase() === filter.toLowerCase()) btn.className = "apple-pill-btn primary";
      else btn.className = "apple-pill-btn";
    }
  });
  renderMatrixView();
}

function renderMatrixView() {
  const container = document.getElementById("matrixTableWrapper");
  if (!container) return;
  container.innerHTML = "";

  const searchKeyword = document.getElementById("matrixSearchInput")?.value.toLowerCase().trim() || "";

  const table = document.createElement("table");
  table.className = "apple-data-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Problem Title</th>
      <th>Category</th>
      <th>Difficulty</th>
      <th>Complexity</th>
      <th>Day</th>
      <th>Status</th>
    </tr>
  `;
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  const filtered = BLIND_75_DATABASE.filter(p => {
    const matchesSearch = !searchKeyword || p.title.toLowerCase().includes(searchKeyword) || p.category.toLowerCase().includes(searchKeyword);
    const masteryState = AppState.mastery[p.id];
    if (currentMatrixFilter === "cold") return matchesSearch && masteryState === "cold";
    if (currentMatrixFilter === "pass1") return matchesSearch && masteryState === "pass1";
    if (currentMatrixFilter === "unsolved") return matchesSearch && !masteryState;
    return matchesSearch;
  });

  filtered.forEach(p => {
    const masteryState = AppState.mastery[p.id];

    let badgeHtml = '<span class="apple-diff-pill" style="background:var(--apple-tile-2); color:var(--apple-text-muted);">Unsolved</span>';
    if (masteryState === "cold") {
      badgeHtml = '<span class="apple-diff-pill Easy">Cold Mastered</span>';
    } else if (masteryState === "pass1") {
      badgeHtml = '<span class="apple-diff-pill" style="background:var(--apple-action-subtle); color:var(--apple-action-dark);">First Pass</span>';
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:600;">#${p.id}</td>
      <td>
        <a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--apple-text-primary); text-decoration:none;">
          ${p.title} ↗
        </a>
      </td>
      <td>${p.category}</td>
      <td><span class="apple-diff-pill ${p.difficulty}">${p.difficulty}</span></td>
      <td style="font-family:var(--font-mono); font-size:11px;">${p.timeComplexity || "O(N)"}</td>
      <td>
        <a href="#" style="color:var(--apple-action-dark); text-decoration:none;" onclick="jumpToProblemFromRematch(${p.dayMapped}, ${p.id})">
          Day ${p.dayMapped}
        </a>
      </td>
      <td>${badgeHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  container.appendChild(table);
}

// ============================================================================
// TOP VIEW SWITCHER & TELEMETRY
// ============================================================================

function switchView(viewName) {
  AppState.currentView = viewName;
  persistState();

  document.querySelectorAll(".nav-switch-btn").forEach(b => b.classList.remove("active"));
  const btnMap = { today: "viewBtnToday", rematch: "viewBtnRematch", drill: "viewBtnDrill", matrix: "viewBtnMatrix", profile: "viewBtnProfile" };
  const activeBtn = document.getElementById(btnMap[viewName]);
  if (activeBtn) activeBtn.classList.add("active");

  const vGrind = document.getElementById("viewGrind");
  const vRematch = document.getElementById("viewRematch");
  const vDrill = document.getElementById("viewDrill");
  const vMatrix = document.getElementById("viewMatrix");
  const vProfile = document.getElementById("viewProfile");

  if (viewName === "today") {
    if (vGrind) vGrind.style.display = "grid";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
    if (vProfile) vProfile.classList.remove("active-view");
  } else if (viewName === "rematch") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.add("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
    if (vProfile) vProfile.classList.remove("active-view");
    renderRematchQueueView();
  } else if (viewName === "drill") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.add("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
    if (vProfile) vProfile.classList.remove("active-view");
    initPatternDrill();
  } else if (viewName === "matrix") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.add("active-view");
    if (vProfile) vProfile.classList.remove("active-view");
    renderMatrixView();
  } else if (viewName === "profile") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
    if (vProfile) vProfile.classList.add("active-view");
    renderProfileView();
  }
}

// ============================================================================
// PROFILE & ANALYTICS VIEW RENDERER (LEETCODE GRADE)
// ============================================================================

function renderProfileView() {
  const container = document.getElementById("profileViewContainer");
  if (!container) return;

  const userName = AppState.userName || "Engineer";
  const userInitial = userName.trim().charAt(0).toUpperCase() || "E";

  const coldCount = Object.values(AppState.mastery).filter(m => m === "cold").length;
  const pass1Count = Object.values(AppState.mastery).filter(m => m === "pass1").length;
  const totalSolved = coldCount + pass1Count;
  const unsolvedCount = Math.max(0, 75 - totalSolved);

  const coldDeg = (coldCount / 75) * 360;
  const pass1Deg = ((coldCount + pass1Count) / 75) * 360;

  let easyTotal = 0, easyCold = 0, easyPass1 = 0;
  let medTotal = 0, medCold = 0, medPass1 = 0;
  let hardTotal = 0, hardCold = 0, hardPass1 = 0;

  BLIND_75_DATABASE.forEach(p => {
    const m = AppState.mastery[p.id];
    if (p.difficulty === "Easy") {
      easyTotal++;
      if (m === "cold") easyCold++;
      else if (m === "pass1") easyPass1++;
    } else if (p.difficulty === "Medium") {
      medTotal++;
      if (m === "cold") medCold++;
      else if (m === "pass1") medPass1++;
    } else if (p.difficulty === "Hard") {
      hardTotal++;
      if (m === "cold") hardCold++;
      else if (m === "pass1") hardPass1++;
    }
  });

  const drillAcc = AppState.drillStats.total > 0
    ? Math.round((AppState.drillStats.correct / AppState.drillStats.total) * 100)
    : 100;

  const achievements = [
    {
      id: "first_blood",
      name: "First Invariant",
      desc: "Proven Cold on at least 1 Blind 75 problem without hints.",
      unlocked: coldCount >= 1,
      progress: `${Math.min(coldCount, 1)}/1`
    },
    {
      id: "sliding_master",
      name: "Sliding Master",
      desc: "Conquered Days 6 & 7 sliding window monotonic invariants.",
      unlocked: (AppState.mastery[23] === "cold" && AppState.mastery[24] === "cold") || coldCount >= 8,
      progress: coldCount >= 8 ? "100%" : `${Math.round((coldCount / 8) * 100)}%`
    },
    {
      id: "tree_whisperer",
      name: "Tree Whisperer",
      desc: "Mastered recursion & level-order invariants (Days 14–16).",
      unlocked: coldCount >= 20,
      progress: `${Math.min(coldCount, 20)}/20`
    },
    {
      id: "graph_architect",
      name: "Graph Architect",
      desc: "Mastered topological sort, cycles, and BFS/DFS (Days 20–22).",
      unlocked: coldCount >= 35,
      progress: `${Math.min(coldCount, 35)}/35`
    },
    {
      id: "dp_alchemist",
      name: "DP Alchemist",
      desc: "Derived optimal substructure across 1D & 2D DP (Days 23–26).",
      unlocked: coldCount >= 50,
      progress: `${Math.min(coldCount, 50)}/50`
    },
    {
      id: "grandmaster_75",
      name: "Blind 75 Grandmaster",
      desc: "Achieved 100% Proven Cold mastery across all 75 questions.",
      unlocked: coldCount === 75,
      progress: `${coldCount}/75`
    }
  ];

  const heatmapNodesHtml = CURRICULUM_DATABASE.map(d => {
    const dayProblems = d.blind75Tasks || [];
    const allCold = dayProblems.length > 0 && dayProblems.every(p => AppState.mastery[p.id] === "cold");
    const allPass1 = dayProblems.length > 0 && dayProblems.every(p => AppState.mastery[p.id]);
    const isCurrent = d.day === AppState.currentDay;

    let nodeClass = "heatmap-day-node";
    if (allCold) nodeClass += " cold-done";
    else if (allPass1) nodeClass += " pass1-done";
    if (isCurrent) nodeClass += " is-current";

    const topicCode = d.category.split(" ")[0].slice(0, 4).toUpperCase();

    return `
      <div class="${nodeClass}" onclick="switchView('today'); switchDay(${d.day});" title="Day ${d.day}: ${d.title}">
        <span class="node-num">${String(d.day).padStart(2, "0")}</span>
        <span class="node-sub">${topicCode}</span>
      </div>
    `;
  }).join("");

  const achievementsHtml = achievements.map(ach => `
    <div class="achievement-card ${ach.unlocked ? "unlocked" : "locked"}">
      <div class="achievement-glyph">${ach.unlocked ? "✓" : "✦"}</div>
      <div class="achievement-meta">
        <div class="achievement-name">${ach.name}</div>
        <div class="achievement-desc">${ach.desc}</div>
        <span style="font-family:var(--font-mono); font-size:10px; color:${ach.unlocked ? "var(--status-cold)" : "var(--apple-text-muted)"}; margin-top:4px;">
          ${ach.unlocked ? "Unlocked" : `Progress: ${ach.progress}`}
        </span>
      </div>
    </div>
  `).join("");

  let journalRowsHtml = "";
  if (AppState.mistakeJournal && AppState.mistakeJournal.length > 0) {
    journalRowsHtml = `
      <div style="overflow-x:auto;">
        <table class="apple-table" style="width:100%;">
          <thead>
            <tr>
              <th style="width:110px;">Date</th>
              <th style="width:200px;">Problem</th>
              <th style="width:120px;">Outcome</th>
              <th>Mistake & Key Invariant Learned</th>
            </tr>
          </thead>
          <tbody>
            ${AppState.mistakeJournal.slice(-10).reverse().map(j => `
              <tr>
                <td style="font-family:var(--font-mono); font-size:12px; color:var(--apple-text-muted);">${j.date || "Recent"}</td>
                <td style="font-weight:600;">#${j.problemId} ${j.title || ""}</td>
                <td>
                  <span class="apple-diff-pill ${j.outcome === "Optimal Cold" ? "Easy" : (j.outcome === "Needed Hints" ? "Medium" : "Hard")}">
                    ${j.outcome || "Debrief"}
                  </span>
                </td>
                <td style="font-size:12.5px; color:var(--apple-text-secondary); line-height:1.4;">${j.note || "No note recorded."}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } else {
    journalRowsHtml = `
      <div style="padding:28px 20px; text-align:center; color:var(--apple-text-muted); font-size:13px; background:var(--apple-tile-1); border-radius:var(--rounded-md); border:1px dashed var(--apple-hairline);">
        No post-solve autopsies logged yet. Whenever you complete Step 3 of a problem, your reflections and lessons will populate this analytical ledger.
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Top Identity Hero Card -->
    <div class="profile-hero-card">
      <div class="profile-identity-group">
        <div class="profile-avatar-squircle" id="profileAvatarSquircle">${userInitial}</div>
        <div>
          <div class="profile-name-row">
            <span class="profile-user-name" id="profileUserNameText">${userName}</span>
            <button class="profile-edit-name-btn" onclick="editUserName()">Edit Name</button>
          </div>
          <div class="profile-rank-sub">Candidate Level • Blind 75 Master Class</div>
        </div>
      </div>
      <div class="profile-quick-stats">
        <div class="quick-stat-box">
          <span class="quick-stat-val">${AppState.streak || 1}d</span>
          <span class="quick-stat-lbl">Streak</span>
        </div>
        <div class="quick-stat-box">
          <span class="quick-stat-val" style="color:var(--status-cold);">${coldCount}</span>
          <span class="quick-stat-lbl">Cold Proofs</span>
        </div>
        <div class="quick-stat-box">
          <span class="quick-stat-val">${drillAcc}%</span>
          <span class="quick-stat-lbl">Drill Accuracy</span>
        </div>
      </div>
    </div>

    <!-- LeetCode-Grade Mastery Donut & Difficulty Tracks -->
    <div class="analytics-sections-grid">
      <div class="analytics-card-tile">
        <div class="analytics-card-title">
          <span>Problem Solving Progress</span>
          <span style="font-family:var(--font-mono); font-size:12px; color:var(--apple-text-secondary);">${totalSolved} / 75 Solved</span>
        </div>
        <div class="leetcode-donut-wrap">
          <div class="leetcode-donut-circle" style="--cold-deg:${coldDeg}deg; --pass1-deg:${pass1Deg}deg;">
            <div class="leetcode-donut-hole">
              <span class="donut-total-val">${totalSolved}</span>
              <span class="donut-total-lbl">/ 75 Solved</span>
            </div>
          </div>
          <div class="donut-stats-list">
            <div class="donut-stat-row">
              <span style="display:flex; align-items:center; gap:8px;">
                <span style="width:8px; height:8px; border-radius:50%; background:var(--status-cold);"></span>
                Proven Cold (Zero Hints)
              </span>
              <b style="font-family:var(--font-mono); color:var(--status-cold);">${coldCount}</b>
            </div>
            <div class="donut-stat-row">
              <span style="display:flex; align-items:center; gap:8px;">
                <span style="width:8px; height:8px; border-radius:50%; background:var(--apple-action-blue);"></span>
                First Pass / Guided
              </span>
              <b style="font-family:var(--font-mono); color:var(--apple-action-blue);">${pass1Count}</b>
            </div>
            <div class="donut-stat-row">
              <span style="display:flex; align-items:center; gap:8px;">
                <span style="width:8px; height:8px; border-radius:50%; background:var(--apple-text-muted);"></span>
                Unsolved / Remaining
              </span>
              <b style="font-family:var(--font-mono); color:var(--apple-text-muted);">${unsolvedCount}</b>
            </div>
          </div>
        </div>
      </div>

      <div class="analytics-card-tile">
        <div class="analytics-card-title">
          <span>Difficulty Distribution</span>
          <span style="font-family:var(--font-mono); font-size:12px; color:var(--apple-text-muted);">Blind 75 Ratio</span>
        </div>
        <div class="difficulty-bars-group">
          <div class="diff-bar-item">
            <div class="diff-bar-label-row">
              <span style="font-weight:600; color:var(--status-cold);">Easy</span>
              <span style="font-family:var(--font-mono);">${easyCold + easyPass1} / ${easyTotal}</span>
            </div>
            <div class="diff-progress-track">
              <div class="diff-fill-cold" style="width:${(easyCold / (easyTotal || 1)) * 100}%;"></div>
              <div class="diff-fill-pass1" style="width:${(easyPass1 / (easyTotal || 1)) * 100}%;"></div>
            </div>
          </div>

          <div class="diff-bar-item">
            <div class="diff-bar-label-row">
              <span style="font-weight:600; color:var(--status-warning);">Medium</span>
              <span style="font-family:var(--font-mono);">${medCold + medPass1} / ${medTotal}</span>
            </div>
            <div class="diff-progress-track">
              <div class="diff-fill-cold" style="width:${(medCold / (medTotal || 1)) * 100}%;"></div>
              <div class="diff-fill-pass1" style="width:${(medPass1 / (medTotal || 1)) * 100}%;"></div>
            </div>
          </div>

          <div class="diff-bar-item">
            <div class="diff-bar-label-row">
              <span style="font-weight:600; color:var(--status-danger);">Hard</span>
              <span style="font-family:var(--font-mono);">${hardCold + hardPass1} / ${hardTotal}</span>
            </div>
            <div class="diff-progress-track">
              <div class="diff-fill-cold" style="width:${(hardCold / (hardTotal || 1)) * 100}%;"></div>
              <div class="diff-fill-pass1" style="width:${(hardPass1 / (hardTotal || 1)) * 100}%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 30-Day Training Roadmap Heatmap -->
    <div class="analytics-card-tile" style="margin-top:20px;">
      <div class="analytics-card-title">
        <span>30-Day Curriculum Heatmap</span>
        <span style="font-size:12px; color:var(--apple-text-secondary); font-weight:normal;">Click any day to launch workspace</span>
      </div>
      <div class="heatmap-days-grid">
        ${heatmapNodesHtml}
      </div>
    </div>

    <!-- Achievements Badges Grid -->
    <div class="analytics-card-tile" style="margin-top:20px;">
      <div class="analytics-card-title">
        <span>Mastery Badges & Milestones</span>
        <span style="font-family:var(--font-mono); font-size:12px; color:var(--apple-text-secondary);">
          ${achievements.filter(a => a.unlocked).length} / ${achievements.length} Unlocked
        </span>
      </div>
      <div class="achievements-tiles-grid">
        ${achievementsHtml}
      </div>
    </div>

    <!-- Mistake Journal & Problem History Table -->
    <div class="analytics-card-tile" style="margin-top:20px;">
      <div class="analytics-card-title">
        <span>Post-Solve Autopsies & Mistake Journal</span>
        <span style="font-family:var(--font-mono); font-size:12px; color:var(--apple-text-secondary);">
          ${AppState.mistakeJournal ? AppState.mistakeJournal.length : 0} Entries
        </span>
      </div>
      ${journalRowsHtml}
    </div>
  `;
}

function showOnboardingModal() {
  const modal = document.getElementById("onboardingNameModal");
  if (!modal) return;
  modal.style.display = "flex";
  const inp = document.getElementById("onboardingNameInput");
  if (inp) {
    inp.value = AppState.userName || "";
    inp.focus();
  }
}

function closeOnboardingModal(e) {
  if (e && e.target && e.target.id !== "onboardingNameModal") return;
  const modal = document.getElementById("onboardingNameModal");
  if (modal) modal.style.display = "none";
}

function saveOnboardingName() {
  const inp = document.getElementById("onboardingNameInput");
  const name = inp ? inp.value.trim() : "";
  AppState.userName = name || "Engineer";
  persistState();
  const modal = document.getElementById("onboardingNameModal");
  if (modal) modal.style.display = "none";
  if (AppState.currentView === "profile") {
    renderProfileView();
  }
}

function editUserName() {
  const current = AppState.userName || "Engineer";
  const newName = prompt("Enter your name / handle:", current);
  if (newName !== null && newName.trim().length > 0) {
    AppState.userName = newName.trim();
    persistState();
    renderProfileView();
  }
}

function updateTopStats() {
  const coldCount = Object.values(AppState.mastery).filter(m => m === "cold").length;
  const pass1Count = Object.values(AppState.mastery).filter(m => m === "pass1").length;

  const coldEl = document.getElementById("legendColdCount");
  if (coldEl) coldEl.textContent = `${coldCount}/75`;

  const pass1El = document.getElementById("legendPass1Count");
  if (pass1El) pass1El.textContent = `${pass1Count}/75`;

  const pct = Math.round((coldCount / 75) * 100);
  const pctLabel = document.getElementById("masteryPctLabel");
  if (pctLabel) pctLabel.textContent = `${pct}%`;

  const coldBar = document.getElementById("masteryColdBar");
  if (coldBar) coldBar.style.width = `${(coldCount / 75) * 100}%`;

  const pass1Bar = document.getElementById("masteryPass1Bar");
  if (pass1Bar) pass1Bar.style.width = `${(pass1Count / 75) * 100}%`;

  const todayStr = new Date().toISOString().split("T")[0];
  let rematchesDue = 0;
  Object.values(AppState.autopsies).forEach(a => {
    if (a.nextReviewDate && a.nextReviewDate <= todayStr) rematchesDue++;
  });
  const rematchBadge = document.getElementById("rematchDueBadge");
  if (rematchBadge) {
    if (rematchesDue > 0) {
      rematchBadge.style.display = "inline-flex";
      rematchBadge.textContent = rematchesDue;
    } else {
      rematchBadge.style.display = "none";
    }
  }

  const streakEl = document.getElementById("streakCountVal");
  if (streakEl) streakEl.textContent = String(AppState.streak || 1);
}

function copyCleanBoilerplateTemplate() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay);
  if (!dayData || !dayData.starterCode || !navigator?.clipboard?.writeText) return;
  const snippet = dayData.starterCode.python || dayData.starterCode.cpp;
  navigator.clipboard.writeText(snippet).then(() => {
    alert("Clean interview boilerplate copied to clipboard.");
  });
}

// ============================================================================
// APPLE LOCALSTORAGE & DATA SHEET
// ============================================================================

function openStorageSheet() {
  const backdrop = document.getElementById("storageModalBackdrop");
  if (backdrop) backdrop.classList.add("open");
  updateStorageMetrics();
}

function closeStorageSheet() {
  const backdrop = document.getElementById("storageModalBackdrop");
  if (backdrop) backdrop.classList.remove("open");
}

function updateStorageMetrics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "";
    const bytes = new Blob([raw]).size;
    const kb = (bytes / 1024).toFixed(1);
    const el = document.getElementById("storageUsageVal");
    if (el) el.textContent = `${kb} KB`;
  } catch (e) {
    // Ignore
  }
}

function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(STORAGE_KEY) || "{}");
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `algomaster30_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      JSON.parse(content);
      localStorage.setItem(STORAGE_KEY, content);
      alert("Data imported successfully.");
      location.reload();
    } catch (err) {
      alert("Invalid JSON backup file.");
    }
  };
  reader.readAsText(file);
}

function forceReCacheApp() {
  if (typeof caches !== "undefined") {
    caches.delete("algomaster-apple-cache-v1").then(() => {
      alert("Application cache purged. Reloading fresh assets...");
      location.reload();
    });
  } else {
    location.reload();
  }
}

function clearAllProgress() {
  if (confirm("Reset all training progress, cold records, and mistake notes? This cannot be undone.")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// ============================================================================
// COMMAND PALETTE (⌘K) & SHORTCUTS
// ============================================================================

function openCommandPalette() {
  const backdrop = document.getElementById("commandPaletteBackdrop");
  if (backdrop) backdrop.classList.add("open");
  const input = document.getElementById("paletteSearchInput");
  if (input) {
    input.value = "";
    if (typeof input.focus === "function") input.focus();
  }
  renderPaletteResults("");
}

function closeCommandPalette() {
  const backdrop = document.getElementById("commandPaletteBackdrop");
  if (backdrop) backdrop.classList.remove("open");
}

function renderPaletteResults(keyword) {
  const container = document.getElementById("paletteResultsList");
  if (!container) return;
  container.innerHTML = "";

  const query = keyword.toLowerCase().trim();
  const matches = BLIND_75_DATABASE.filter(p => {
    return !query || p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
  }).slice(0, 8);

  matches.forEach(p => {
    const item = document.createElement("div");
    item.className = "palette-result-row";
    item.innerHTML = `
      <div>
        <b style="color:var(--apple-text-primary);">#${p.id} ${p.title}</b>
        <span style="font-size:11px; color:var(--apple-body-muted); margin-left:8px;">${p.category}</span>
      </div>
      <span class="apple-diff-pill ${p.difficulty}">${p.difficulty}</span>
    `;
    item.onclick = () => {
      closeCommandPalette();
      jumpToProblemFromRematch(p.dayMapped, p.id);
    };
    container.appendChild(item);
  });
}

function openShortcutsModal() {
  const m = document.getElementById("shortcutsModalBackdrop");
  if (m) m.classList.add("open");
}
function closeShortcutsModal() {
  const m = document.getElementById("shortcutsModalBackdrop");
  if (m) m.classList.remove("open");
}

function setupShortcuts() {
  window.addEventListener("keydown", (e) => {
    // Non-dismissible mobile gateway check: never allow shortcut dismissal
    const mobileGate = document.getElementById("mobileGatewayOverlay");
    if (mobileGate) {
      const isVisible = window.getComputedStyle ? window.getComputedStyle(mobileGate).display !== "none" : mobileGate.classList.contains("gateway-active");
      if (isVisible) {
        if (e.key === "Escape") e.preventDefault();
        return;
      }
    }

    if (e.key === "Escape") {
      closeCommandPalette();
      closeStorageSheet();
      closeShortcutsModal();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandPalette();
    }
    if ((e.key === "[" || e.key === "]") && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      toggleSidebar();
    }
    if (e.key === "," && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      switchDay(AppState.currentDay - 1);
    }
    if (e.key === "." && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      switchDay(AppState.currentDay + 1);
    }
    if (e.key === " " && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      if (AppState.currentSubTab === "learn") {
        e.preventDefault();
        VisualizerEngine.togglePlay();
      }
    }
  });

  const paletteInput = document.getElementById("paletteSearchInput");
  if (paletteInput) {
    paletteInput.addEventListener("input", (e) => {
      renderPaletteResults(e.target.value);
    });
  }

  const matrixSearch = document.getElementById("matrixSearchInput");
  if (matrixSearch) {
    matrixSearch.addEventListener("input", () => {
      renderMatrixView();
    });
  }
}

// ============================================================================
// MOBILE GATEWAY MEDIA PIPE (NON-DISMISSIBLE DESKTOP GATEWAY)
// ============================================================================

function initMobileGatewayPipe() {
  if (typeof window === "undefined" || !window.matchMedia) return;

  const mediaPipeQuery = window.matchMedia("(max-width: 768px) and (orientation: portrait), (max-width: 640px)");

  function updateGateMetrics() {
    const metricsEl = document.getElementById("mobileGateViewportMetrics");
    if (metricsEl) {
      metricsEl.textContent = `${window.innerWidth} × ${window.innerHeight} px`;
    }
  }

  function handleMediaPipeline(e) {
    const isMobile = e ? e.matches : mediaPipeQuery.matches;
    const overlay = document.getElementById("mobileGatewayOverlay");
    if (overlay) {
      if (isMobile) {
        overlay.classList.add("gateway-active");
        document.body.classList.add("mobile-locked");
      } else {
        overlay.classList.remove("gateway-active");
        document.body.classList.remove("mobile-locked");
      }
    }
    updateGateMetrics();
  }

  try {
    if (mediaPipeQuery.addEventListener) {
      mediaPipeQuery.addEventListener("change", handleMediaPipeline);
    } else if (mediaPipeQuery.addListener) {
      mediaPipeQuery.addListener(handleMediaPipeline);
    }
  } catch (err) {
    console.warn("mediaPipe listener fallback:", err);
  }

  window.addEventListener("resize", updateGateMetrics, { passive: true });
  window.addEventListener("orientationchange", updateGateMetrics, { passive: true });

  handleMediaPipeline(mediaPipeQuery);
  updateGateMetrics();
}

// ============================================================================
// APPLE THEME CONTROLLER (LIGHT & DARK DUAL MODE)
// ============================================================================

function initTheme() {
  const saved = localStorage.getItem("algomaster_theme");
  const prefersLight = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = saved || (prefersLight ? "light" : "dark");
  setTheme(theme);
}

function triggerCelestialThemeTransition(nextTheme) {
  const overlay = document.getElementById("themeTransitionOverlay");
  const body = document.getElementById("themeCelestialBody");
  if (!overlay || !body) return;

  overlay.className = "theme-transition-stage animating " + (nextTheme === "light" ? "to-light" : "to-dark");

  if (nextTheme === "light") {
    // Rising Sun: Monochromatic warm yellow SVG with radiant rays
    body.innerHTML = `
      <svg class="celestial-sun-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="26" fill="#ffcc00" filter="url(#sunGlowFilter)"/>
        <g stroke="#ffcc00" stroke-width="4.5" stroke-linecap="round">
          <line x1="50" y1="8" x2="50" y2="18"/>
          <line x1="50" y1="82" x2="50" y2="92"/>
          <line x1="8" y1="50" x2="18" y2="50"/>
          <line x1="82" y1="50" x2="92" y2="50"/>
          <line x1="20.3" y1="20.3" x2="27.4" y2="27.4"/>
          <line x1="72.6" y1="72.6" x2="79.7" y2="79.7"/>
          <line x1="20.3" y1="79.7" x2="27.4" y2="72.6"/>
          <line x1="72.6" y1="27.4" x2="79.7" y2="20.3"/>
        </g>
        <defs>
          <filter id="sunGlowFilter" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    `;
  } else {
    // Rising Moon: Monochromatic soft silver-white crescent moon
    body.innerHTML = `
      <svg class="celestial-moon-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M68 22 C52 28 42 43 44 60 C46 75 58 87 72 90 C50 98 24 88 16 66 C8 44 18 20 40 12 C50 8 60 14 68 22 Z" fill="#f5f7fa" filter="url(#moonGlowFilter)"/>
        <defs>
          <filter id="moonGlowFilter" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    `;
  }

  setTimeout(() => {
    overlay.className = "theme-transition-stage";
    body.innerHTML = "";
  }, 1250);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  triggerCelestialThemeTransition(next);
  setTheme(next);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("algomaster_theme", theme);
  const pill = document.getElementById("appleThemePill");
  if (pill) {
    if (theme === "light") {
      pill.classList.remove("is-dark");
      pill.classList.add("is-light");
    } else {
      pill.classList.remove("is-light");
      pill.classList.add("is-dark");
    }
  }
  const lbl = document.getElementById("themeToggleLabel");
  if (lbl) {
    lbl.textContent = theme === "dark" ? "Dark" : "Light";
  }
}

// ============================================================================
// BOOT LIFECYCLE
// ============================================================================

function bootApp() {
  try {
    initTheme();
    loadSavedState();
    registerServiceWorker();
    setupShortcuts();
    initMobileGatewayPipe();

    // Setup first-time onboarding modal listener
    const onboardingInp = document.getElementById("onboardingNameInput");
    if (onboardingInp) {
      onboardingInp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveOnboardingName();
      });
      onboardingInp.addEventListener("input", (e) => {
        const preview = document.getElementById("onboardingAvatarPreview");
        if (preview) {
          const val = e.target.value.trim();
          preview.textContent = (val ? val.charAt(0) : "U").toUpperCase();
        }
      });
    }

    if (!AppState.userName || AppState.userName.trim() === "") {
      setTimeout(() => {
        showOnboardingModal();
      }, 400);
    }

    // Restore sidebar state
    if (AppState.sidebarCollapsed) {
      const workstation = document.getElementById("viewGrind");
      if (workstation) workstation.classList.add("sidebar-collapsed");
      const btn = document.getElementById("btnToggleSidebar");
      if (btn) {
        btn.classList.add("is-collapsed");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("title", "Expand Roadmap Sidebar (Shortcut: [ )");
      }
    }

    switchView(AppState.currentView || "today");
    switchDay(AppState.currentDay || 1);
    updateTopStats();
  } catch (err) {
    console.error("Critical error during bootApp:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}
