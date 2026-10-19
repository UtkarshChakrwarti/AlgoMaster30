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
// ============================================================================
// AUDIO NOTIFICATION & APPLE CUSTOM DIALOG SYSTEM
// Zero Emojis • Zero Native Alerts/Prompts/Confirms • Offline Web Audio API
// ============================================================================

function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Harmonic two-tone Apple chime:
    // First bell: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.28, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // Second bell: G5 (783.99 Hz, perfect fifth harmonic chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now + 0.14);
    gain2.gain.setValueAtTime(0, now + 0.14);
    gain2.gain.linearRampToValueAtTime(0.32, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 1.25);
  } catch (err) {
    console.warn("Audio chime prevented or unsupported:", err);
  }
}

let timerToastTimeout = null;

function showTimerToast(title, desc) {
  const toast = document.getElementById("appleTimerToast");
  if (!toast) return;
  const titleEl = toast.querySelector(".timer-toast-title");
  const descEl = toast.querySelector(".timer-toast-desc");
  if (titleEl && title) titleEl.textContent = title;
  if (descEl && desc) descEl.textContent = desc;
  toast.classList.add("show");

  if (timerToastTimeout) clearTimeout(timerToastTimeout);
  timerToastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 8000);
}

function dismissTimerToast() {
  const toast = document.getElementById("appleTimerToast");
  if (toast) toast.classList.remove("show");
  if (timerToastTimeout) clearTimeout(timerToastTimeout);
}

const AppleDialog = {
  _resolve: null,

  open({ title, message, iconType = "info", showInput = false, inputValue = "", placeholder = "", confirmText = "OK", cancelText = null, destructive = false }) {
    return new Promise((resolve) => {
      this._resolve = resolve;
      const modal = document.getElementById("appleCustomDialogModal");
      if (!modal) {
        resolve(showInput ? inputValue : true);
        return;
      }

      const titleEl = document.getElementById("appleDialogTitle");
      const msgEl = document.getElementById("appleDialogMessage");
      const iconWrap = document.getElementById("appleDialogIconWrap");
      const inputWrap = document.getElementById("appleDialogInputWrap");
      const inputEl = document.getElementById("appleDialogInput");
      const actionsEl = document.getElementById("appleDialogActions");

      if (titleEl) titleEl.textContent = title || "";
      if (msgEl) msgEl.textContent = message || "";

      if (iconWrap) {
        if (destructive || iconType === "warning") {
          iconWrap.className = "apple-dialog-icon warning";
          iconWrap.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else if (showInput || iconType === "prompt") {
          iconWrap.className = "apple-dialog-icon prompt";
          iconWrap.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        } else {
          iconWrap.className = "apple-dialog-icon info";
          iconWrap.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 12 12 12 8"></polyline><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }
      }

      if (inputWrap && inputEl) {
        if (showInput) {
          inputWrap.style.display = "block";
          inputEl.value = inputValue || "";
          inputEl.placeholder = placeholder || "Type here...";
          setTimeout(() => inputEl.focus(), 60);
        } else {
          inputWrap.style.display = "none";
        }
      }

      if (actionsEl) {
        let btns = "";
        if (cancelText) {
          btns += `<button type="button" class="apple-pill-btn dialog-cancel-btn" onclick="AppleDialog.cancel()">${cancelText}</button>`;
        }
        const confirmBtnClass = destructive ? "apple-pill-btn danger" : "apple-pill-btn primary";
        btns += `<button type="button" class="${confirmBtnClass} dialog-confirm-btn" onclick="AppleDialog.confirm()">${confirmText}</button>`;
        actionsEl.innerHTML = btns;
      }

      modal.classList.add("open");
    });
  },

  confirm() {
    const modal = document.getElementById("appleCustomDialogModal");
    if (modal) modal.classList.remove("open");
    const inputWrap = document.getElementById("appleDialogInputWrap");
    const inputEl = document.getElementById("appleDialogInput");
    const isPrompt = inputWrap && inputWrap.style.display !== "none";
    const val = isPrompt && inputEl ? inputEl.value : true;
    if (this._resolve) {
      const fn = this._resolve;
      this._resolve = null;
      fn(val);
    }
  },

  cancel() {
    const modal = document.getElementById("appleCustomDialogModal");
    if (modal) modal.classList.remove("open");
    if (this._resolve) {
      const fn = this._resolve;
      this._resolve = null;
      fn(null);
    }
  },

  alert(title, message, callback) {
    return this.open({
      title,
      message,
      iconType: "info",
      confirmText: "OK",
      cancelText: null
    }).then(() => {
      if (callback) callback();
    });
  },

  confirmDialog(title, message, onConfirm, onCancel, options = {}) {
    return this.open({
      title,
      message,
      iconType: options.destructive ? "warning" : "info",
      confirmText: options.confirmText || (options.destructive ? "Reset Everything" : "Confirm"),
      cancelText: options.cancelText || "Cancel",
      destructive: !!options.destructive
    }).then((res) => {
      if (res) {
        if (onConfirm) onConfirm();
      } else {
        if (onCancel) onCancel();
      }
    });
  },

  prompt(title, message, defaultValue, onSubmit, onCancel) {
    return this.open({
      title,
      message,
      iconType: "prompt",
      showInput: true,
      inputValue: defaultValue || "",
      placeholder: "Enter value...",
      confirmText: "Save",
      cancelText: "Cancel"
    }).then((val) => {
      if (val !== null) {
        if (onSubmit) onSubmit(val);
      } else {
        if (onCancel) onCancel();
      }
    });
  }
};

// Global Keyboard Handler for AppleDialog
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    const modal = document.getElementById("appleCustomDialogModal");
    if (modal && modal.classList.contains("open")) {
      if (e.key === "Escape") {
        e.preventDefault();
        AppleDialog.cancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        AppleDialog.confirm();
      }
    }
  });
}

// ============================================================================
// TIMERS & STOPWATCH ENGINE
// ============================================================================

