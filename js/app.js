// ============================================================================
// ALGOMASTER 30 — FOCUSED FLOW WORKSPACE & 100% BLIND 75 CONFIDENCE CONTROLLER
// Progressive Disclosure • 2-Pass Cold Mastery • Blind Pattern Drill
// ============================================================================

const STORAGE_KEY = "algomaster30_master_state_v3";

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
  // 'cold' = Pass 2: Proven Cold (100% ready, solved with zero hints)
  // 'pass1' = Pass 1: Solved on topic day or needed nudges / editorial
  mastery: {},

  timers: {},      // { [problemId]: { p1: sec, p2: sec, total: sec, best: sec } }
  blueprints: {},  // { [problemId]: { timeCommit, spaceCommit } }
  autopsies: {},   // { [problemId]: { outcome, note, nextReviewDate, reviewCount } }
  mistakeJournal: [], // [ { problemId, title, note, outcome, date } ]
  drillStats: { total: 0, correct: 0 },
  streak: 1
};

// ============================================================================
// STATE PERSISTENCE & LOCAL STORAGE
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
    console.warn("Could not load saved state:", err);
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
    console.warn("Could not persist state:", err);
  }
}

// ============================================================================
// 15-MINUTE PAPER STRUGGLE & PORTAL STOPWATCH ENGINE
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
    if (btn) btn.textContent = "⏸ Pause";
  },

  pausePhase1() {
    if (this.intervalId) {
      if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
      else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
    }
    this.intervalId = null;
    const btn = document.getElementById("btnWizardPaperTimerStart");
    if (btn) btn.textContent = "▶ Resume";
  },

  togglePhase1() {
    if (this.intervalId) {
      this.pausePhase1();
    } else {
      this.startPhase1();
    }
  },

  switchToPhase2() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.activePhase = 2;
    this.startTicker();
    const statusEl = document.getElementById("wizardStopwatchStatus");
    if (statusEl) statusEl.textContent = "Tracking coding time on portal...";
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
    if (btn) btn.textContent = "▶ Start 15m Paper Timer";
  }
};

