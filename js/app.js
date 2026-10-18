// ============================================================================
// ALGOMASTER 30 — APPLE DESIGN SPECIFICATION CONTROLLER
// Strict Apple DESIGN.md • Zero Emojis • Offline-First Native LocalStorage
// ============================================================================

const STORAGE_KEY = "algomaster30_apple_system_v4";

// Application State
const AppState = {
  currentDay: 1,
  currentView: "today", // 'today' | 'rematch' | 'drill' | 'matrix'
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
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
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

    // Parse array items from inputDescription
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

    const pill = document.createElement("button");
    pill.className = `practice-pill-btn ${idx === AppState.activeProblemIndex ? "active" : ""} ${masteryState === "cold" ? "cold-mastered" : ""}`;
    pill.onclick = () => selectDailyProblem(idx);

    let statusIndicator = `<span style="width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.2);"></span>`;
    if (masteryState === "cold") {
      statusIndicator = `<span style="width:6px; height:6px; border-radius:50%; background:var(--status-cold);"></span>`;
    } else if (masteryState === "pass1") {
      statusIndicator = `<span style="width:6px; height:6px; border-radius:50%; background:var(--apple-action-dark);"></span>`;
    }

    pill.innerHTML = `
      ${statusIndicator}
      <span>#${p.id}: ${p.title}</span>
      <span class="apple-diff-pill ${p.difficulty}">${p.difficulty}</span>
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
      <span style="width:6px; height:6px; border-radius:50%; background:#ffffff;"></span>
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
      <span>${dayData.phase.split(":")[0]}</span>
      <span>/</span>
      <span class="nav-breadcrumb-active">Day ${String(dayData.day).padStart(2, "0")}: ${dayData.category}</span>
    `;
  }

  const headingEl = document.getElementById("dayHeading");
  if (headingEl) {
    headingEl.textContent = `Day ${String(dayData.day).padStart(2, "0")}. ${dayData.category}`;
  }

  const subEl = document.getElementById("dayCategorySub");
  if (subEl) {
    subEl.textContent = `${dayData.phase} — ${dayData.objective}`;
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

  const linkNeet = document.getElementById("linkNeetcode");
  if (linkNeet && dayData.verifiedLinks && dayData.verifiedLinks.neetcode) {
    linkNeet.href = dayData.verifiedLinks.neetcode;
  }
  const linkUsaco = document.getElementById("linkUsaco");
  if (linkUsaco && dayData.verifiedLinks && dayData.verifiedLinks.usaco) {
    linkUsaco.href = dayData.verifiedLinks.usaco;
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
      let statusClass = "";
      if (completedTasks.length === tasks.length && tasks.length > 0) {
        statusClass = "complete";
      } else if (completedTasks.length > 0) {
        statusClass = "partial";
      }

      row.innerHTML = `
        <div class="day-item-left">
          <span class="day-index-label">${String(d.day).padStart(2, "0")}</span>
          <span>${d.category}</span>
        </div>
        <span class="day-status-indicator ${statusClass}"></span>
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

    let badgeHtml = '<span class="apple-diff-pill" style="background:rgba(255,255,255,0.08); color:var(--apple-body-muted);">Unsolved</span>';
    if (masteryState === "cold") {
      badgeHtml = '<span class="apple-diff-pill Easy">Cold Mastered</span>';
    } else if (masteryState === "pass1") {
      badgeHtml = '<span class="apple-diff-pill" style="background:var(--apple-action-subtle); color:var(--apple-action-dark);">First Pass</span>';
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:600;">#${p.id}</td>
      <td>
        <a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" style="color:#ffffff; text-decoration:none;">
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
  const btnMap = { today: "viewBtnToday", rematch: "viewBtnRematch", drill: "viewBtnDrill", matrix: "viewBtnMatrix" };
  const activeBtn = document.getElementById(btnMap[viewName]);
  if (activeBtn) activeBtn.classList.add("active");

  const vGrind = document.getElementById("viewGrind");
  const vRematch = document.getElementById("viewRematch");
  const vDrill = document.getElementById("viewDrill");
  const vMatrix = document.getElementById("viewMatrix");

  if (viewName === "today") {
    if (vGrind) vGrind.style.display = "grid";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
  } else if (viewName === "rematch") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.add("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
    renderRematchQueueView();
  } else if (viewName === "drill") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.add("active-view");
    if (vMatrix) vMatrix.classList.remove("active-view");
    initPatternDrill();
  } else if (viewName === "matrix") {
    if (vGrind) vGrind.style.display = "none";
    if (vRematch) vRematch.classList.remove("active-view");
    if (vDrill) vDrill.classList.remove("active-view");
    if (vMatrix) vMatrix.classList.add("active-view");
    renderMatrixView();
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
        <b style="color:#ffffff;">#${p.id} ${p.title}</b>
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
// BOOT LIFECYCLE
// ============================================================================

function bootApp() {
  try {
    loadSavedState();
    registerServiceWorker();
    setupShortcuts();
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