const TimerEngine = {
  activePhase: 0, // 0 = idle, 1 = 15m paper countdown, 2 = portal stopwatch
  phase1Remaining: 15 * 60,
  phase2Seconds: 0,
  intervalId: null,
  isOvertime: false,
  overtimeSeconds: 0,

  formatTime(totalSec) {
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  },

  startPhase1() {
    this.activePhase = 1;
    // Request browser notification permission so user can receive notifications when time is up
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      try {
        Notification.requestPermission().catch(() => {});
      } catch (err) {}
    }
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

  handlePhase1Expired() {
    // 1. Play Apple Web Audio harmonic chime
    playNotificationChime();

    // 2. Native OS Browser notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("AlgoMaster 30 — Time is Up!", {
          body: "15-minute paper struggle completed. You can now reveal hints or begin coding.",
          icon: "icons/icon.svg"
        });
      } catch (err) {
        console.warn("Notification trigger error:", err);
      }
    }

    // 3. In-App Glass Toast Banner
    showTimerToast("Time is Up — 15m Struggle Complete", "You've crossed 15 minutes. Tracking overtime. Reveal hints or advance to code!");
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
          const el = document.getElementById("wizardPaperTimerVal");
          if (el) el.textContent = this.formatTime(this.phase1Remaining);
          if (this.phase1Remaining === 0) {
            this.handlePhase1Expired();
          }
        } else {
          // Timer crossed 00:00 — track overtime so user can monitor exact elapsed struggle duration
          this.isOvertime = true;
          this.overtimeSeconds = (this.overtimeSeconds || 0) + 1;
          const el = document.getElementById("wizardPaperTimerVal");
          if (el) el.textContent = "00:00";
          const otEl = document.getElementById("wizardPaperTimerOvertime");
          if (otEl) {
            otEl.style.display = "inline-flex";
            otEl.textContent = `Overtime: +${this.formatTime(this.overtimeSeconds)}`;
          }
        }
      } else if (this.activePhase === 2) {
        this.phase2Seconds++;
        const el = document.getElementById("wizardStopwatchVal");
        if (el) el.textContent = this.formatTime(this.phase2Seconds);
      }
    }, 1000);
  },

  addFiveMinutes() {
    if (this.isOvertime) {
      if (this.overtimeSeconds > 300) {
        this.overtimeSeconds -= 300;
      } else {
        this.phase1Remaining = 300 - this.overtimeSeconds;
        this.overtimeSeconds = 0;
        this.isOvertime = false;
        const otEl = document.getElementById("wizardPaperTimerOvertime");
        if (otEl) otEl.style.display = "none";
      }
    } else {
      this.phase1Remaining += 5 * 60;
    }
    const el = document.getElementById("wizardPaperTimerVal");
    if (el) el.textContent = this.formatTime(this.phase1Remaining);
  },

  isTimerRunning() {
    return this.intervalId !== null;
  },

  pauseAny() {
    if (this.activePhase === 1) {
      this.pausePhase1();
    } else if (this.activePhase === 2) {
      if (this.intervalId) {
        if (typeof clearInterval !== "undefined") clearInterval(this.intervalId);
        else if (typeof window !== "undefined" && window.clearInterval) window.clearInterval(this.intervalId);
      }
      this.intervalId = null;
      const statusEl = document.getElementById("wizardStopwatchStatus");
      if (statusEl) statusEl.textContent = `Paused at ${this.formatTime(this.phase2Seconds)}`;
    }
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
    this.isOvertime = false;
    this.overtimeSeconds = 0;
    const p1El = document.getElementById("wizardPaperTimerVal");
    if (p1El) p1El.textContent = "15:00";
    const p2El = document.getElementById("wizardStopwatchVal");
    if (p2El) p2El.textContent = "00:00";
    const otEl = document.getElementById("wizardPaperTimerOvertime");
    if (otEl) otEl.style.display = "none";
    const btn = document.getElementById("btnWizardPaperTimerStart");
    if (btn) btn.textContent = "Start 15m Timer";
  }
};