// ============================================================================
// VISUALIZER ENGINE (INTERACTIVE DRY-RUN STATE STEPPER)
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

    // Parse array items from inputDescription if present
    const arrayMatch = trace.inputDescription ? trace.inputDescription.match(/\[(.*?)\]/) : null;
    if (arrayMatch) {
      const rawItems = arrayMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      if (rawItems.length > 0 && rawItems[0] !== "") {
        const arrayContainer = document.createElement("div");
        arrayContainer.className = "vis-array-container";

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
          cellWrapper.className = "vis-cell-wrapper";

          // Pointer marker above cell
          const pointerMarker = document.createElement("div");
          let pointerText = "";
          let pointerClass = "vis-pointer-marker";

          if (leftIdx === idx && rightIdx === idx) {
            pointerText = "▲ L,R";
            pointerClass += " active left";
          } else if (leftIdx === idx) {
            pointerText = "▲ L";
            pointerClass += " active left";
          } else if (rightIdx === idx) {
            pointerText = "▲ R";
            pointerClass += " active right";
          } else if (activeIndices.includes(idx)) {
            const key = Object.keys(step.indices || {}).find(k => step.indices[k] === idx) || "i";
            pointerText = `▲ ${key}`;
            pointerClass += " active";
          }

          pointerMarker.className = pointerClass;
          pointerMarker.textContent = pointerText;
          cellWrapper.appendChild(pointerMarker);

          // Value box
          const cellBox = document.createElement("div");
          let boxClass = "vis-cell-box";
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
          indexLabel.className = "vis-cell-index";
          indexLabel.textContent = `[${idx}]`;
          cellWrapper.appendChild(indexLabel);

          arrayContainer.appendChild(cellWrapper);
        });

        stage.appendChild(arrayContainer);
      }
    }

    // Render Data Badges & Snapshots Row
    const dataRow = document.createElement("div");
    dataRow.className = "visualizer-data-row";

    if (step.action) {
      const isMatch = step.action.includes("Match") || (step.invariantStatus && step.invariantStatus.includes("Target Met"));
      const actionPill = document.createElement("div");
      actionPill.className = `action-pill ${isMatch ? "match" : ""}`;
      actionPill.innerHTML = `<span>⚡</span> <span>${step.action}</span>`;
      dataRow.appendChild(actionPill);
    }

    if (step.indices) {
      Object.entries(step.indices).forEach(([k, v]) => {
        const b = document.createElement("div");
        b.className = "state-badge";
        b.innerHTML = `${k}: <b>${v}</b>`;
        dataRow.appendChild(b);
      });
    }

    if (step.currentVal !== undefined) {
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `val: <b>${step.currentVal}</b>`;
      dataRow.appendChild(b);
    }

    if (step.complement !== undefined) {
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `need: <b>${step.complement}</b>`;
      dataRow.appendChild(b);
    }

    if (step.currentArea !== undefined) {
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `area: <b>${step.currentArea}</b>`;
      dataRow.appendChild(b);
    }

    if (step.pointers) {
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `ptrs: <b>${step.pointers}</b>`;
      dataRow.appendChild(b);
    }

    if (step.stackVals) {
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `stack: <b>${step.stackVals}</b>`;
      dataRow.appendChild(b);
    }

    if (step.hashTable) {
      const entries = Object.entries(step.hashTable).map(([k, v]) => `${k}➔[${v}]`).join(", ") || "∅";
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `map: <b>{${entries}}</b>`;
      dataRow.appendChild(b);
    }

    if (step.hashSet) {
      const b = document.createElement("div");
      b.className = "state-badge";
      b.innerHTML = `set: <b>{${step.hashSet.join(", ")}}</b>`;
      dataRow.appendChild(b);
    }

    stage.appendChild(dataRow);

    // Update Banner
    const explEl = document.getElementById("visExplanation");
    if (explEl) explEl.textContent = `Step ${this.currentStepIndex + 1}/${trace.steps.length}: ${step.explanation}`;

    const statusTag = document.getElementById("visStatusTag");
    if (statusTag) {
      statusTag.textContent = step.invariantStatus;
      if (step.invariantStatus.includes("Violat") || step.invariantStatus.includes("Dead")) {
        statusTag.className = "vis-status-tag violated";
      } else {
        statusTag.className = "vis-status-tag";
      }
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
    if (btn) btn.textContent = "⏸ Pause";
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
    if (btn) btn.textContent = "▶ Play";
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  toggleSpeed() {
    this.speed = this.speed === 1 ? 2 : 1;
    const btn = document.getElementById("btnVisSpeed");
    if (btn) btn.textContent = `${this.speed}x`;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }
};

// ============================================================================
// GUIDED PROBLEM WIZARD (ACCORDION STEPS 1 -> 2 -> 3)
// ============================================================================

function setProblemStep(stepNum) {
  AppState.activeProblemStep = stepNum;

  const card1 = document.getElementById("step1PaperCard");
  const body1 = document.getElementById("step1Body");
  const status1 = document.getElementById("step1Status");

  const card2 = document.getElementById("step2PortalCard");
  const body2 = document.getElementById("step2Body");
  const status2 = document.getElementById("step2Status");

  const card3 = document.getElementById("step3DebriefCard");
  const body3 = document.getElementById("step3Body");
  const status3 = document.getElementById("step3Status");

  // Step 1
  if (stepNum === 1) {
    if (card1) { card1.className = "accordion-step-card active-step"; }
    if (body1) { body1.style.display = "flex"; }
    if (status1) { status1.textContent = "Active"; }

    if (card2) { card2.className = "accordion-step-card"; }
    if (body2) { body2.style.display = "none"; }
    if (status2) { status2.textContent = "Pending"; }

    if (card3) { card3.className = "accordion-step-card"; }
    if (body3) { body3.style.display = "none"; }
    if (status3) { status3.textContent = "Pending"; }
  }
  // Step 2
  else if (stepNum === 2) {
    if (card1) { card1.className = "accordion-step-card completed-step"; }
    if (body1) { body1.style.display = "none"; }
    if (status1) { status1.textContent = "✓ Completed"; }

    if (card2) { card2.className = "accordion-step-card active-step"; }
    if (body2) { body2.style.display = "flex"; }
    if (status2) { status2.textContent = "Active"; }

    if (card3) { card3.className = "accordion-step-card"; }
    if (body3) { body3.style.display = "none"; }
    if (status3) { status3.textContent = "Pending"; }
  }
  // Step 3
  else if (stepNum === 3) {
    if (card1) { card1.className = "accordion-step-card completed-step"; }
    if (body1) { body1.style.display = "none"; }
    if (status1) { status1.textContent = "✓ Completed"; }

    if (card2) { card2.className = "accordion-step-card completed-step"; }
    if (body2) { body2.style.display = "none"; }
    if (status2) { status2.textContent = "✓ Solved"; }

    if (card3) { card3.className = "accordion-step-card active-step"; }
    if (body3) { body3.style.display = "flex"; }
    if (status3) { status3.textContent = "Active"; }
  }
}

