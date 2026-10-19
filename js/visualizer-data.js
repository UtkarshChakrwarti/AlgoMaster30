// ============================================================================
// ALGOMASTER 30 — INTERACTIVE DRY-RUN STATE TRACES (DAYS 1 TO 30)
// Step-by-step visualizer traces for every canonical pattern
// ============================================================================

const VISUALIZER_TRACES = {
 // Day 1: Arrays & Hashing (Two Sum Hash Lookup)
 1: {
 pattern: "Hash Complement Lookup",
 inputDescription: "nums = [2, 7, 11, 15], target = 9",
 type: "hash-complement",
 steps: [
 {
 step: 0,
 indices: { i: 0 },
 currentVal: 2,
 complement: 7,
 hashTable: {},
 invariantStatus: "Holds ",
 action: "Init",
 explanation: "Initialize empty lookup map. Looking for complement = 9 - 2 = 7."
 },
 {
 step: 1,
 indices: { i: 0 },
 currentVal: 2,
 complement: 7,
 hashTable: { 2: 0 },
 invariantStatus: "Holds ",
 action: "Insert Map",
 explanation: "7 is not in map. Store nums[0]=2 with index 0 in map."
 },
 {
 step: 2,
 indices: { i: 1 },
 currentVal: 7,
 complement: 2,
 hashTable: { 2: 0 },
 invariantStatus: "Target Met! ",
 action: "Match Found!",
 explanation: "Complement 9 - 7 = 2 exists in map at index 0! Return [0, 1] in O(1) single pass."
 }
 ]
 },

 // Day 2: Signatures & Frequency Bucketing (Group Anagrams)
 2: {
 pattern: "Canonical Signature Hashing",
 inputDescription: "strs = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']",
 type: "signature-bucket",
 steps: [
 {
 step: 0,
 indices: { i: 0 },
 item: "eat",
 signature: "a1e1t1",
 buckets: {},
 invariantStatus: "Holds ",
 action: "Hash Word",
 explanation: "Word 'eat' generates 26-char frequency key 'a1e1t1'. Create bucket."
 },
 {
 step: 1,
 indices: { i: 1 },
 item: "tea",
 signature: "a1e1t1",
 buckets: { "a1e1t1": ["eat", "tea"] },
 invariantStatus: "Holds ",
 action: "Group Match",
 explanation: "'tea' generates identical signature 'a1e1t1'. Appended to same bucket."
 },
 {
 step: 2,
 indices: { i: 2 },
 item: "tan",
 signature: "a1n1t1",
 buckets: { "a1e1t1": ["eat", "tea"], "a1n1t1": ["tan"] },
 invariantStatus: "Holds ",
 action: "New Bucket",
 explanation: "'tan' has new signature 'a1n1t1'. Allocate new equivalence class."
 },
 {
 step: 3,
 indices: { i: 3 },
 item: "ate",
 signature: "a1e1t1",
 buckets: { "a1e1t1": ["eat", "tea", "ate"], "a1n1t1": ["tan"] },
 invariantStatus: "Holds ",
 action: "Group Match",
 explanation: "'ate' maps to existing signature 'a1e1t1'. Group size is now 3."
 }
 ]
 },

 // Day 3: Set State & Subarray Monotonicity (Longest Consecutive Sequence)
 3: {
 pattern: "Intelligent Set Starting Point",
 inputDescription: "nums = [100, 4, 200, 1, 3, 2]",
 type: "hash-set-streak",
 steps: [
 {
 step: 0,
 indices: { current: 100 },
 hashSet: [1, 2, 3, 4, 100, 200],
 currentStreak: 1,
 maxStreak: 1,
 invariantStatus: "Holds ",
 action: "Check (x - 1)",
 explanation: "100 - 1 = 99 not in set. 100 is a streak origin! Count = 1."
 },
 {
 step: 1,
 indices: { current: 4 },
 hashSet: [1, 2, 3, 4, 100, 200],
 currentStreak: 0,
 maxStreak: 1,
 invariantStatus: "Skip Check",
 action: "Skip Non-Origin",
 explanation: "4 - 1 = 3 exists in set! Skip 4 immediately to maintain O(N) amortized bound."
 },
 {
 step: 2,
 indices: { current: 1 },
 hashSet: [1, 2, 3, 4, 100, 200],
 currentStreak: 4,
 maxStreak: 4,
 invariantStatus: "Streak Extends!",
 action: "Traverse Streak",
 explanation: "1 - 1 = 0 not in set! Origin found. Verify 2, 3, 4 exist. Streak length = 4."
 }
 ]
 },

 // Day 4: Two Pointers / 3Sum
 4: {
 pattern: "Two Pointers Opposing Invariant",
 inputDescription: "nums = [-4, -1, -1, 0, 1, 2], target = 0",
 type: "two-pointers",
 steps: [
 {
 step: 0,
 indices: { i: 0, left: 1, right: 5 },
 pointers: "i=0 (-4), L=1 (-1), R=5 (2)",
 sum: -3,
 invariantStatus: "Sum < 0",
 action: "Shift Left",
 explanation: "-4 + (-1) + 2 = -3 < 0. In a sorted array, moving Left rightwards strictly increases sum."
 },
 {
 step: 1,
 indices: { i: 1, left: 2, right: 5 },
 pointers: "i=1 (-1), L=2 (-1), R=5 (2)",
 sum: 0,
 invariantStatus: "Triplet Found! ",
 action: "Record Match",
 explanation: "-1 + (-1) + 2 = 0! Triplet recorded. Skip duplicate values and advance both L and R."
 },
 {
 step: 2,
 indices: { i: 1, left: 3, right: 4 },
 pointers: "i=1 (-1), L=3 (0), R=4 (1)",
 sum: 0,
 invariantStatus: "Triplet Found! ",
 action: "Record Match",
 explanation: "-1 + 0 + 1 = 0! Second unique triplet discovered without duplicate sorting."
 }
 ]
 },

 // Day 5: Container With Most Water
 5: {
 pattern: "Shrinking Width Greedily Popping Shorter Boundary",
 inputDescription: "heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
 type: "two-pointers-area",
 steps: [
 {
 step: 0,
 indices: { L: 0, R: 8 },
 currentArea: "min(1, 7) * 8 = 8",
 maxArea: 8,
 invariantStatus: "Holds ",
 action: "Advance L",
 explanation: "Height at L (1) < R (7). Shorter line 1 can never produce a larger area with any inner line. Increment L."
 },
 {
 step: 1,
 indices: { L: 1, R: 8 },
 currentArea: "min(8, 7) * 7 = 49",
 maxArea: 49,
 invariantStatus: "Max Area Updated ",
 action: "Advance R",
 explanation: "Height at R (7) < L (8). Area = 49. Advance R leftwards."
 },
 {
 step: 2,
 indices: { L: 1, R: 6 },
 currentArea: "min(8, 8) * 5 = 40",
 maxArea: 49,
 invariantStatus: "Holds ",
 action: "Advance R",
 explanation: "Width decreased to 5. Max remains 49. Continue shrinking until L and R meet."
 }
 ]
 },

 // Day 6: Sliding Window (Longest Substring Without Repeating)
 6: {
 pattern: "Sliding Window Dynamic Contraction",
 inputDescription: "s = 'abcabcbb'",
 type: "sliding-window",
 steps: [
 {
 step: 0,
 indices: { L: 0, R: 2 },
 window: "'abc'",
 charMap: "{a:0, b:1, c:2}",
 maxLen: 3,
 invariantStatus: "Unique Window ",
 action: "Expand Right",
 explanation: "Window [0..2] is 'abc'. All characters unique. Max length = 3."
 },
 {
 step: 1,
 indices: { L: 0, R: 3 },
 window: "'abca'",
 charMap: "Duplicate 'a' detected",
 maxLen: 3,
 invariantStatus: "Violated Warning:",
 action: "Contract Left",
 explanation: "'a' at index 3 was last seen at index 0. Jump L to 0 + 1 = 1 to restore uniqueness."
 },
 {
 step: 2,
 indices: { L: 1, R: 3 },
 window: "'bca'",
 charMap: "{a:3, b:1, c:2}",
 maxLen: 3,
 invariantStatus: "Restored ",
 action: "Update Map",
 explanation: "Window [1..3] is 'bca'. Invariant restored in O(1) amortized pointer movement."
 }
 ]
 },

 // Day 7: Monotonic Stack (Daily Temperatures)
 7: {
 pattern: "Monotonic Decreasing Index Stack",
 inputDescription: "temps = [73, 74, 75, 71, 69, 72, 76, 73]",
 type: "monotonic-stack",
 steps: [
 {
 step: 0,
 indices: { i: 0 },
 stack: [0],
 stackVals: "[73]",
 invariantStatus: "Holds ",
 action: "Push Index 0",
 explanation: "Stack is empty. Push index 0 (val 73). Stack maintains decreasing order."
 },
 {
 step: 1,
 indices: { i: 1 },
 stack: [1],
 stackVals: "[74]",
 popped: "0 (73)",
 invariantStatus: "Popped 0 ",
 action: "Pop & Resolve",
 explanation: "74 > 73. Pop index 0! Warmer temperature found: days waited = 1 - 0 = 1. Push index 1 (74)."
 },
 {
 step: 2,
 indices: { i: 4 },
 stack: [2, 3, 4],
 stackVals: "[75, 71, 69]",
 invariantStatus: "Strictly Decreasing",
 action: "Push 4",
 explanation: "Indices 2, 3, 4 hold values 75 > 71 > 69. Monotonic decreasing invariant strictly holds."
 },
 {
 step: 3,
 indices: { i: 5 },
 stack: [2, 5],
 stackVals: "[75, 72]",
 popped: "4 (69), 3 (71)",
 invariantStatus: "Resolved 2 Elements",
 action: "Cascade Pop",
 explanation: "72 > 69 (wait = 5-4 = 1) and 72 > 71 (wait = 5-3 = 2). Both popped. Stack amortized O(N)."
 }
 ]
 },

 // Day 8: Binary Search (Rotated Sorted Array)
 8: {
 pattern: "Binary Search Sorted Half Invariant",
 inputDescription: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
 type: "binary-search",
 steps: [
 {
 step: 0,
 indices: { low: 0, mid: 3, high: 6 },
 midVal: 7,
 leftHalf: "[4, 5, 6, 7] (Sorted)",
 invariantStatus: "Holds ",
 action: "Examine Left Half",
 explanation: "nums[low]=4 <= nums[mid]=7, so left half is sorted. Target 0 is NOT in [4, 7]. Search right half."
 },
 {
 step: 1,
 indices: { low: 4, mid: 5, high: 6 },
 midVal: 1,
 rightHalf: "[0, 1, 2] (Sorted)",
 invariantStatus: "Holds ",
 action: "Examine Right Half",
 explanation: "low moved to 4. mid=5 (val 1). Target 0 < 1. Adjust high to mid - 1 = 4."
 },
 {
 step: 2,
 indices: { low: 4, mid: 4, high: 4 },
 midVal: 0,
 invariantStatus: "Target Met! ",
 action: "Found",
 explanation: "nums[4] == 0. Match found at index 4 in O(log N) iterations."
 }
 ]
 },

 // Day 9: Binary Search on Answer / Bound Invariants
 9: {
 pattern: "Monotonic Predicate P(x) Bisection",
 inputDescription: "Find minimum speed k to eat piles within h hours",
 type: "binary-search-predicate",
 steps: [
 {
 step: 0,
 indices: { low: 1, high: 30, mid: 15 },
 predicate: "feasible(15) = true",
 invariantStatus: "P(x) Holds ",
 action: "Contract Right",
 explanation: "Speed 15 is feasible. Candidate answer recorded. Discard speed >= 15 to find minimal feasible speed."
 },
 {
 step: 1,
 indices: { low: 1, high: 14, mid: 7 },
 predicate: "feasible(7) = false",
 invariantStatus: "Too Slow Invalid:",
 action: "Advance Left",
 explanation: "Speed 7 exceeds hours limit. All speeds <= 7 are impossible. low = mid + 1 = 8."
 },
 {
 step: 2,
 indices: { low: 8, high: 10, mid: 9 },
 predicate: "feasible(9) = true",
 invariantStatus: "Optimal Frontier ",
 action: "Converge",
 explanation: "Search interval contracts. Monotonic step transition guarantees global minimum."
 }
 ]
 },
 // Day 10: Linked List In-Place Pointer Invariants
 10: {
 pattern: "Three-Pointer Iterative Reversal",
 inputDescription: "head = [1 -> 2 -> 3 -> 4 -> 5 -> null]",
 type: "linked-list",
 listNodes: [
 { id: 1, val: 1 },
 { id: 2, val: 2 },
 { id: 3, val: 3 },
 { id: 4, val: 4 },
 { id: 5, val: 5 }
 ],
 steps: [
 {
 step: 0,
 pointers: { prev: null, curr: 1, next: 2 },
 reversedCount: 0,
 edgesReversed: [],
 action: "Cache next = 2",
 invariantStatus: "Pointers Initialized",
 explanation: "Store curr.next (2) in temporary variable before severing forward pointer."
 },
 {
 step: 1,
 pointers: { prev: null, curr: 1, next: 2 },
 reversedCount: 1,
 edgesReversed: [1],
 action: "curr.next = prev (null)",
 invariantStatus: "Node 1 -> null",
 explanation: "Sever forward edge from 1 to 2; redirect 1 backwards to prev (null)."
 },
 {
 step: 2,
 pointers: { prev: 1, curr: 2, next: 3 },
 reversedCount: 1,
 edgesReversed: [1],
 action: "Advance prev=1, curr=2",
 invariantStatus: "prev heads reversed prefix",
 explanation: "Advance pointers one step forward: prev moves to 1, curr moves to 2, next caches 3."
 },
 {
 step: 3,
 pointers: { prev: 2, curr: 3, next: 4 },
 reversedCount: 2,
 edgesReversed: [1, 2],
 action: "Reverse 2 -> 1",
 invariantStatus: "Prefix 2 -> 1 -> null",
 explanation: "Redirect node 2 to point backwards to node 1. Invariant: prev always heads the reversed list."
 },
 {
 step: 4,
 pointers: { prev: 5, curr: null, next: null },
 reversedCount: 5,
 edgesReversed: [1, 2, 3, 4, 5],
 action: "curr reached null: return prev (5)",
 invariantStatus: "List Fully Inverted! ",
 explanation: "curr reaches null. The entire chain is inverted: 5 -> 4 -> 3 -> 2 -> 1 -> null. Return prev in O(N) time and O(1) space!"
 }
 ]
 },

 // Day 11: Fast & Slow Pointer Floyd Cycle Invariant
 11: {
 pattern: "Floyd Cycle Distance Geometry (Tortoise & Hare)",
 inputDescription: "head = [3 -> 2 -> 0 -> -4 -> (loops to node 2)]",
 type: "floyd-cycle",
 listNodes: [
 { id: 3, val: 3 },
 { id: 2, val: 2, isCycleOrigin: true },
 { id: 0, val: 0 },
 { id: -4, val: -4 }
 ],
 cycleTargetId: 2,
 steps: [
 {
 step: 0,
 pointers: { slow: 3, fast: 3 },
 action: "Init at Head",
 invariantStatus: "Gap = 0",
 explanation: "Both slow and fast pointers initialize at list head (value 3). Fast moves 2x speed of slow."
 },
 {
 step: 1,
 pointers: { slow: 2, fast: 0 },
 action: "Tick 1: slow=2, fast=0",
 invariantStatus: "Fast Enters Cycle",
 explanation: "Slow advances 1 hop to 2. Fast advances 2 hops past 2 into node 0."
 },
 {
 step: 2,
 pointers: { slow: 0, fast: 2 },
 action: "Tick 2: slow=0, fast=2 (looped)",
 invariantStatus: "Relative Distance Decreases by 1",
 explanation: "Slow moves to 0. Fast wraps around the cycle from -4 back to 2. Relative distance modulo C shrinks by 1."
 },
 {
 step: 3,
 pointers: { slow: -4, fast: -4 },
 action: "Intersection Point Met at Node -4!",
 invariantStatus: "Colocated in O(C) ",
 explanation: "Both slow and fast land on node -4 simultaneously! Cycle presence is rigorously proven in O(N)."
 },
 {
 step: 4,
 pointers: { p1: 3, p2: -4 },
 action: "Phase 2: Reset p1 to Head",
 invariantStatus: "Distance from Head = Distance from Intersection",
 explanation: "Reset p1 to head (3), keep p2 at intersection (-4). Walk both at 1 step/tick to locate cycle origin."
 },
 {
 step: 5,
 pointers: { p1: 2, p2: 2 },
 action: "Cycle Entry Point Discovered at Node 2!",
 invariantStatus: "Cycle Head = Node 2 ",
 explanation: "p1 and p2 intersect at node 2! By geometric proof (F = nC - a), node 2 is guaranteed cycle origin."
 }
 ]
 },


 // Day 12: Merge K Sorted Lists Divide & Conquer
 12: {
 pattern: "Min-Heap / Pairwise Divide & Conquer",
 inputDescription: "k = 4 sorted lists of length N",
 type: "k-way-merge",
 steps: [
 {
 step: 0,
 state: "Level 0: 4 lists [L1, L2, L3, L4]",
 invariantStatus: "Depth 0",
 action: "Pairwise Merge",
 explanation: "Merge (L1, L2) -> M1 and (L3, L4) -> M2 in O(N) linear scans."
 },
 {
 step: 1,
 state: "Level 1: 2 lists [M1, M2]",
 invariantStatus: "Depth 1",
 action: "Final Merge",
 explanation: "Merge (M1, M2) -> Final List. Tree depth is log2(k) = 2. Total time O(N * k * log k)."
 }
 ]
 },
 // Day 13: Tree Traversals & Depth Invariants
 13: {
 pattern: "Binary Tree Structural Inversion",
 inputDescription: "root = [4, 2, 7, 1, 3, 6, 9]",
 type: "tree-dfs",
 treeNodes: [
 { id: 1, val: 4, x: 250, y: 35, left: 2, right: 3 },
 { id: 2, val: 2, x: 140, y: 105, left: 4, right: 5 },
 { id: 3, val: 7, x: 360, y: 105, left: 6, right: 7 },
 { id: 4, val: 1, x: 80, y: 175 },
 { id: 5, val: 3, x: 195, y: 175 },
 { id: 6, val: 6, x: 305, y: 175 },
 { id: 7, val: 9, x: 420, y: 175 }
 ],
 steps: [
 {
 step: 0,
 activeNodeId: 1,
 action: "Visit Root (4)",
 invariantStatus: "Pre-order Inversion",
 explanation: "Begin recursive inversion at root 4. Prepare to swap left subtree (2) and right subtree (7)."
 },
 {
 step: 1,
 activeNodeId: 2,
 swappedPair: [4, 5],
 highlightEdges: [[2, 4], [2, 5]],
 action: "Swap Leaves of Node 2 (1 to 3)",
 invariantStatus: "Node 2 Inverted",
 explanation: "Recursively invert node 2's children: child 1 and child 3 swap positions."
 },
 {
 step: 2,
 activeNodeId: 3,
 swappedPair: [6, 7],
 highlightEdges: [[3, 6], [3, 7]],
 action: "Swap Leaves of Node 3 (6 to 9)",
 invariantStatus: "Node 3 Inverted",
 explanation: "Recursively invert node 3's children: child 6 and child 9 swap positions."
 },
 {
 step: 3,
 activeNodeId: 1,
 swappedPair: [2, 3],
 highlightEdges: [[1, 2], [1, 3]],
 action: "Swap Subtrees of Root (2 to 7)",
 invariantStatus: "Full Tree Inverted! ",
 explanation: "Swap root's left subtree (now headed by 7) and right subtree (headed by 2). Inversion complete in O(N)."
 }
 ]
 },

 // Day 14: BST Validation Range Bounds
 14: {
 pattern: "Propagating Open Invariant Bounds (low, high)",
 inputDescription: "root = [5, 1, 4, null, null, 3, 6]",
 type: "bst-bounds",
 treeNodes: [
 { id: 1, val: 5, x: 250, y: 35, left: 2, right: 3 },
 { id: 2, val: 1, x: 140, y: 105 },
 { id: 3, val: 4, x: 360, y: 105, left: 4, right: 5 },
 { id: 4, val: 3, x: 305, y: 175 },
 { id: 5, val: 6, x: 415, y: 175 }
 ],
 steps: [
 {
 step: 0,
 activeNodeId: 1,
 bounds: { 1: "(-inf, +inf)" },
 status: "valid",
 action: "Validate Root 5",
 invariantStatus: "Valid in (-inf, +inf)",
 explanation: "Root 5 is valid. Propagate left bound: (-inf, 5). Propagate right bound: (5, +inf)."
 },
 {
 step: 1,
 activeNodeId: 2,
 bounds: { 2: "(-inf, 5)" },
 status: "valid",
 highlightEdges: [[1, 2]],
 action: "Validate Left Child 1",
 invariantStatus: "1 < 5 (Valid)",
 explanation: "Node 1 satisfies strictly less than 5. Left subtree is a mathematically valid BST."
 },
 {
 step: 2,
 activeNodeId: 3,
 bounds: { 3: "(5, +inf)" },
 status: "violation",
 violationNodeId: 3,
 highlightEdges: [[1, 3]],
 action: "Inspect Right Child 4 in (5, +inf)",
 invariantStatus: "4 <= 5 (BST VIOLATION!) ",
 explanation: "Node value 4 <= lower bound 5! BST invariant violated in right subtree. Immediately return false in O(N)."
 }
 ]
 },

 // Day 15: Lowest Common Ancestor
 15: {
 pattern: "LCA Bifurcation Split Point",
 inputDescription: "BST root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 8",
 type: "bst-lca",
 treeNodes: [
 { id: 1, val: 6, x: 250, y: 35, left: 2, right: 3 },
 { id: 2, val: 2, x: 140, y: 105, left: 4, right: 5, isP: true },
 { id: 3, val: 8, x: 360, y: 105, left: 6, right: 7, isQ: true },
 { id: 4, val: 0, x: 80, y: 175 },
 { id: 5, val: 4, x: 195, y: 175 },
 { id: 6, val: 7, x: 305, y: 175 },
 { id: 7, val: 9, x: 420, y: 175 }
 ],
 steps: [
 {
 step: 0,
 activeNodeId: 1,
 lcaNodeId: 1,
 highlightEdges: [[1, 2], [1, 3]],
 action: "Inspect Root (6) against p=2, q=8",
 invariantStatus: "p < 6 < q (Bifurcation Point!) ",
 explanation: "Since p=2 < 6 and q=8 > 6, one target lies in the left subtree and one lies in the right subtree. Node 6 is the unique LCA!"
 }
 ]
 },

 // Day 16: Binary Tree Max Path Sum
 16: {
 pattern: "Branch Gain vs Combined Diameter Path",
 inputDescription: "root = [-10, 9, 20, null, null, 15, 7]",
 type: "tree-path-sum",
 treeNodes: [
 { id: 1, val: -10, x: 250, y: 40, left: 2, right: 3 },
 { id: 2, val: 9, x: 130, y: 115 },
 { id: 3, val: 20, x: 360, y: 115, left: 4, right: 5 },
 { id: 4, val: 15, x: 295, y: 185 },
 { id: 5, val: 7, x: 420, y: 185 }
 ],
 steps: [
 {
 step: 0,
 activeNodeId: 3,
 pathNodes: [4, 3, 5],
 highlightEdges: [[3, 4], [3, 5]],
 action: "Evaluate Node 20 Subtree",
 invariantStatus: "Local Path = 15 + 20 + 7 = 42 ",
 explanation: "Leaves 15 and 7 contribute positive gains. Max path through node 20 is 15 + 20 + 7 = 42. Return max branch 20 + 15 = 35 up to root."
 },
 {
 step: 1,
 activeNodeId: 1,
 pathNodes: [4, 3, 5],
 highlightEdges: [[3, 4], [3, 5]],
 action: "Evaluate Root -10",
 invariantStatus: "Global Max Holds at 42 ",
 explanation: "Path through root -10 yields -10 + 9 + 35 = 34, which is less than 42. Global maximum remains 42!"
 }
 ]
 },

 // Day 17: Trie Prefix Insertion
 17: {
 pattern: "Prefix Tree Deterministic Transitions",
 inputDescription: "Insert 'apple', Query prefix 'app'",
 type: "trie",
 trieNodes: [
 { id: "root", val: "•", x: 250, y: 25 },
 { id: "a", val: "a", x: 250, y: 70, parent: "root" },
 { id: "p1", val: "p", x: 250, y: 115, parent: "a" },
 { id: "p2", val: "p", x: 250, y: 160, parent: "p1", isWord: true },
 { id: "l", val: "l", x: 250, y: 205, parent: "p2" },
 { id: "e", val: "e", x: 250, y: 250, parent: "l", isWord: true }
 ],
 steps: [
 {
 step: 0,
 activeNodeId: "e",
 path: ["root", "a", "p1", "p2", "l", "e"],
 action: "Insert 'apple'",
 invariantStatus: "Word 'apple' Stored (isEnd=true)",
 explanation: "Traverse letters a -> p -> p -> l -> e. Mark terminal node 'e' as isEndOfWord = true."
 },
 {
 step: 1,
 activeNodeId: "p2",
 path: ["root", "a", "p1", "p2"],
 action: "startsWith('app')",
 invariantStatus: "Prefix 'app' Verified in O(L) ",
 explanation: "Follow edges 'a' -> 'p' -> 'p'. Reaches valid node 'p2'. Prefix exists! Return true in O(L) time."
 }
 ]
 },

 // Day 18: Two-Heap Running Median
 18: {
 pattern: "Balanced Dual Heaps (Max-Heap + Min-Heap)",
 inputDescription: "Stream: [5, 15, 1, 3]",
 type: "two-heaps",
 steps: [
 {
 step: 0,
 leftMaxHeap: [5],
 rightMinHeap: [],
 median: 5.0,
 formula: "Odd Count: Median = maxHeap.top() = 5.0",
 action: "Insert 5",
 invariantStatus: "Size: 1 vs 0 (Balanced)",
 explanation: "First element goes to max-heap (lower 50%). Median is top of max-heap = 5."
 },
 {
 step: 1,
 leftMaxHeap: [5],
 rightMinHeap: [15],
 median: 10.0,
 formula: "Even Count: (5 + 15) / 2 = 10.0",
 action: "Insert 15",
 invariantStatus: "Size: 1 vs 1 (Balanced)",
 explanation: "15 > 5, pushed to min-heap (upper 50%). Both heaps size 1. Median = (5 + 15) / 2 = 10.0."
 },
 {
 step: 2,
 leftMaxHeap: [3, 1],
 rightMinHeap: [5, 15],
 median: 4.0,
 formula: "Even Count: (3 + 5) / 2 = 4.0",
 action: "Insert 1 and 3",
 invariantStatus: "Balanced: 2 vs 2 ",
 explanation: "Heap balance invariant maintained: maxHeap.size == minHeap.size. Median = (3 + 5) / 2 = 4.0 in O(1) query time."
 }
 ]
 },


 // Day 19: Backtracking State-Space
 19: {
 pattern: "Pruned Decision Tree Exploration",
 inputDescription: "candidates = [2, 3, 6, 7], target = 7",
 type: "backtracking",
 steps: [
 {
 step: 0,
 path: "[2, 2, 2]",
 rem: 1,
 invariantStatus: "Dead End Invalid:",
 action: "Backtrack",
 explanation: "Remaining target 1 < candidate 2. Prune subtree and pop 2."
 },
 {
 step: 1,
 path: "[2, 2, 3]",
 rem: 0,
 invariantStatus: "Solution Recorded! ",
 action: "Save Combination",
 explanation: "Remaining target == 0. Found combination [2, 2, 3]! Backtrack."
 },
 {
 step: 2,
 path: "[7]",
 rem: 0,
 invariantStatus: "Solution Recorded! ",
 action: "Save Combination",
 explanation: "Single element 7 reaches target. Total solutions: [[2, 2, 3], [7]]."
 }
 ]
 },

  // Day 20: Word Search Backtracking Grid Visited Bitmask
  20: {
    pattern: "In-Place Grid Visited Marker",
    inputDescription: "board 3x4, word = 'ABCCED'",
    type: "grid-backtrack",
    targetWord: "ABCCED",
    boardDimensions: { rows: 3, cols: 4 },
    steps: [
      {
        step: 0,
        pos: "(r=0, c=0)",
        char: "A",
        activeCell: [0, 0],
        matchedCount: 1,
        board: [
          ["#", "B", "C", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        action: "board[0][0] = '#'",
        invariantStatus: "Visited Marked (#)",
        explanation: "Cell (0,0) matches word[0] ('A'). Mutate in-place to '#' to prevent cyclic re-visitation with O(1) extra space."
      },
      {
        step: 1,
        pos: "(r=0, c=1)",
        char: "B",
        activeCell: [0, 1],
        matchedCount: 2,
        board: [
          ["#", "#", "C", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        action: "board[0][1] = '#'",
        invariantStatus: "Visited Marked (#)",
        explanation: "Branch right to (0,1). Matches word[1] ('B'). Mutate in-place to '#' and recurse into neighbors."
      },
      {
        step: 2,
        pos: "(r=0, c=2)",
        char: "C",
        activeCell: [0, 2],
        matchedCount: 3,
        board: [
          ["#", "#", "#", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        action: "board[0][2] = '#'",
        invariantStatus: "Visited Marked (#)",
        explanation: "Branch right to (0,2). Matches word[2] ('C'). Mutate in-place to '#' and search down."
      },
      {
        step: 3,
        pos: "(r=1, c=2)",
        char: "C",
        activeCell: [1, 2],
        matchedCount: 4,
        board: [
          ["#", "#", "#", "E"],
          ["S", "F", "#", "S"],
          ["A", "D", "E", "E"]
        ],
        action: "board[1][2] = '#'",
        invariantStatus: "Visited Marked (#)",
        explanation: "Branch down to (1,2). Matches word[3] ('C'). Mutate in-place to '#' and continue DFS."
      },
      {
        step: 4,
        pos: "(r=2, c=2)",
        char: "E",
        activeCell: [2, 2],
        matchedCount: 5,
        board: [
          ["#", "#", "#", "E"],
          ["S", "F", "#", "S"],
          ["A", "D", "#", "E"]
        ],
        action: "board[2][2] = '#'",
        invariantStatus: "Visited Marked (#)",
        explanation: "Branch down to (2,2). Matches word[4] ('E'). Mutate in-place to '#' and branch left."
      },
      {
        step: 5,
        pos: "(r=2, c=1)",
        char: "D",
        activeCell: [2, 1],
        matchedCount: 6,
        board: [
          ["#", "#", "#", "E"],
          ["S", "F", "#", "S"],
          ["A", "#", "#", "E"]
        ],
        action: "Word 'ABCCED' Found",
        invariantStatus: "Target Matched (100%)",
        explanation: "Branch left to (2,1). Final letter 'D' matches. Complete 6-letter contiguous path verified."
      },
      {
        step: 6,
        pos: "Unwind Post-Order",
        char: "A",
        activeCell: null,
        matchedCount: 6,
        board: [
          ["A", "B", "C", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        action: "board[r][c] = origChar",
        invariantStatus: "Backtracked Cleanly",
        explanation: "Post-order backtrack restores all '#' mutations back to original characters, leaving board unmodified."
      }
    ]
  },
 // Day 21: Island Flood-Fill BFS / DFS
 21: {
 pattern: "Connected Component In-Place Sinking Invariant",
 inputDescription: "grid = 4x5 binary land matrix ('1'=land, '0'=water)",
 type: "grid-backtrack",
 targetWord: "ISLANDS",
 steps: [
 {
 step: 0,
 board: [
 ["1", "1", "0", "0", "0"],
 ["1", "1", "0", "0", "0"],
 ["0", "0", "1", "0", "0"],
 ["0", "0", "0", "1", "1"]
 ],
 activeCell: [0, 0],
 matchedCount: 1,
 islandCount: 1,
 action: "Encounter Land at (0, 0)",
 invariantStatus: "New Island #1 Discovered",
 explanation: "Outer scan finds unvisited land cell (0, 0). Increment island count to 1 and launch flood-fill."
 },
 {
 step: 1,
 board: [
 ["#", "#", "0", "0", "0"],
 ["#", "#", "0", "0", "0"],
 ["0", "0", "1", "0", "0"],
 ["0", "0", "0", "1", "1"]
 ],
 activeCell: [1, 1],
 matchedCount: 4,
 islandCount: 1,
 action: "Flood-Fill Sink Island #1 to '#'",
 invariantStatus: "Component Sunk In-Place",
 explanation: "Traverse and sink all 4 adjacent cells of Island #1 to '#' in O(size) without extra memory."
 },
 {
 step: 2,
 board: [
 ["#", "#", "0", "0", "0"],
 ["#", "#", "0", "0", "0"],
 ["0", "0", "#", "0", "0"],
 ["0", "0", "0", "1", "1"]
 ],
 activeCell: [2, 2],
 matchedCount: 5,
 islandCount: 2,
 action: "Encounter Isolated Land at (2, 2)",
 invariantStatus: "New Island #2 Discovered & Sunk",
 explanation: "Scan resumes and discovers single-cell Island #2 at (2, 2). Sinks it to '#' in O(1)."
 },
 {
 step: 3,
 board: [
 ["#", "#", "0", "0", "0"],
 ["#", "#", "0", "0", "0"],
 ["0", "0", "#", "0", "0"],
 ["0", "0", "0", "#", "#"]
 ],
 activeCell: [3, 4],
 matchedCount: 7,
 islandCount: 3,
 action: "Sink Final Island #3",
 invariantStatus: "All 3 Islands Counted! ",
 explanation: "Island #3 sunk. Entire grid scanned in exact O(R * C) time with 0 extra memory. Total Islands = 3."
 }
 ]
 },

 // Day 22: Topological Sort Kahn's Algorithm Indegrees
 22: {
 pattern: "Kahn's Zero-Indegree Queue Invariant",
 inputDescription: "numCourses = 4, prerequisites = [[1, 3], [2, 3], [0, 1], [0, 2]]",
 type: "topo-sort",
 graphNodes: [
 { id: 3, label: "3: CS100", x: 80, y: 110 },
 { id: 1, label: "1: CS101", x: 220, y: 55 },
 { id: 2, label: "2: CS102", x: 220, y: 165 },
 { id: 0, label: "0: AI Algorithms", x: 380, y: 110 }
 ],
 graphEdges: [
 { from: 3, to: 1 },
 { from: 3, to: 2 },
 { from: 1, to: 0 },
 { from: 2, to: 0 }
 ],
 steps: [
 {
 step: 0,
 indegrees: { 3: 0, 1: 1, 2: 1, 0: 2 },
 queue: [3],
 activeNodeId: 3,
 action: "Enqueue In-degree 0: Course 3",
 invariantStatus: "Initial Queue: [3]",
 explanation: "Course 3 has no prerequisites (in-degree 0). Ready to process first."
 },
 {
 step: 1,
 indegrees: { 3: 0, 1: 0, 2: 0, 0: 2 },
 queue: [1, 2],
 activeNodeId: 3,
 processed: [3],
 activeEdges: [{ from: 3, to: 1 }, { from: 3, to: 2 }],
 action: "Process Course 3: Outgoing Edges Removed",
 invariantStatus: "In-degrees of 1 and 2 become 0",
 explanation: "Pop 3. Decrement in-degrees of successors: course 1 drops to 0, course 2 drops to 0. Enqueue [1, 2]."
 },
 {
 step: 2,
 indegrees: { 3: 0, 1: 0, 2: 0, 0: 0 },
 queue: [0],
 processed: [3, 1, 2],
 activeEdges: [{ from: 1, to: 0 }, { from: 2, to: 0 }],
 action: "Process Courses 1 & 2: Course 0 Prereqs Met",
 invariantStatus: "Course 0 Enqueued",
 explanation: "Pop 1 and 2. Their outgoing edges resolve. Course 0 in-degree drops to 0. Enqueue [0]."
 },
 {
 step: 3,
 indegrees: { 3: 0, 1: 0, 2: 0, 0: 0 },
 queue: [],
 processed: [3, 1, 2, 0],
 action: "Process Course 0: DAG Fully Resolved!",
 invariantStatus: "Valid Schedule Found! ",
 explanation: "All 4 courses successfully scheduled in topological order [3, 1, 2, 0]. Zero directed cycles found!"
 }
 ]
 },


 // Day 23: Disjoint Set Union (DSU) Union by Rank
 23: {
 pattern: "Path Compression & Rank Tree Flattening",
 inputDescription: "Components: 5 nodes, edges: (0,1), (1,2), (3,4)",
 type: "dsu",
 steps: [
 {
 step: 0,
 action: "union(0, 1)",
 parents: "{0: 0, 1: 0, 2: 2, 3: 3, 4: 4}",
 components: 4,
 invariantStatus: "Holds ",
 explanation: "Node 1 attached to representative 0. Component count decrements to 4."
 },
 {
 step: 1,
 action: "find(2)",
 parents: "2 -> 1 -> 0 flattens to 2 -> 0",
 invariantStatus: "Path Compressed ",
 explanation: "Recursive find attaches 2 directly to root 0. Inverse Ackermann O(alpha(N)) speed."
 }
 ]
 },

 // Day 24: Dijkstra Shortest Path Min-Heap Relaxation
 24: {
 pattern: "Greedy Frontier Min-Distance Relaxation",
 inputDescription: "Graph with non-negative edge weights",
 type: "dijkstra",
 steps: [
 {
 step: 0,
 dist: "{start: 0, others: inf}",
 minHeap: "[(0, start)]",
 invariantStatus: "Holds ",
 action: "Pop Minimal",
 explanation: "Smallest unfinalized distance is extracted from min-heap."
 },
 {
 step: 1,
 action: "Relax Neighbor v",
 condition: "dist[u] + weight < dist[v]",
 invariantStatus: "Distance Shortened",
 explanation: "Discovered shorter path to v. Update dist[v] and push to heap."
 }
 ]
 },

 // Day 25: 1D Dynamic Programming (Coin Change)
 25: {
 pattern: "Optimal Substructure Bottom-Up Tabulation",
 inputDescription: "coins = [1, 2, 5], amount = 11",
 type: "dp-1d",
 steps: [
 {
 step: 0,
 dp: "dp[0] = 0, dp[1..11] = inf",
 invariantStatus: "Base Case",
 action: "Init",
 explanation: "0 coins needed to make amount 0. All other amounts initialized to infinity."
 },
 {
 step: 1,
 amount: 5,
 transition: "min(dp[5-1]+1, dp[5-2]+1, dp[5-5]+1) = 0 + 1 = 1",
 dpVal: "dp[5] = 1",
 invariantStatus: "Subproblem Solved",
 action: "Update dp[5]",
 explanation: "Coin 5 directly yields amount 5 with 1 coin."
 },
 {
 step: 2,
 amount: 11,
 transition: "dp[11 - 5] + 1 = dp[6] + 1 = 2 + 1 = 3",
 dpVal: "dp[11] = 3",
 invariantStatus: "Optimal Answer: 3 Coins ",
 action: "Finished",
 explanation: "Optimal combination: 5 + 5 + 1 = 3 coins. Complexity O(N * Amount)."
 }
 ]
 },

 // Day 26: Longest Increasing Subsequence Patience Sorting
 26: {
 pattern: "Patience Sorting Binary Search Tails",
 inputDescription: "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
 type: "lis-patience",
 steps: [
 {
 step: 0,
 tails: "[2]",
 invariantStatus: "Holds ",
 action: "Place 2",
 explanation: "Smallest tail for LIS of length 1 is 2."
 },
 {
 step: 1,
 tails: "[2, 3]",
 num: 3,
 invariantStatus: "Extends Length",
 action: "Binary Search",
 explanation: "3 > 2. Extends LIS to length 2. tails[1] = 3."
 },
 {
 step: 2,
 tails: "[2, 3, 7, 18]",
 length: 4,
 invariantStatus: "LIS Length = 4 ",
 action: "Finished",
 explanation: "Tails length is 4. LIS is [2, 3, 7, 18] in O(N log N) time."
 }
 ]
 },

 // Day 27: 2D Grid DP (Unique Paths)
 27: {
 pattern: "Top + Left Additive State Transition",
 inputDescription: "grid 3x3",
 type: "dp-2d",
 steps: [
 {
 step: 0,
 state: "First row & first col initialized to 1",
 invariantStatus: "Border Invariant",
 action: "Init",
 explanation: "Only 1 way to reach border cells (straight right or straight down)."
 },
 {
 step: 1,
 cell: "(1, 1)",
 transition: "dp[1][0] + dp[0][1] = 1 + 1 = 2",
 invariantStatus: "Holds ",
 action: "Sum Paths",
 explanation: "Paths from top (1) + paths from left (1) = 2 ways to reach (1, 1)."
 },
 {
 step: 2,
 cell: "(2, 2)",
 transition: "dp[1][2] + dp[2][1] = 3 + 3 = 6",
 invariantStatus: "Total Paths: 6 ",
 action: "Finished",
 explanation: "Bottom-right cell reached in 6 unique paths."
 }
 ]
 },

 // Day 28: Interval Sweep-Line Overlap Detection
 28: {
 pattern: "Interval Sorting by Start Time",
 inputDescription: "intervals = [[1,3], [2,6], [8,10], [15,18]]",
 type: "intervals",
 steps: [
 {
 step: 0,
 curr: "[1, 3]",
 merged: "[[1, 3]]",
 invariantStatus: "Holds ",
 action: "First Interval",
 explanation: "Sort by start time. Initialize merged list with [1, 3]."
 },
 {
 step: 1,
 next: "[2, 6]",
 overlap: "2 <= 3",
 merged: "[[1, max(3, 6)]] -> [[1, 6]]",
 invariantStatus: "Overlap Merged ",
 action: "Merge",
 explanation: "Start time 2 <= current end time 3. Overlap detected. Expand end to 6."
 },
 {
 step: 2,
 next: "[8, 10]",
 overlap: "8 > 6 (No overlap)",
 merged: "[[1, 6], [8, 10]]",
 invariantStatus: "Disjoint Interval",
 action: "Append",
 explanation: "No overlap. Append [8, 10] as a distinct non-overlapping segment."
 }
 ]
 },

 // Day 29: Bit Manipulation Counting Bits (Kernighan Trick)
 29: {
 pattern: "Lowest Set-Bit Clearing x & (x - 1)",
 inputDescription: "n = 12 (binary 1100)",
 type: "bit-manipulation",
 steps: [
 {
 step: 0,
 x: "12 (1100_2)",
 action: "Init",
 count: 0,
 invariantStatus: "Holds ",
 explanation: "Initial integer 12 has 2 set bits."
 },
 {
 step: 1,
 operation: "12 & 11 = 1100_2 & 1011_2 = 1000_2 (8)",
 count: 1,
 invariantStatus: "Bit Cleared",
 action: "Clear Lowest Bit",
 explanation: "x & (x - 1) clears lowest set bit at index 2 in O(1) clock cycle."
 },
 {
 step: 2,
 operation: "8 & 7 = 1000_2 & 0111_2 = 0000_2 (0)",
 count: 2,
 invariantStatus: "Done ",
 action: "Zero Reached",
 explanation: "Second set bit cleared. Number is 0. Total set bits = 2."
 }
 ]
 },

 // Day 30: Range Queries / Fenwick Tree Binary Indexing
 30: {
 pattern: "Least Significant Bit (LSB) Isolation i & (-i)",
 inputDescription: "Query sum [1..7] via Fenwick Tree",
 type: "fenwick-tree",
 steps: [
 {
 step: 0,
 index: "7 (0111_2)",
 lsb: "7 & -7 = 1",
 accumulated: "tree[7]",
 nextIndex: "7 - 1 = 6",
 invariantStatus: "Holds ",
 action: "Add tree[7]",
 explanation: "Isolate LSB = 1. Add tree[7], transition to parent index 6."
 },
 {
 step: 1,
 index: "6 (0110_2)",
 lsb: "6 & -6 = 2",
 accumulated: "tree[7] + tree[6]",
 nextIndex: "6 - 2 = 4",
 invariantStatus: "Holds ",
 action: "Add tree[6]",
 explanation: "Isolate LSB = 2. Add tree[6], transition to parent index 4."
 },
 {
 step: 2,
 index: "4 (0100_2)",
 lsb: "4 & -4 = 4",
 accumulated: "tree[7] + tree[6] + tree[4]",
 nextIndex: "4 - 4 = 0",
 invariantStatus: "Prefix Sum Computed! ",
 action: "Finished",
 explanation: "Index becomes 0. Prefix sum for 7 elements computed in exactly 3 steps (log2 N)."
 }
 ]
 }
};

if (typeof module !== 'undefined') {
 module.exports = { VISUALIZER_TRACES };
}