// Deliberate Practice Navigation Lock
// Intercepts and guards all screen, day, subtab, and problem jumps while the timer is running
function checkTimerLock(onProceed) {
  if (TimerEngine.isTimerRunning()) {
    const phaseName = TimerEngine.activePhase === 1 ? "15-minute paper struggle" : "implementation timer";
    AppleDialog.confirmDialog(
      "Struggle Timer Active",
      `Your ${phaseName} is currently in progress. Deliberate practice requires uninterrupted focus.\n\nTo navigate to another section or problem, please confirm pausing the timer.`,
      () => {
        TimerEngine.pauseAny();
        if (typeof onProceed === "function") onProceed();
      },
      () => {
        // User chose to stay focused: do nothing
      },
      {
        confirmText: "Pause & Proceed",
        cancelText: "Stay Focused"
      }
    );
    return false;
  }
  if (typeof onProceed === "function") onProceed();
  return true;
}

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
    } else if (trace.treeNodes || (trace.type && (trace.type.startsWith("tree") || trace.type.startsWith("bst")))) {
      this.renderBinaryTree(stage, step, trace);
    } else if (trace.listNodes || (trace.type && (trace.type === "linked-list" || trace.type === "floyd-cycle"))) {
      this.renderLinkedList(stage, step, trace);
    } else if (trace.graphNodes || (trace.type && (trace.type === "topo-sort" || trace.type === "graph-dag"))) {
      this.renderDirectedGraph(stage, step, trace);
    } else if (trace.trieNodes || trace.type === "trie") {
      this.renderTrie(stage, step, trace);
    } else if (trace.type === "two-heaps") {
      this.renderTwoHeaps(stage, step, trace);
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
      const ptrsStr = typeof step.pointers === "object"
        ? Object.entries(step.pointers).map(([k, v]) => `${k}:${v}`).join(", ")
        : step.pointers;
      b.innerHTML = `ptrs: <b>${ptrsStr}</b>`;
      dataRow.appendChild(b);
    }

    if (step.reversedCount !== undefined) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `reversed: <b>${step.reversedCount}</b>`;
      dataRow.appendChild(b);
    }

    if (step.islandCount !== undefined) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `islands: <b>${step.islandCount}</b>`;
      dataRow.appendChild(b);
    }

    if (step.median !== undefined) {
      const b = document.createElement("div");
      b.className = "inspector-pill-badge";
      b.innerHTML = `median: <b>${step.median}</b>`;
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

  renderBinaryTree(stage, step, trace) {
    const container = document.createElement("div");
    container.className = "vis-tree-container";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 500 220");
    svg.setAttribute("class", "vis-tree-svg");

    const nodes = trace.treeNodes || [];
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    // 1. Draw SVG Edges
    nodes.forEach(n => {
      [n.left, n.right].forEach(childId => {
        if (!childId || !nodeMap[childId]) return;
        const child = nodeMap[childId];
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", n.x);
        line.setAttribute("y1", n.y);
        line.setAttribute("x2", child.x);
        line.setAttribute("y2", child.y);
        line.setAttribute("class", "vis-tree-edge");

        const isHighlighted = (step.highlightEdges || []).some(
          e => (e[0] === n.id && e[1] === child.id) || (e[0] === child.id && e[1] === n.id)
        ) || (step.pathEdges || []).some(
          e => (e[0] === n.id && e[1] === child.id) || (e[0] === child.id && e[1] === n.id)
        );

        if (isHighlighted) {
          line.classList.add("active");
        }
        svg.appendChild(line);
      });
    });

    // 2. Draw SVG Nodes
    nodes.forEach(n => {
      const g = document.createElementNS(svgNS, "g");
      let nodeClasses = "vis-tree-node";

      const isActive = step.activeNodeId === n.id;
      const isSwapped = (step.swappedPair || []).includes(n.id);
      const isViolation = step.violationNodeId === n.id;
      const isLCA = step.lcaNodeId === n.id;
      const isPath = (step.pathNodes || []).includes(n.id);

      if (isActive) nodeClasses += " active";
      if (isSwapped) nodeClasses += " swapped";
      if (isViolation) nodeClasses += " violation";
      if (isLCA) nodeClasses += " lca";
      if (isPath) nodeClasses += " path";
      if (n.isP) nodeClasses += " target-p";
      if (n.isQ) nodeClasses += " target-q";

      g.setAttribute("class", nodeClasses);
      g.setAttribute("transform", `translate(${n.x}, ${n.y})`);

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("r", "19");
      circle.setAttribute("class", "vis-tree-node-circle");
      g.appendChild(circle);

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("class", "vis-tree-node-val");
      text.textContent = n.val;
      g.appendChild(text);

      const boundsText = (step.bounds && step.bounds[n.id]) || (n.isP ? "p (target)" : (n.isQ ? "q (target)" : ""));
      if (boundsText) {
        const sub = document.createElementNS(svgNS, "text");
        sub.setAttribute("y", "29");
        sub.setAttribute("class", "vis-tree-node-sub");
        sub.textContent = boundsText;
        g.appendChild(sub);
      }

      svg.appendChild(g);
    });

    container.appendChild(svg);
    stage.appendChild(container);
  },

  renderLinkedList(stage, step, trace) {
    const container = document.createElement("div");
    container.className = "vis-list-stage";

    const row = document.createElement("div");
    row.className = "vis-list-row";

    const nodes = trace.listNodes || [];
    const pointers = step.pointers || {};
    const reversedEdges = step.edgesReversed || [];

    nodes.forEach((n, idx) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "vis-list-node-wrap";

      const pointerPins = [];
      Object.entries(pointers).forEach(([pName, pVal]) => {
        if (pVal === n.id) {
          pointerPins.push(pName);
        }
      });

      if (pointerPins.length > 0) {
        const pinBar = document.createElement("div");
        pinBar.className = "vis-list-pin-bar";
        pointerPins.forEach(p => {
          const pin = document.createElement("span");
          pin.className = `vis-list-pointer-pin ${p}`;
          pin.textContent = p;
          pinBar.appendChild(pin);
        });
        cardWrapper.appendChild(pinBar);
      }

      const card = document.createElement("div");
      card.className = "vis-list-card";
      if (pointerPins.length > 0) card.classList.add("active");
      if (n.isCycleOrigin) card.classList.add("cycle-origin");

      card.innerHTML = `<span class="vis-list-val">${n.val}</span><span class="vis-list-next-dot">•</span>`;
      cardWrapper.appendChild(card);

      row.appendChild(cardWrapper);

      if (idx < nodes.length - 1) {
        const arrowWrap = document.createElement("div");
        arrowWrap.className = "vis-list-arrow";
        const isReversed = reversedEdges.includes(n.id);
        if (isReversed) arrowWrap.classList.add("reversed");
        arrowWrap.innerHTML = isReversed ? "←" : "→";
        row.appendChild(arrowWrap);
      } else {
        const arrowWrap = document.createElement("div");
        arrowWrap.className = "vis-list-arrow";
        if (trace.type === "floyd-cycle") {
          arrowWrap.classList.add("cycle-loop");
          arrowWrap.innerHTML = "↺ loop (to 2)";
        } else {
          const isReversed = reversedEdges.includes(n.id);
          arrowWrap.innerHTML = isReversed ? "←" : "→";
        }
        row.appendChild(arrowWrap);

        if (trace.type !== "floyd-cycle") {
          const nullCard = document.createElement("div");
          nullCard.className = "vis-list-null-chip";
          nullCard.textContent = "NULL";
          row.appendChild(nullCard);
        }
      }
    });

    container.appendChild(row);
    stage.appendChild(container);
  },

  renderDirectedGraph(stage, step, trace) {
    const container = document.createElement("div");
    container.className = "vis-graph-stage";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 460 210");
    svg.setAttribute("class", "vis-graph-svg");

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "graph-arrowhead");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "22");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto-start-reverse");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M 0 1.5 L 8 5 L 0 8.5 z");
    path.setAttribute("fill", "var(--apple-blue)");
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const nodes = trace.graphNodes || [];
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    (trace.graphEdges || []).forEach(e => {
      const fromNode = nodeMap[e.from];
      const toNode = nodeMap[e.to];
      if (!fromNode || !toNode) return;

      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", fromNode.x);
      line.setAttribute("y1", fromNode.y);
      line.setAttribute("x2", toNode.x);
      line.setAttribute("y2", toNode.y);
      line.setAttribute("class", "vis-graph-edge");
      line.setAttribute("marker-end", "url(#graph-arrowhead)");

      const isActive = (step.activeEdges || []).some(
        ae => ae.from === e.from && ae.to === e.to
      );
      if (isActive) line.classList.add("active");

      const isResolved = (step.processed || []).includes(e.from);
      if (isResolved) line.classList.add("resolved");

      svg.appendChild(line);
    });

    nodes.forEach(n => {
      const g = document.createElementNS(svgNS, "g");
      let cls = "vis-graph-node";
      const isActive = step.activeNodeId === n.id;
      const isProcessed = (step.processed || []).includes(n.id);
      const inQueue = (step.queue || []).includes(n.id);

      if (isActive) cls += " active";
      if (isProcessed) cls += " processed";
      if (inQueue) cls += " in-queue";

      g.setAttribute("class", cls);
      g.setAttribute("transform", `translate(${n.x}, ${n.y})`);

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("r", "20");
      circle.setAttribute("class", "vis-graph-node-circle");
      g.appendChild(circle);

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("class", "vis-graph-node-text");
      text.textContent = n.id;
      g.appendChild(text);

      const inDeg = (step.indegrees && step.indegrees[n.id] !== undefined) ? step.indegrees[n.id] : 0;
      const badge = document.createElementNS(svgNS, "text");
      badge.setAttribute("y", "-25");
      badge.setAttribute("class", "vis-graph-indegree-chip");
      badge.textContent = `in: ${inDeg}`;
      g.appendChild(badge);

      const lbl = document.createElementNS(svgNS, "text");
      lbl.setAttribute("y", "32");
      lbl.setAttribute("class", "vis-graph-course-lbl");
      lbl.textContent = n.label;
      g.appendChild(lbl);

      svg.appendChild(g);
    });

    container.appendChild(svg);

    const queueBar = document.createElement("div");
    queueBar.className = "vis-graph-queue-bar";
    const qItems = (step.queue || []).map(q => `<b>Course ${q}</b>`).join(", ");
    queueBar.innerHTML = `<span class="q-label">Zero In-Degree Queue:</span> [ ${qItems || "empty"} ]`;
    container.appendChild(queueBar);

    stage.appendChild(container);
  },

  renderTrie(stage, step, trace) {
    const container = document.createElement("div");
    container.className = "vis-trie-stage";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 500 280");
    svg.setAttribute("class", "vis-trie-svg");

    const nodes = trace.trieNodes || [];
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    nodes.forEach(n => {
      if (!n.parent || !nodeMap[n.parent]) return;
      const parent = nodeMap[n.parent];
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", parent.x);
      line.setAttribute("y1", parent.y);
      line.setAttribute("x2", n.x);
      line.setAttribute("y2", n.y);
      line.setAttribute("class", "vis-tree-edge");

      const inPath = (step.path || []).includes(n.id);
      if (inPath) line.classList.add("active");

      svg.appendChild(line);
    });

    nodes.forEach(n => {
      const g = document.createElementNS(svgNS, "g");
      let cls = "vis-tree-node";
      const isActive = step.activeNodeId === n.id;
      const inPath = (step.path || []).includes(n.id);

      if (isActive) cls += " active";
      if (inPath) cls += " path";
      if (n.isWord) cls += " word-end";

      g.setAttribute("class", cls);
      g.setAttribute("transform", `translate(${n.x}, ${n.y})`);

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("r", "18");
      circle.setAttribute("class", "vis-tree-node-circle");
      g.appendChild(circle);

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("class", "vis-tree-node-val");
      text.textContent = n.val;
      g.appendChild(text);

      if (n.isWord) {
        const star = document.createElementNS(svgNS, "text");
        star.setAttribute("x", "14");
        star.setAttribute("y", "-10");
        star.setAttribute("class", "vis-trie-star");
        star.textContent = "★";
        g.appendChild(star);
      }

      svg.appendChild(g);
    });

    container.appendChild(svg);
    stage.appendChild(container);
  },

  renderTwoHeaps(stage, step, trace) {
    const container = document.createElement("div");
    container.className = "vis-heaps-container";

    const heapsRow = document.createElement("div");
    heapsRow.className = "vis-heaps-row";

    const leftBox = document.createElement("div");
    leftBox.className = "vis-heap-box max-heap";
    leftBox.innerHTML = `
      <div class="vis-heap-title">Max-Heap (Lower 50%)</div>
      <div class="vis-heap-chips">
        ${(step.leftMaxHeap || []).map((val, idx) => `
          <div class="vis-heap-chip ${idx === 0 ? "heap-top" : ""}">
            ${idx === 0 ? "<span class='vis-top-badge'>TOP</span>" : ""}
            <span class="chip-val">${val}</span>
          </div>
        `).join("") || "<span class='empty-heap'>[empty]</span>"}
      </div>
    `;
    heapsRow.appendChild(leftBox);

    const medianPill = document.createElement("div");
    medianPill.className = "vis-median-formula-pill";
    medianPill.innerHTML = `
      <div class="median-val-badge">Median: <b>${step.median}</b></div>
      <div class="median-formula-sub">${step.formula || ""}</div>
    `;
    heapsRow.appendChild(medianPill);

    const rightBox = document.createElement("div");
    rightBox.className = "vis-heap-box min-heap";
    rightBox.innerHTML = `
      <div class="vis-heap-title">Min-Heap (Upper 50%)</div>
      <div class="vis-heap-chips">
        ${(step.rightMinHeap || []).map((val, idx) => `
          <div class="vis-heap-chip ${idx === 0 ? "heap-top" : ""}">
            ${idx === 0 ? "<span class='vis-top-badge'>TOP</span>" : ""}
            <span class="chip-val">${val}</span>
          </div>
        `).join("") || "<span class='empty-heap'>[empty]</span>"}
      </div>
    `;
    heapsRow.appendChild(rightBox);

    container.appendChild(heapsRow);
    stage.appendChild(container);
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
      body1.classList.add("inswap-animate");
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
      body2.classList.add("inswap-animate");
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
      body3.classList.add("inswap-animate");
      if (stat3) stat3.textContent = "Active Step";

      const isSolved = AppState.mastery[AppState.activeProblemId] === "cold" || AppState.mastery[AppState.activeProblemId] === "pass1";
      const successCard = document.getElementById("step3QuickSuccessCard");
      const unsolvedActions = document.getElementById("step3UnsolvedActions");
      if (isSolved) {
        if (successCard) successCard.style.display = "flex";
        if (unsolvedActions) unsolvedActions.style.display = "none";
      } else {
        if (successCard) successCard.style.display = "none";
        if (unsolvedActions) unsolvedActions.style.display = "flex";
      }

      updateStep3NextProblemButtons();
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
  updateStep3NextProblemButtons();
}