function toggleProblemAccordionStep(stepNum) {
  setProblemStep(stepNum);
}

function advanceToStep2() {
  const problem = BLIND_75_DATABASE.find(p => p.id === AppState.activeProblemId);
  if (problem && problem.leetcodeUrl && typeof window !== "undefined") {
    window.open(problem.leetcodeUrl, "_blank");
  }
  setProblemStep(2);
  TimerEngine.switchToPhase2();
}

function handleLaunchPortalFromStep1() {
  advanceToStep2();
}

function advanceToStep3() {
  TimerEngine.stopPhase2();
  setProblemStep(3);

  const autopsy = AppState.autopsies[AppState.activeProblemId];
  if (autopsy) {
    loadSavedDebrief(autopsy);
  }
}

function toggleWizardSanityAnswer() {
  const el = document.getElementById("wizardSanityAnswer");
  if (!el) return;
  el.style.display = (el.style.display === "none" || !el.style.display) ? "block" : "none";
}

function selectWizardOutcome(btn) {
  document.querySelectorAll("#wizardOutcomeGrid .outcome-card-btn").forEach(b => b.classList.remove("selected"));
  if (btn && btn.classList) btn.classList.add("selected");
  const outcome = btn?.dataset?.outcome || "cold";

  const reactionBox = document.getElementById("wizardCoachReaction");
  if (reactionBox && typeof COACH_DATA !== "undefined" && COACH_DATA.reactions && COACH_DATA.reactions[outcome]) {
    reactionBox.style.display = "block";
    reactionBox.textContent = `Coach: "${COACH_DATA.reactions[outcome]}"`;
  }

  const days = outcome === "cold" ? 14 : outcome === "buggy" ? 5 : outcome === "hints" ? 3 : 1;
  const rematchEl = document.getElementById("wizardRematchNotice");
  if (rematchEl) {
    rematchEl.textContent = outcome === "cold"
      ? "✓ 100% Proven Cold Unlocked! (+14d cold verification)"
      : `Scheduled for Rematch in +${days} days (${outcome === 'editorial' ? 'Mandatory Tomorrow' : 'Active Recall'})`;
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

  const selectedBtn = document.querySelector("#wizardOutcomeGrid .outcome-card-btn.selected");
  const outcome = selectedBtn?.dataset?.outcome || "cold";
  const noteEl = document.getElementById("wizardNoteInput");
  const note = noteEl ? noteEl.value.trim() : "";
  const nextReviewDate = calculateNextReviewDate(outcome);

  // 2-Pass Mastery Update:
  // 'cold' grants Pass 2: Proven Cold!
  // Any other outcome grants Pass 1: Solved (scheduled for rematch)
  if (outcome === "cold") {
    AppState.mastery[problemId] = "cold";
  } else {
    if (AppState.mastery[problemId] !== "cold") {
      AppState.mastery[problemId] = "pass1";
    }
  }

  // Save Autopsy
  const prev = AppState.autopsies[problemId] || {};
  AppState.autopsies[problemId] = {
    outcome,
    note,
    nextReviewDate,
    reviewCount: (prev.reviewCount || 0) + 1
  };

  // Add to Mistake Journal
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
    naiveTrap: "A brute-force approach compares all pairs in O(N²), which wastes time re-scanning seen elements.",
    keyInsight: "Instead, as we scan once, we maintain a hash map for immediate O(1) complement lookups.",
    complexityGuarantee: "This guarantees O(N) time and O(N) space, avoiding redundant checks."
  };

  const trapEl = document.getElementById("pitchNaiveTrap");
  if (trapEl) trapEl.textContent = pitch.naiveTrap;

  const insightEl = document.getElementById("pitchKeyInsight");
  if (insightEl) insightEl.textContent = pitch.keyInsight;

  const compEl = document.getElementById("pitchComplexity");
  if (compEl) compEl.textContent = pitch.complexityGuarantee;

  pitchCard.style.display = "flex";
  if (typeof pitchCard.scrollIntoView === "function") {
    pitchCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function loadSavedDebrief(autopsy) {
  document.querySelectorAll("#wizardOutcomeGrid .outcome-card-btn").forEach(b => {
    if (b.dataset.outcome === autopsy.outcome) {
      b.classList.add("selected");
    } else {
      b.classList.remove("selected");
    }
  });

  const noteEl = document.getElementById("wizardNoteInput");
  if (noteEl && autopsy.note) noteEl.value = autopsy.note;

  const problem = BLIND_75_DATABASE.find(p => p.id === AppState.activeProblemId);
  if (problem) unlockInterviewPitchCard(problem);
}

function copyInterviewPitch() {
  const trap = document.getElementById("pitchNaiveTrap")?.textContent || "";
  const insight = document.getElementById("pitchKeyInsight")?.textContent || "";
  const comp = document.getElementById("pitchComplexity")?.textContent || "";

  const pitchText = `30-Second Interview Explanation:\n1. The Naive Trap: ${trap}\n2. The Key Insight: ${insight}\n3. The Complexity Guarantee: ${comp}`;

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(pitchText).then(() => {
      alert("✓ 30-Second Interview Pitch copied to clipboard! Practice speaking it out loud.");
    });
  }
}

function advanceToNextDailyProblem() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay) || CURRICULUM_DATABASE[0];
  const tasks = dayData.blind75Tasks || [];
  if (AppState.activeProblemIndex < tasks.length - 1) {
    selectDailyProblem(AppState.activeProblemIndex + 1);
  } else {
    alert("🎉 Outstanding work! You have completed today's problems. Drill patterns or review your Rematch Queue.");
    switchDaySubTab("learn");
  }
}