function getNextProblemInfo() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay) || CURRICULUM_DATABASE[0];
  const tasks = dayData.blind75Tasks || [];
  if (AppState.activeProblemIndex < tasks.length - 1) {
    const nextIdx = AppState.activeProblemIndex + 1;
    const nextTask = tasks[nextIdx];
    const nextProblem = BLIND_75_DATABASE.find(p => p.id === nextTask.id) || nextTask;
    return {
      hasNextProblem: true,
      isNextDay: false,
      nextIdx,
      problem: nextProblem,
      label: `Proceed to Next Problem: #${nextProblem.id} ${nextProblem.title} →`,
      subText: `Problem ${nextIdx + 1} of ${tasks.length}`
    };
  } else {
    const hasNextDay = AppState.currentDay < 30;
    return {
      hasNextProblem: false,
      isNextDay: hasNextDay,
      nextDay: AppState.currentDay + 1,
      label: hasNextDay
        ? `Day ${AppState.currentDay} Conquered! Proceed to Day ${AppState.currentDay + 1} →`
        : `All 30 Days Mastered! Review Rematches →`,
      subText: `All ${tasks.length} problems finished for today!`
    };
  }
}

function updateStep3NextProblemButtons() {
  const nextInfo = getNextProblemInfo();
  const nextBtn = document.getElementById("btnStep3NextProblem");
  const pitchNextBtn = document.getElementById("btnPitchNextProb");
  const quickNextBtn = document.getElementById("btnStep3QuickNext");
  const subTextEl = document.getElementById("step3SuccessSub");

  if (nextBtn) {
    nextBtn.textContent = nextInfo.label;
  }
  if (pitchNextBtn) {
    pitchNextBtn.textContent = nextInfo.label;
  }
  if (quickNextBtn) {
    quickNextBtn.textContent = nextInfo.hasNextProblem ? "Mark Solved & Next Problem →" : "Mark Solved & Next Day →";
  }
  if (subTextEl) {
    subTextEl.textContent = `Marked as Cold Mastery. ${nextInfo.subText}`;
  }
}

function quickMarkProblemSolved(advanceToStep3 = true) {
  const problemId = AppState.activeProblemId;
  const problem = BLIND_75_DATABASE.find(p => p.id === problemId);
  if (!problem) return;

  TimerEngine.stopPhase2();

  // Mark as cold mastery
  AppState.mastery[problemId] = "cold";

  const nextReviewDate = calculateNextReviewDate("cold");
  const noteEl = document.getElementById("wizardNoteInput");
  const note = noteEl ? noteEl.value.trim() : "";

  const prev = AppState.autopsies[problemId] || {};
  AppState.autopsies[problemId] = {
    outcome: "cold",
    note: note || prev.note || "",
    nextReviewDate,
    reviewCount: (prev.reviewCount || 0) + 1
  };

  const logNote = note || "Optimal cold mastery achieved with zero hints.";
  const existingIdx = AppState.mistakeJournal.findIndex(j => j.problemId === problemId);
  if (existingIdx === -1) {
    AppState.mistakeJournal.unshift({
      problemId,
      title: problem.title,
      note: logNote,
      outcome: "Cold Mastery",
      date: new Date().toLocaleDateString()
    });
  }

  persistState();
  updateTopStats();
  renderRoadmap();
  renderDailyProblemPills(AppState.currentDay);

  if (advanceToStep3) {
    setProblemStep(3);
  }

  const successCard = document.getElementById("step3QuickSuccessCard");
  if (successCard) successCard.style.display = "flex";

  const unsolvedActions = document.getElementById("step3UnsolvedActions");
  if (unsolvedActions) unsolvedActions.style.display = "none";

  // If note was not entered, close accordion by default so it's clean and optional
  const debriefAcc = document.getElementById("debriefOptionalAccordion");
  if (debriefAcc && !note) {
    debriefAcc.open = false;
  }

  unlockInterviewPitchCard(problem);
  updateStep3NextProblemButtons();
}

function quickMarkAndNextProblem() {
  quickMarkProblemSolved(false);
  advanceToNextDailyProblem();
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

function saveWizardDebrief(unlockPitch = true) {
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
    const isDup = AppState.mistakeJournal.length > 0 && 
                  AppState.mistakeJournal[0].problemId === problemId && 
                  AppState.mistakeJournal[0].note === note;
    if (!isDup) {
      const outcomeLabel = outcome === "cold" ? "Cold Mastery" : outcome === "buggy" ? "Bug Encountered" : outcome === "hints" ? "Hint Utilized" : "Editorial Reviewed";
      AppState.mistakeJournal.unshift({
        problemId,
        title: problem.title,
        note,
        outcome: outcomeLabel,
        date: new Date().toLocaleDateString()
      });
    }
  }

  persistState();
  updateTopStats();
  renderRoadmap();
  renderDailyProblemPills(AppState.currentDay);

  const successCard = document.getElementById("step3QuickSuccessCard");
  if (successCard) successCard.style.display = "flex";

  const unsolvedActions = document.getElementById("step3UnsolvedActions");
  if (unsolvedActions) unsolvedActions.style.display = "none";

  updateStep3NextProblemButtons();

  if (unlockPitch) {
    unlockInterviewPitchCard(problem);
  }

  AppleDialog.alert("Debrief Saved", "Your reflection and problem status have been safely recorded locally.");
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
      AppleDialog.alert("Interview Pitch Copied", "Your 30-second speaking script has been copied to the clipboard.");
    });
  } else {
    AppleDialog.alert("Interview Pitch", pitchText);
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

  updateStep3NextProblemButtons();
}

function advanceToNextDailyProblem() {
  checkTimerLock(() => {
    const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay) || CURRICULUM_DATABASE[0];
    const tasks = dayData.blind75Tasks || [];
    if (AppState.activeProblemIndex < tasks.length - 1) {
      selectDailyProblem(AppState.activeProblemIndex + 1);
    } else {
      if (AppState.currentDay < 30) {
        AppleDialog.confirmDialog(
          `Day ${AppState.currentDay} Conquered! 🎉`,
          `You have finished all assigned problems for Day ${AppState.currentDay}. Ready to jump ahead to Day ${AppState.currentDay + 1}?`,
          () => {
            switchDay(AppState.currentDay + 1);
            switchDaySubTab("learn");
          },
          () => {
            switchDaySubTab("learn");
          },
          { confirmText: `Go to Day ${AppState.currentDay + 1} →`, cancelText: "Review Today's Concepts" }
        );
      } else {
        AppleDialog.alert("30-Day Capstone Complete! 🏆", "Congratulations! You have completed the entire 30-Day AlgoMaster curriculum. Review your Rematches or test your reflexes in Pattern Drill!");
        switchDaySubTab("learn");
      }
    }
  });
}

// ============================================================================
// DAILY CURRICULUM & PILLS
// ============================================================================

function switchDaySubTab(tab) {
  if (AppState.currentSubTab === tab) return;
  // If moving away from active solve phase while timer is running, prompt user
  if (AppState.currentSubTab === "solve" && tab === "learn" && TimerEngine.isTimerRunning()) {
    checkTimerLock(() => doSwitchDaySubTab(tab));
  } else {
    doSwitchDaySubTab(tab);
  }
}

function doSwitchDaySubTab(tab) {
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
      masteryBadge = `<span class="apple-diff-pill Easy" style="font-size:10px;">✓ Cold</span>`;
    } else if (masteryState === "pass1") {
      masteryBadge = `<span class="apple-diff-pill" style="font-size:10px; background:var(--apple-action-subtle); color:var(--apple-action-dark);">Pass 1</span>`;
    }

    const pill = document.createElement("button");
    pill.className = `practice-pill-btn ${idx === AppState.activeProblemIndex ? "active" : ""} ${masteryState === "cold" ? "cold-mastered" : ""}`;
    pill.onclick = () => {
      if (idx !== AppState.activeProblemIndex) {
        checkTimerLock(() => selectDailyProblem(idx));
      }
    };
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
    bossPill.className = `practice-pill-btn ${AppState.activeProblemIndex === 999 ? "active" : ""}`;
    bossPill.onclick = () => {
      if (AppState.activeProblemIndex !== 999) {
        checkTimerLock(() => selectDailyBossFight(dayData.extremeProblem));
      }
    };
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
  if (index >= tasks.length) index = 0;
  if (!tasks[index]) {
    if (dayData.extremeProblem) {
      selectDailyBossFight(dayData.extremeProblem);
      return;
    }
    return;
  }

  AppState.activeProblemIndex = index;
  const taskId = tasks[index].id;
  AppState.activeProblemId = taskId;
  persistState();

  const problem = BLIND_75_DATABASE.find(p => p.id === taskId) || tasks[index];
  if (!problem) return;

  // Highlight active pill
  document.querySelectorAll("#dailyProblemPills .practice-pill-btn").forEach((el, i) => {
    if (i === index) el.classList.add("active");
    else el.classList.remove("active");
  });

  // Populate Step 1 Header
  const titleEl = document.getElementById("wizardProblemTitle");
  if (titleEl) titleEl.textContent = `#${problem.id}: ${problem.title}`;

  const diffBadge = document.getElementById("wizardProblemDiff");
  if (diffBadge) {
    diffBadge.textContent = problem.difficulty;
    diffBadge.className = `apple-diff-pill ${problem.difficulty}`;
  }

  const premiumBadge = document.getElementById("wizardProblemPremiumBadge");
  if (premiumBadge) {
    premiumBadge.style.display = problem.isPremium ? "inline-flex" : "none";
  }

  // Update Main LeetCode Link & Dynamic Label
  const mainPortalLink = document.getElementById("btnSolvePortalMain");
  const mainPortalLabel = document.getElementById("portalMainLabel");
  if (mainPortalLink) {
    mainPortalLink.href = problem.leetcodeUrl;
    if (mainPortalLabel) {
      mainPortalLabel.textContent = problem.isPremium ? "Open on LeetCode (Premium 🔒) ↗" : "Open on LeetCode ↗";
    }
  }

  // Update Free Online Runner Link (NeetCode / GFG)
  const altPortalLink = document.getElementById("btnSolvePortalAlt");
  const altPortalLabel = document.getElementById("portalAltLabel");
  if (altPortalLink) {
    const freeUrl = problem.freeAlternativeUrl || problem.leetcodeUrl;
    altPortalLink.href = freeUrl;
    if (altPortalLabel) {
      const runnerName = problem.freeAlternativeName || "Free Online Runner";
      altPortalLabel.textContent = `${runnerName} ↗`;
    }
    if (problem.isPremium) {
      altPortalLink.classList.add("highlight-runner");
    } else {
      altPortalLink.classList.remove("highlight-runner");
    }
  }

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

  const solvePanel = document.getElementById("tabPanelSolve");
  if (solvePanel) {
    solvePanel.classList.remove("inswap-animate");
    void solvePanel.offsetWidth;
    solvePanel.classList.add("inswap-animate");
  }

  const autopsy = AppState.autopsies[taskId];
  if (autopsy) {
    loadSavedDebrief(autopsy);
  }

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

  const premiumBadge = document.getElementById("wizardProblemPremiumBadge");
  if (premiumBadge) {
    premiumBadge.style.display = "none";
  }

  const mainPortalLink = document.getElementById("btnSolvePortalMain");
  const mainPortalLabel = document.getElementById("portalMainLabel");
  if (mainPortalLink) {
    mainPortalLink.href = boss.url;
    if (mainPortalLabel) mainPortalLabel.textContent = "Open Benchmark Judge ↗";
  }

  const altPortalLink = document.getElementById("btnSolvePortalAlt");
  const altPortalLabel = document.getElementById("portalAltLabel");
  if (altPortalLink) {
    altPortalLink.href = boss.url;
    if (altPortalLabel) altPortalLabel.textContent = "Run on Online Judge ↗";
    altPortalLink.classList.remove("highlight-runner");
  }

  const qEl = document.getElementById("wizardSanityQuestion");
  if (qEl) qEl.textContent = `Benchmark Challenge: ${boss.whyThisBenchmark}`;

  setProblemStep(1);
}

// ============================================================================
// DAY SWITCHING & ROADMAP
// ============================================================================

function switchDay(dayNumber, force = false) {
  if (!force && dayNumber === AppState.currentDay) return;
  checkTimerLock(() => doSwitchDay(dayNumber));
}