// ============================================================================
// DAILY WORKOUT NAVIGATION (TAB 1 VS TAB 2 & PILLS)
// ============================================================================

function switchDaySubTab(tab) {
  AppState.currentSubTab = tab;
  persistState();

  const tabBtnLearn = document.getElementById("tabBtnLearn");
  const tabBtnSolve = document.getElementById("tabBtnSolve");
  const subTabLearn = document.getElementById("subTabLearn");
  const subTabSolve = document.getElementById("subTabSolve");

  if (tab === "learn") {
    if (tabBtnLearn) tabBtnLearn.classList.add("active");
    if (tabBtnSolve) tabBtnSolve.classList.remove("active");
    if (subTabLearn) subTabLearn.classList.add("active");
    if (subTabSolve) subTabSolve.classList.remove("active");
  } else {
    if (tabBtnLearn) tabBtnLearn.classList.remove("active");
    if (tabBtnSolve) tabBtnSolve.classList.add("active");
    if (subTabLearn) subTabLearn.classList.remove("active");
    if (subTabSolve) subTabSolve.classList.add("active");
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
    const statusIcon = masteryState === "cold" ? "🟢" : masteryState === "pass1" ? "🟡" : "⚪";

    const pill = document.createElement("button");
    pill.className = `prob-pill-btn ${idx === AppState.activeProblemIndex ? "active" : ""}`;
    pill.onclick = () => selectDailyProblem(idx);
    pill.innerHTML = `
      <span>${statusIcon}</span>
      <span>#${p.id}: ${p.title}</span>
      <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
    `;
    container.appendChild(pill);
  });

  // Daily Boss Fight Pill
  if (dayData.extremeProblem) {
    const ext = dayData.extremeProblem;
    const bossPill = document.createElement("button");
    bossPill.className = `prob-pill-btn ${AppState.activeProblemIndex === tasks.length ? "active" : ""}`;
    bossPill.onclick = () => selectDailyBossFight(dayData.extremeProblem);
    bossPill.innerHTML = `
      <span>⚔️</span>
      <span>Boss: ${ext.title}</span>
      <span class="diff-badge Hard">Hard</span>
    `;
    container.appendChild(bossPill);
  }

  const solveBadge = document.getElementById("tabSolveCountBadge");
  if (solveBadge) {
    solveBadge.textContent = `${tasks.length} Problems`;
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
  document.querySelectorAll("#dailyProblemPills .prob-pill-btn").forEach((el, i) => {
    if (i === index) el.classList.add("active");
    else el.classList.remove("active");
  });

  // Populate Step 1
  const titleEl = document.getElementById("wizardProblemTitle");
  if (titleEl) titleEl.textContent = `#${problem.id}: ${problem.title}`;

  const diffBadge = document.getElementById("wizardProblemDiff");
  if (diffBadge) {
    diffBadge.textContent = problem.difficulty;
    diffBadge.className = `diff-badge ${problem.difficulty}`;
  }

  const directLink = document.getElementById("btnSolvePortalDirect");
  if (directLink) directLink.href = problem.leetcodeUrl;

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
    aEl.innerHTML = `<b>Coach's Check:</b> ${sanity.coachCheck}`;
  }

  // Nudges
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
  if (titleEl) titleEl.textContent = `⚔️ Boss Fight: ${boss.title}`;

  const diffBadge = document.getElementById("wizardProblemDiff");
  if (diffBadge) {
    diffBadge.textContent = "Boss";
    diffBadge.className = "diff-badge Hard";
  }

  const directLink = document.getElementById("btnSolvePortalDirect");
  if (directLink) directLink.href = boss.url;

  const mainPortalLink = document.getElementById("btnSolvePortalMain");
  if (mainPortalLink) mainPortalLink.href = boss.url;

  const qEl = document.getElementById("wizardSanityQuestion");
  if (qEl) qEl.textContent = `Boss Challenge: ${boss.whyThisBenchmark}`;

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
      <span class="breadcrumb-active">Day ${String(dayData.day).padStart(2, "0")} · ${dayData.category}</span>
    `;
  }

  const titleEl = document.getElementById("canvasDayTitle");
  if (titleEl) titleEl.textContent = `Day ${String(dayData.day).padStart(2, "0")}: ${dayData.title}`;

  const subEl = document.getElementById("canvasDaySubtitle");
  if (subEl) subEl.textContent = dayData.subtitle;

  const indEl = document.getElementById("canvasDayIndicator");
  if (indEl) indEl.textContent = `${String(dayData.day).padStart(2, "0")}/30`;

  const briefingText = (typeof COACH_DATA !== "undefined" && COACH_DATA.briefings && COACH_DATA.briefings[dayNumber]) ||
    "Master today's pattern with honest focus. Struggle on paper before looking at code.";
  const briefEl = document.getElementById("coachDailyBriefingText");
  if (briefEl) briefEl.textContent = briefingText;

  const invEl = document.getElementById("canvasInvariantText");
  if (invEl) invEl.textContent = dayData.invariant;

  const proofEl = document.getElementById("canvasProofText");
  if (proofEl) proofEl.textContent = dayData.amortizedProof;

  const trapsContainer = document.getElementById("canvasTrapsList");
  if (trapsContainer) {
    trapsContainer.innerHTML = "";
    (dayData.traps || []).forEach(t => {
      const item = document.createElement("div");
      item.className = "trap-item";
      item.innerHTML = `<span class="trap-icon">⚠</span> <div>${t}</div>`;
      trapsContainer.appendChild(item);
    });
  }

  const refContainer = document.getElementById("canvasReferencesList");
  if (refContainer) {
    refContainer.innerHTML = "";
    (dayData.authoritativeResources || []).forEach(r => {
      const link = document.createElement("a");
      link.className = "ref-link-badge";
      link.href = r.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span>📖</span> <b>${r.source}:</b> ${r.title}`;
      refContainer.appendChild(link);
    });
  }

  VisualizerEngine.init();
  renderDailyProblemPills(dayNumber);
  renderRoadmap();
  updateTopStats();

  switchDaySubTab(AppState.currentSubTab || "learn");
}