function doSwitchDay(dayNumber) {
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

const DAY_THEORY_LINKS = {
  1: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/bronze/intro-sets", cpAlgo: "https://cp-algorithms.com/string/string-hashing.html" },
  2: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/prefix-sums", cpAlgo: "https://cp-algorithms.com/data_structures/fenwick.html" },
  3: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/more-prefix-sums", cpAlgo: "https://cp-algorithms.com/data_structures/disjoint_set_union.html" },
  4: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/two-pointers", cpAlgo: "https://cp-algorithms.com/others/two-pointers.html" },
  5: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/two-pointers", cpAlgo: "https://cp-algorithms.com/data_structures/stack_queue_modification.html" },
  6: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/stacks", cpAlgo: "https://cp-algorithms.com/data_structures/stack_queue_modification.html#finding-the-minimum-for-all-subarrays-of-fixed-length" },
  7: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/stacks", cpAlgo: "https://cp-algorithms.com/data_structures/stack_queue_modification.html" },
  8: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/stacks", cpAlgo: "https://cp-algorithms.com/data_structures/stack_queue_modification.html" },
  9: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/binary-search", cpAlgo: "https://cp-algorithms.com/num_methods/binary_search.html" },
  10: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/binary-search", cpAlgo: "https://codeforces.com/blog/entry/67509" },
  11: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/bronze/simulation", cpAlgo: "https://brilliant.org/wiki/tortoise-and-hare/" },
  12: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/greedy-sorting", cpAlgo: "https://cp-algorithms.com/data_structures/stack_queue_modification.html" },
  13: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/intro-trees", cpAlgo: "https://cp-algorithms.com/graph/depth-first-search.html" },
  14: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/flood-fill", cpAlgo: "https://cp-algorithms.com/graph/breadth-first-search.html" },
  15: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/tree-euler", cpAlgo: "https://cp-algorithms.com/graph/lca.html" },
  16: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/all-roots", cpAlgo: "https://cp-algorithms.com/graph/tree_diameter.html" },
  17: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/string-searching", cpAlgo: "https://cp-algorithms.com/string/prefix-tree-trie.html" },
  18: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/greedy-sorting", cpAlgo: "https://cp-algorithms.com/data_structures/fenwick.html" },
  19: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/bronze/complete-rec", cpAlgo: "https://www.geeksforgeeks.org/backtracking-algorithms/" },
  20: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/flood-fill", cpAlgo: "https://cp-algorithms.com/graph/search-for-connected-components.html" },
  21: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/toposort", cpAlgo: "https://cp-algorithms.com/graph/topological-sort.html" },
  22: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/dsu", cpAlgo: "https://cp-algorithms.com/graph/strongly-connected-components.html" },
  23: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/intro-dp", cpAlgo: "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html" },
  24: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/knapsack", cpAlgo: "https://cp-algorithms.com/dynamic_programming/knapsack.html" },
  25: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/paths-grids", cpAlgo: "https://cp-algorithms.com/sequences/longest_increasing_subseq.html" },
  26: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/paths-grids", cpAlgo: "https://cp-algorithms.com/sequences/longest_increasing_subseq.html" },
  27: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/silver/greedy-sorting", cpAlgo: "https://cp-algorithms.com/geometry/intersecting_segments.html" },
  28: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/bitwise-ops", cpAlgo: "https://cp-algorithms.com/algebra/all-submasks.html" },
  29: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/purq", cpAlgo: "https://cp-algorithms.com/data_structures/segment_tree.html#lazy-propagation" },
  30: { neetcode: "https://neetcode.io/roadmap", usaco: "https://usaco.guide/gold/dsu", cpAlgo: "https://cp-algorithms.com/data_structures/stack_queue_modification.html" }
};

  const theoryLinks = DAY_THEORY_LINKS[dayNumber] || {
    neetcode: "https://neetcode.io/roadmap",
    usaco: "https://usaco.guide/silver",
    cpAlgo: "https://cp-algorithms.com"
  };

  const linkNeet = document.getElementById("linkNeetcode");
  if (linkNeet) {
    linkNeet.href = theoryLinks.neetcode;
    linkNeet.title = `Open NeetCode Theory Roadmap for Day ${dayNumber}`;
  }
  const linkUsaco = document.getElementById("linkUsaco");
  if (linkUsaco) {
    const usacoRes = (dayData.authoritativeResources || []).find(r => r.url && r.url.includes("usaco.guide") && r.url.length > 25);
    linkUsaco.href = (usacoRes && usacoRes.url) || theoryLinks.usaco;
    linkUsaco.title = `Open USACO Theory Monograph for Day ${dayNumber}`;
  }
  const linkCp = document.getElementById("linkCpAlgo");
  if (linkCp) {
    const cpRes = (dayData.authoritativeResources || []).find(r => r.url && (r.url.includes("cp-algorithms.com") || r.url.includes("codeforces.com") || r.url.includes("brilliant.org")));
    linkCp.href = (cpRes && cpRes.url) || theoryLinks.cpAlgo;
    linkCp.title = `Open Mathematical & Algorithmic Theory for Day ${dayNumber}`;
  }

  renderDailyProblemPills(dayNumber);
  VisualizerEngine.init();
  renderRoadmap();
  
  // Proactively select problem 0 so Step 1 title and portal links ALWAYS match the current day's problem
  selectDailyProblem(0);

  doSwitchDaySubTab(AppState.currentSubTab || "learn");
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
    AppleDialog.alert("Pattern Required", "Please select a pattern or data structure chip first before validating.");
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
  checkTimerLock(() => doJumpToProblemFromRematch(day, problemId));
}

function doJumpToProblemFromRematch(day, problemId) {
  doSwitchView("today");
  doSwitchDay(day);
  doSwitchDaySubTab("solve");

  const dayData = CURRICULUM_DATABASE.find(d => d.day === day);
  const tasks = dayData?.blind75Tasks || [];
  const idx = tasks.findIndex(t => t.id === problemId);
  if (idx !== -1) {
    selectDailyProblem(idx);
  } else {
    selectDailyProblem(0);
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

    let premiumBadge = "";
    if (p.isPremium) {
      premiumBadge = `<span class="apple-diff-pill premium-badge" title="LeetCode Subscription Required">Premium 🔒</span>`;
    }

    const freeRunnerLink = p.freeAlternativeUrl ? `
      <a href="${p.freeAlternativeUrl}" target="_blank" rel="noopener noreferrer" class="matrix-free-runner-link" title="Run online for free on ${p.freeAlternativeName || 'NeetCode'}">
        Free Runner ↗
      </a>
    ` : "";

    const gfgLink = p.gfgUrl ? `
      <a href="${p.gfgUrl}" target="_blank" rel="noopener noreferrer" class="matrix-free-runner-link" title="Run online for free on GeeksforGeeks">
        GFG ↗
      </a>
    ` : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:600;">#${p.id}</td>
      <td>
        <div style="display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--apple-text-primary); text-decoration:none; font-weight:500;">
            ${p.title} ↗
          </a>
          ${premiumBadge}
          ${freeRunnerLink}
          ${gfgLink}
        </div>
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

function updateNavContextElements(viewName) {
  const hamburgerBtn = document.getElementById("btnToggleSidebar");
  const breadcrumb = document.getElementById("globalBreadcrumb");
  const navDivider = document.querySelector(".nav-left .nav-divider");
  const searchTrigger = document.querySelector(".nav-search-trigger");

  const isToday = (viewName === "today");
  if (hamburgerBtn) hamburgerBtn.style.display = isToday ? "inline-flex" : "none";
  if (breadcrumb) breadcrumb.style.display = isToday ? "flex" : "none";
  if (navDivider) navDivider.style.display = isToday ? "block" : "none";

  // Contextual search button: Show on Today and Rematches.
  // Hide on 75 Index (has its own dedicated search bar), Drill (focused test), and Profile (static analytics).
  const showSearch = (viewName === "today" || viewName === "rematch");
  if (searchTrigger) searchTrigger.style.display = showSearch ? "inline-flex" : "none";
}

function switchView(viewName) {
  if (AppState.currentView === viewName) return;
  checkTimerLock(() => doSwitchView(viewName));
}

function doSwitchView(viewName) {
  AppState.currentView = viewName;
  persistState();

  updateNavContextElements(viewName);

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

  const journalModuleHtml = renderJournalModuleHtml();

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

    <!-- Collapsible & Bounded Mistake Journal / Post-Solve Autopsies -->
    ${journalModuleHtml}
  `;
}

// ============================================================================
// COLLAPSIBLE MISTAKE JOURNAL & POST-SOLVE AUTOPSY MODULE
// ============================================================================

let journalLogState = {
  activeFilter: "all",
  searchQuery: "",
  showAll: false
};

function renderJournalModuleHtml() {
  const entries = AppState.mistakeJournal || [];
  const total = entries.length;

  const coldCount = entries.filter(e => e.outcome === "Cold Mastery" || e.outcome === "Optimal Cold" || e.outcome === "cold").length;
  const needReviewCount = entries.filter(e => e.outcome !== "Cold Mastery" && e.outcome !== "Optimal Cold" && e.outcome !== "cold").length;
  const withNotesCount = entries.filter(e => e.note && e.note.trim().length > 0).length;

  return `
    <details class="profile-collapsible-tile" id="profileJournalDetails" open>
      <summary class="profile-journal-header" style="cursor:pointer; list-style:none;">
        <div class="journal-header-title-row">
          <span style="font-size:14px; color:var(--apple-text-muted); transition:transform 0.2s ease;">▾</span>
          <span class="journal-title-text">Post-Solve Autopsies & Mistake Journal</span>
          <span class="apple-diff-pill info" style="font-size:11px;">${total} ${total === 1 ? "Entry" : "Entries"}</span>
        </div>
        <div style="font-size:12px; color:var(--apple-text-secondary);">
          Click to Collapse / Expand
        </div>
      </summary>

      <!-- Filter & Search Controls Bar -->
      <div class="journal-controls-bar">
        <div class="journal-filter-pills" id="journalFilterPills">
          <button class="journal-filter-btn ${journalLogState.activeFilter === "all" ? "active" : ""}" data-filter="all" onclick="filterJournalByOutcome('all')">
            All (${total})
          </button>
          <button class="journal-filter-btn ${journalLogState.activeFilter === "cold" ? "active" : ""}" data-filter="cold" onclick="filterJournalByOutcome('cold')">
            Cold (${coldCount})
          </button>
          <button class="journal-filter-btn ${journalLogState.activeFilter === "review" ? "active" : ""}" data-filter="review" onclick="filterJournalByOutcome('review')">
            Rematches (${needReviewCount})
          </button>
          <button class="journal-filter-btn ${journalLogState.activeFilter === "notes" ? "active" : ""}" data-filter="notes" onclick="filterJournalByOutcome('notes')">
            With Notes (${withNotesCount})
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <input 
            type="text" 
            id="journalSearchInput" 
            class="journal-search-input" 
            placeholder="Search problems or notes..." 
            value="${journalLogState.searchQuery}"
            oninput="filterJournalLog(this.value)"
          />
          <button id="btnJournalDepthToggle" class="apple-pill-btn sm" onclick="toggleJournalDepth()">
            ${journalLogState.showAll ? "Collapse to Recent (5) ▴" : `Show All (${total}) ▾`}
          </button>
        </div>
      </div>

      <!-- Accordion Rows List Container - Max Height Bounded to 440px to prevent infinite scrolling -->
      <div class="journal-accordion-list" id="journalAccordionList">
        ${renderJournalItemsListHtml(entries, 5)}
      </div>
    </details>
  `;
}

function renderJournalItemsListHtml(entries, limit = 5) {
  let filtered = entries;

  if (journalLogState.activeFilter === "cold") {
    filtered = filtered.filter(e => e.outcome === "Cold Mastery" || e.outcome === "Optimal Cold" || e.outcome === "cold");
  } else if (journalLogState.activeFilter === "review") {
    filtered = filtered.filter(e => e.outcome !== "Cold Mastery" && e.outcome !== "Optimal Cold" && e.outcome !== "cold");
  } else if (journalLogState.activeFilter === "notes") {
    filtered = filtered.filter(e => e.note && e.note.trim().length > 0);
  }

  if (journalLogState.searchQuery) {
    const q = journalLogState.searchQuery.toLowerCase();
    filtered = filtered.filter(e => 
      (e.title && e.title.toLowerCase().includes(q)) || 
      (e.problemId && String(e.problemId).includes(q)) || 
      (e.note && e.note.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    return `
      <div style="padding:24px; text-align:center; color:var(--apple-text-muted); font-size:13px;">
        No reflections match the current filter.
      </div>
    `;
  }

  const itemsToRender = (!journalLogState.showAll && limit) ? filtered.slice(0, limit) : filtered;

  return itemsToRender.map((entry, idx) => {
    const isCold = entry.outcome === "Cold Mastery" || entry.outcome === "Optimal Cold" || entry.outcome === "cold";
    const badgeClass = isCold ? "Easy" : (entry.outcome === "Needed Hints" || entry.outcome === "Hint Utilized" ? "Medium" : "Hard");
    const preview = entry.note ? (entry.note.length > 55 ? entry.note.slice(0, 55) + "..." : entry.note) : "Completed with zero hints.";

    return `
      <div class="journal-card-item" id="journalItem_${idx}">
        <div class="journal-item-head" onclick="toggleJournalItemDetails(${idx})">
          <div class="journal-head-left">
            <span class="journal-toggle-arrow" id="journalArrow_${idx}">▸</span>
            <span class="journal-date-badge">${entry.date || "Recent"}</span>
            <span class="journal-prob-title">#${entry.problemId} ${entry.title || ""}</span>
          </div>
          <div class="journal-head-right">
            <span class="journal-preview-snippet">${preview}</span>
            <span class="apple-diff-pill ${badgeClass}">
              ${entry.outcome || "Cold Mastery"}
            </span>
          </div>
        </div>
        <div class="journal-item-body" id="journalBody_${idx}" style="display:none;">
          <div class="journal-note-callout">
            <b>Key Reflection & Boundary Invariant:</b><br/>
            ${entry.note || "Marked as solved cold without custom notes."}
          </div>
          <div class="journal-actions-row">
            <button class="apple-pill-btn sm" onclick="jumpToJournalProblem(${entry.problemId})">
              Open Problem in Workspace ↗
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function toggleJournalItemDetails(idx) {
  const body = document.getElementById(`journalBody_${idx}`);
  const item = document.getElementById(`journalItem_${idx}`);
  if (!body || !item) return;
  const isHidden = body.style.display === "none";
  body.style.display = isHidden ? "flex" : "none";
  if (isHidden) {
    item.classList.add("expanded");
  } else {
    item.classList.remove("expanded");
  }
}

function toggleJournalDepth() {
  journalLogState.showAll = !journalLogState.showAll;
  const listEl = document.getElementById("journalAccordionList");
  const btn = document.getElementById("btnJournalDepthToggle");
  const total = AppState.mistakeJournal ? AppState.mistakeJournal.length : 0;
  if (listEl) {
    listEl.innerHTML = renderJournalItemsListHtml(AppState.mistakeJournal || [], 5);
  }
  if (btn) {
    btn.textContent = journalLogState.showAll ? "Collapse to Recent (5) ▴" : `Show All (${total}) ▾`;
  }
}

function filterJournalByOutcome(filterType) {
  journalLogState.activeFilter = filterType;
  document.querySelectorAll("#journalFilterPills .journal-filter-btn").forEach(btn => {
    if (btn.dataset.filter === filterType) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  const listEl = document.getElementById("journalAccordionList");
  if (listEl) {
    listEl.innerHTML = renderJournalItemsListHtml(AppState.mistakeJournal || [], 5);
  }
}

function filterJournalLog(query) {
  journalLogState.searchQuery = query || "";
  const listEl = document.getElementById("journalAccordionList");
  if (listEl) {
    listEl.innerHTML = renderJournalItemsListHtml(AppState.mistakeJournal || [], 5);
  }
}

function jumpToJournalProblem(problemId) {
  const p = BLIND_75_DATABASE.find(x => x.id === problemId);
  const day = (p && p.dayMapped) || 1;
  switchDay(day, true);
  switchView("today");
  switchDaySubTab("solve");
  const dayData = CURRICULUM_DATABASE.find(d => d.day === day);
  const idx = (dayData && dayData.blind75Tasks) ? dayData.blind75Tasks.findIndex(t => t.id === problemId) : 0;
  if (idx !== -1) {
    selectDailyProblem(idx);
  }
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
  AppleDialog.prompt(
    "Edit Profile Handle",
    "Enter your name or interview handle to personalize your training logs:",
    current,
    (newName) => {
      if (newName && newName.trim().length > 0) {
        AppState.userName = newName.trim();
        persistState();
        if (AppState.currentView === "profile") {
          renderProfileView();
        }
      }
    }
  );
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

function generateAlgorithmBlueprint(dayData) {
  const currentProblem = (dayData && dayData.blind75Tasks && dayData.blind75Tasks[AppState.activeProblemIndex]) || {
    id: 1, title: "Algorithmic Challenge", difficulty: "Medium", leetCodeSlug: "algorithm-challenge"
  };
  const category = dayData?.category || "Core Algorithms";
  const pattern = dayData?.visualizer?.pattern || dayData?.systemDesignLens?.title || "Invariant Loop Traversal";
  const hint1 = dayData?.progressiveHints?.hint1 || "Identify the invariant relation between elements.";
  const hint2 = dayData?.progressiveHints?.hint2 || "Map intermediate states to avoid redundant recalculation.";
  const cleanTitle = currentProblem.title.replace(/[^a-zA-Z0-9]/g, "");

  return `/* ============================================================================
 * ALGORITHM SPECIFICATION & INVARIANT BLUEPRINT
 * Problem #${currentProblem.id}: ${currentProblem.title} [${currentProblem.difficulty}]
 * Paradigm: ${category}
 * Invariant Pattern: ${pattern}
 * ============================================================================
 *
 * 1. PRECONDITIONS & BOUNDARY CONDITIONS:
 *    - Input Domain: Sequence / Matrix / Graph nodes within problem size bounds
 *    - Valid Base: Non-empty collection, size >= 1
 *    - Edge Cases: Empty collection, single element, negative keys, duplicates
 *
 * 2. STATE FORMULATION & LOOP INVARIANTS:
 *    - Loop Invariant:
 *      At the start of each iteration i, the state structure accurately represents
 *      all examined elements in prefix [0 ... i-1].
 *    - State Auxiliary Structure:
 *      Keyed lookup / Dual index pointers / Monotonic stack / Memoized table
 *
 * 3. ALGORITHMIC SPECIFICATION (PSEUDOCODE):
 *    ALGORITHM Solve${cleanTitle}(Input):
 *        // Step A: Guard against trivial edge conditions
 *        IF Input is null OR Length(Input) == 0 THEN
 *            RETURN BaseDefaultValue
 *        END IF
 *
 *        // Step B: Initialize state structures
 *        INITIALIZE stateTracker (e.g. HashTable, TwoPointers, PriorityQueue)
 *
 *        // Step C: Execute invariant-preserving transitions
 *        FOR EACH item AT index i IN Input DO:
 *            targetInvariant = COMPUTE_TARGET_INVARIANT(item)
 *
 *            IF stateTracker.CONTAINS(targetInvariant) THEN
 *                candidateResult = CONSTRUCT_SOLUTION(stateTracker[targetInvariant], i)
 *                RETURN candidateResult
 *            END IF
 *
 *            stateTracker.INSERT(item, i)
 *        END FOR
 *
 *        RETURN UnresolvedSentinel // or optimal accumulated state
 *
 * 4. COMPLEXITY COMMITMENT:
 *    - Time Complexity:  O(N) amortized single-pass scan
 *    - Space Complexity: O(N) auxiliary invariant state
 *
 * 5. COACHING INVARIANT HINTS:
 *    - Primary Hint: "${hint1}"
 *    - Deep Invariant: "${hint2}"
 * ============================================================================ */`;
}

function copyCleanBoilerplateTemplate() {
  const dayData = CURRICULUM_DATABASE.find(d => d.day === AppState.currentDay) || CURRICULUM_DATABASE[0];
  const blueprint = generateAlgorithmBlueprint(dayData);
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(blueprint).then(() => {
      AppleDialog.alert(
        "Algorithm Blueprint Copied",
        "Language-agnostic algorithm specification & invariant blueprint copied to clipboard."
      );
    });
  } else {
    AppleDialog.alert("Algorithm Blueprint", blueprint);
  }
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
      AppleDialog.alert("Data Imported", "Your training progress has been restored successfully.", () => {
        location.reload();
      });
    } catch (err) {
      AppleDialog.alert("Import Failed", "The selected file is not a valid JSON backup file.");
    }
  };
  reader.readAsText(file);
}

function forceReCacheApp() {
  if (typeof caches !== "undefined") {
    caches.delete("algomaster-apple-cache-v1").then(() => {
      AppleDialog.alert("Cache Purged", "Application cache purged. Reloading fresh assets...", () => {
        location.reload();
      });
    });
  } else {
    location.reload();
  }
}

function clearAllProgress() {
  AppleDialog.confirmDialog(
    "Reset All Training Data?",
    "Reset all training progress, cold mastery records, and mistake autopsy logs? This cannot be undone.",
    () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    },
    null,
    { destructive: true, confirmText: "Reset Everything" }
  );
}

// ============================================================================
// COMMAND PALETTE (⌘K) & SHORTCUTS
// ============================================================================

function openCommandPalette() {
  checkTimerLock(() => doOpenCommandPalette());
}

function doOpenCommandPalette() {
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
  // Default strictly to "light" mode by default, then respect user preferences if previously saved
  const theme = saved ? saved : "light";
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

// Curriculum & Blind 75 Full Reconciliation
// Ensures 100% of all 79 problems are mapped into daily tasks with verified URLs & runner alternatives
function reconcileCurriculumAndBlind75() {
  if (typeof BLIND_75_DATABASE === "undefined" || typeof CURRICULUM_DATABASE === "undefined") return;
  CURRICULUM_DATABASE.forEach(dayData => {
    if (!dayData.blind75Tasks) dayData.blind75Tasks = [];
    const existingIds = new Set(dayData.blind75Tasks.map(t => t.id));
    
    // Find all problems in BLIND_75_DATABASE mapped to this day
    const mappedProblems = BLIND_75_DATABASE.filter(p => p.dayMapped === dayData.day);
    mappedProblems.forEach(p => {
      if (!existingIds.has(p.id)) {
        dayData.blind75Tasks.push({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          url: p.leetcodeUrl,
          invariant: p.keyInvariant,
          isPremium: !!p.isPremium,
          freeAlternativeUrl: p.freeAlternativeUrl,
          freeAlternativeName: p.freeAlternativeName,
          gfgUrl: p.gfgUrl || null
        });
        existingIds.add(p.id);
      }
    });

    // Also enrich existing task items with premium and freeAlternativeUrl metadata
    dayData.blind75Tasks.forEach(t => {
      const p = BLIND_75_DATABASE.find(x => x.id === t.id);
      if (p) {
        t.isPremium = !!p.isPremium;
        t.freeAlternativeUrl = p.freeAlternativeUrl;
        t.freeAlternativeName = p.freeAlternativeName;
        if (p.gfgUrl) t.gfgUrl = p.gfgUrl;
      }
    });
  });
}

// ============================================================================
// BOOT LIFECYCLE
// ============================================================================

function bootApp() {
  try {
    initTheme();
    reconcileCurriculumAndBlind75();
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

    // Check URL parameters for deep linking (?day=10, ?view=grind, #day=14)
    if (typeof window !== "undefined" && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const dayParam = urlParams.get("day") || (window.location.hash && window.location.hash.match(/day=(\d+)/) ? window.location.hash.match(/day=(\d+)/)[1] : null);
      if (dayParam) {
        const d = parseInt(dayParam, 10);
        if (d >= 1 && d <= 30) AppState.currentDay = d;
      }
      const viewParam = urlParams.get("view");
      if (viewParam) AppState.currentView = viewParam;
    }

    switchView(AppState.currentView || "today");
    doSwitchDay(AppState.currentDay || 1);
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