function renderRoadmap() {
  const container = document.getElementById("roadmapList");
  if (!container) return;
  container.innerHTML = "";

  let lastPhase = "";

  CURRICULUM_DATABASE.forEach(dayData => {
    if (dayData.phase !== lastPhase) {
      lastPhase = dayData.phase;
      const sep = document.createElement("div");
      sep.className = "phase-separator";
      sep.textContent = dayData.phase.split(":")[0];
      container.appendChild(sep);
    }

    const tasks = dayData.blind75Tasks || [];
    const coldCount = tasks.filter(t => AppState.mastery[t.id] === "cold").length;
    const pass1Count = tasks.filter(t => AppState.mastery[t.id] === "pass1").length;

    const row = document.createElement("button");
    row.className = `day-row-btn ${dayData.day === AppState.currentDay ? "active" : ""}`;
    row.onclick = () => switchDay(dayData.day);

    row.innerHTML = `
      <div class="day-row-left">
        <span class="day-row-num">D${String(dayData.day).padStart(2, "0")}</span>
        <span class="day-row-title">${dayData.category}</span>
      </div>
      <div class="day-row-status-dots">
        ${coldCount > 0 ? `<span class="status-mini-dot cold" title="${coldCount} Proven Cold"></span>` : ""}
        ${pass1Count > 0 ? `<span class="status-mini-dot pass1" title="${pass1Count} First Pass"></span>` : ""}
      </div>
    `;
    container.appendChild(row);
  });
}

function toggleSidebar() {
  AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
  const container = document.getElementById("viewGrind");
  if (container) {
    if (AppState.sidebarCollapsed) container.classList.add("sidebar-collapsed");
    else container.classList.remove("sidebar-collapsed");
  }
}

// ============================================================================
// 60-SECOND BLIND PATTERN RECOGNITION DRILL ENGINE
// ============================================================================

const DRILL_PATTERNS = [
  "Hash Map / Set",
  "Two Pointers",
  "Sliding Window",
  "Monotonic Stack",
  "Binary Search",
  "Linked List / Fast & Slow",
  "Tree DFS / Recursion",
  "Tree BFS / Level Order",
  "Trie (Prefix Tree)",
  "Heap / Priority Queue",
  "Graph BFS / DFS",
  "Graph Topo Sort",
  "1D Dynamic Programming",
  "2D Dynamic Programming",
  "Greedy / Intervals",
  "Bit Manipulation"
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
    btn.className = "pattern-chip-btn";
    btn.textContent = pat;
    btn.onclick = () => {
      document.querySelectorAll("#drillPatternChips .pattern-chip-btn").forEach(b => b.classList.remove("selected"));
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

  document.querySelectorAll("#drillPatternChips .pattern-chip-btn").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll("#drillComplexityChips .complexity-chip-btn").forEach(b => b.classList.remove("selected"));

  const feedbackCard = document.getElementById("drillFeedbackCard");
  if (feedbackCard) feedbackCard.style.display = "none";

  const randIdx = Math.floor(Math.random() * BLIND_75_DATABASE.length);
  activeDrillProblem = BLIND_75_DATABASE[randIdx];

  const titleEl = document.getElementById("drillProblemTitle");
  if (titleEl) titleEl.textContent = `#${activeDrillProblem.id}: ${activeDrillProblem.title}`;

  const diffEl = document.getElementById("drillProblemDiff");
  if (diffEl) {
    diffEl.textContent = activeDrillProblem.difficulty;
    diffEl.className = `diff-badge ${activeDrillProblem.difficulty}`;
  }

  const promptEl = document.getElementById("drillProblemPrompt");
  if (promptEl) {
    promptEl.textContent = `Problem Premise / Invariant: ${activeDrillProblem.keyInvariant}`;
  }
}

function selectDrillComplexity(btn) {
  document.querySelectorAll("#drillComplexityChips .complexity-chip-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedDrillComplexity = btn.dataset.complexity;
}

function checkPatternDrill() {
  if (!activeDrillProblem) return;
  if (!selectedDrillPattern) {
    alert("Please select a pattern/data structure chip first!");
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
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--accent-success);">✓ Spot-on! Optimal Pattern: ${correctPattern}</span>`;
  } else {
    if (feedbackCard) feedbackCard.className = "drill-feedback-card incorrect";
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--accent-danger);">✕ Not quite. True Pattern: ${correctPattern}</span> (You selected: ${selectedDrillPattern})`;
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
// REMATCH QUEUE (SPACED REPETITION) & ALL MATRIX
// ============================================================================

function renderRematchQueueView() {
  const todayStr = new Date().toISOString().split("T")[0];
  const dueList = document.getElementById("srsDueProblemsList");
  if (!dueList) return;
  dueList.innerHTML = "";

  const journalList = document.getElementById("mistakeJournalList");
  if (journalList) journalList.innerHTML = "";

  let dueCount = 0;

  BLIND_75_DATABASE.forEach(p => {
    const autopsy = AppState.autopsies[p.id];
    if (autopsy && autopsy.nextReviewDate && autopsy.nextReviewDate <= todayStr) {
      dueCount++;
      const item = document.createElement("div");
      item.className = "rematch-card-row";
      item.innerHTML = `
        <div class="rematch-card-info">
          <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
          <div>
            <div class="rematch-card-title">#${p.id}: ${p.title}</div>
            <div class="rematch-card-meta">Scheduled for review: ${autopsy.nextReviewDate}</div>
            ${autopsy.note ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:3px;">"${autopsy.note}"</div>` : ""}
          </div>
        </div>
        <button class="btn-timer primary" onclick="jumpToProblemFromRematch(${p.dayMapped}, ${p.id})">
          Fight Rematch ⚔️
        </button>
      `;
      dueList.appendChild(item);
    }
  });

  if (dueCount === 0) {
    dueList.innerHTML = `<div style="font-size:12.5px; color:var(--text-muted); padding:12px; background:var(--bg-card); border-radius:var(--radius-sm);">✓ No rematches due today! You are caught up. Keep solving cold on today's workout.</div>`;
  }

  const dueCounter = document.getElementById("srsTotalDueToday");
  if (dueCounter) dueCounter.textContent = dueCount;

  if (journalList) {
    if (AppState.mistakeJournal.length === 0) {
      journalList.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:10px;">No mistake notes logged yet. Log your honest debrief in Step 3 after solving a problem!</div>`;
    } else {
      AppState.mistakeJournal.slice(0, 30).forEach(entry => {
        const card = document.createElement("div");
        card.className = "bento-card";
        card.style.padding = "10px 14px";
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b style="color:#fff; font-size:12px;">${entry.title}</b>
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">${entry.date}</span>
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">"${entry.note}"</div>
        `;
        journalList.appendChild(card);
      });
    }
  }
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

// All 75 Matrix View
let currentMatrixFilter = "all";

function renderMatrixView() {
  const tbody = document.getElementById("matrixTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchKeyword = (document.getElementById("matrixSearchInput")?.value || "").toLowerCase().trim();

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
    const autopsy = AppState.autopsies[p.id] || {};

    let badgeHtml = '<span class="status-badge-unsolved">⚪ Unsolved</span>';
    if (masteryState === "cold") {
      badgeHtml = '<span class="status-badge-pass2">🟢 Pass 2: Proven Cold</span>';
    } else if (masteryState === "pass1") {
      badgeHtml = '<span class="status-badge-pass1">🟡 Pass 1: Solved</span>';
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">#${p.id}</td>
      <td>
        <a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:none; font-weight:600;">
          ${p.title} ↗
        </a>
      </td>
      <td>${p.category}</td>
      <td><span class="diff-badge ${p.difficulty}">${p.difficulty}</span></td>
      <td style="font-family:var(--font-mono); font-size:11px;">${p.timeComplexity || "O(N)"}</td>
      <td><a href="#" style="color:var(--accent-primary); text-decoration:none;" onclick="jumpToProblemFromRematch(${p.dayMapped}, ${p.id})">Day ${p.dayMapped}</a></td>
      <td style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">${autopsy.nextReviewDate || "—"}</td>
      <td>${badgeHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  const coldCount = Object.values(AppState.mastery).filter(m => m === "cold").length;
  const countEl = document.getElementById("matrixCompletionCount");
  if (countEl) countEl.textContent = `${coldCount}/75 Proven Cold`;
}

function filterMatrix(filterName, btn) {
  currentMatrixFilter = filterName;
  document.querySelectorAll("#matrixFilterChips .matrix-filter-chip").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderMatrixView();
}

// ============================================================================
// 4-VIEW CONTROLLER & TELEMETRY
// ============================================================================

function switchView(viewName) {
  AppState.currentView = viewName;
  persistState();

  document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
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

  const coldEl = document.getElementById("statColdCount");
  if (coldEl) coldEl.textContent = `${coldCount}/75`;

  const pass1El = document.getElementById("statPass1Count");
  if (pass1El) pass1El.textContent = `${pass1Count}/75`;

  const pct = Math.round((coldCount / 75) * 100);
  const pctLabel = document.getElementById("masteryPctLabel");
  if (pctLabel) pctLabel.textContent = `${pct}%`;

  const coldBar = document.getElementById("masteryColdBar");
  if (coldBar) coldBar.style.width = `${(coldCount / 75) * 100}%`;

  const pass1Bar = document.getElementById("masteryPass1Bar");
  if (pass1Bar) pass1Bar.style.width = `${(pass1Count / 75) * 100}%`;

  const legCold = document.getElementById("legendColdCount");
  if (legCold) legCold.textContent = coldCount;

  const legPass1 = document.getElementById("legendPass1Count");
  if (legPass1) legPass1.textContent = pass1Count;

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
}

function copyInvariantText() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay);
  if (!dayData || !navigator?.clipboard?.writeText) return;
  navigator.clipboard.writeText(dayData.invariant).then(() => {
    const btn = document.getElementById("btnCopyInv");
    if (btn) {
      btn.textContent = "✓ Copied!";
      setTimeout(() => { btn.textContent = "Copy Rule"; }, 1500);
    }
  });
}

function copyCleanBoilerplateTemplate() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay);
  if (!dayData || !dayData.starterCode || !navigator?.clipboard?.writeText) return;
  const snippet = dayData.starterCode.python || dayData.starterCode.cpp;
  navigator.clipboard.writeText(snippet).then(() => {
    alert("✓ Clean interview boilerplate copied to clipboard!");
  });
}

// ============================================================================
// COMMAND PALETTE (⌘K) & MODALS
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
    item.className = "palette-item";
    item.innerHTML = `
      <div>
        <b style="color:#fff;">#${p.id} ${p.title}</b>
        <span style="font-size:11px; color:var(--text-muted); margin-left:8px;">${p.category}</span>
      </div>
      <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
    `;
    item.onclick = () => {
      closeCommandPalette();
      jumpToProblemFromRematch(p.dayMapped, p.id);
    };
    container.appendChild(item);
  });
}

function openBackupModal() {
  const m = document.getElementById("backupModalBackdrop");
  if (m) m.classList.add("open");
}
function closeBackupModal() {
  const m = document.getElementById("backupModalBackdrop");
  if (m) m.classList.remove("open");
}

function openShortcutsModal() {
  const m = document.getElementById("shortcutsModalBackdrop");
  if (m) m.classList.add("open");
}
function closeShortcutsModal() {
  const m = document.getElementById("shortcutsModalBackdrop");
  if (m) m.classList.remove("open");
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
      alert("✓ Data successfully imported!");
      location.reload();
    } catch (err) {
      alert("Invalid JSON backup file!");
    }
  };
  reader.readAsText(file);
}

function clearAllProgress() {
  if (confirm("Reset all training progress, 2-pass cold records, and rematch notes? This cannot be undone.")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// Global Keyboard Shortcuts
function setupShortcuts() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCommandPalette();
      closeBackupModal();
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
// BULLETPROOF BOOT LIFECYCLE
// ============================================================================

function bootApp() {
  try {
    loadSavedState();
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
