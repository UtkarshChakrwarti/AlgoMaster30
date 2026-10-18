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
        invariantStatus: "Holds ✓",
        action: "Init",
        explanation: "Initialize empty lookup map. Looking for complement = 9 - 2 = 7."
      },
      {
        step: 1,
        indices: { i: 0 },
        currentVal: 2,
        complement: 7,
        hashTable: { 2: 0 },
        invariantStatus: "Holds ✓",
        action: "Insert Map",
        explanation: "7 is not in map. Store nums[0]=2 with index 0 in map."
      },
      {
        step: 2,
        indices: { i: 1 },
        currentVal: 7,
        complement: 2,
        hashTable: { 2: 0 },
        invariantStatus: "Target Met! 🎯",
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
        invariantStatus: "Holds ✓",
        action: "Hash Word",
        explanation: "Word 'eat' generates 26-char frequency key 'a1e1t1'. Create bucket."
      },
      {
        step: 1,
        indices: { i: 1 },
        item: "tea",
        signature: "a1e1t1",
        buckets: { "a1e1t1": ["eat", "tea"] },
        invariantStatus: "Holds ✓",
        action: "Group Match",
        explanation: "'tea' generates identical signature 'a1e1t1'. Appended to same bucket."
      },
      {
        step: 2,
        indices: { i: 2 },
        item: "tan",
        signature: "a1n1t1",
        buckets: { "a1e1t1": ["eat", "tea"], "a1n1t1": ["tan"] },
        invariantStatus: "Holds ✓",
        action: "New Bucket",
        explanation: "'tan' has new signature 'a1n1t1'. Allocate new equivalence class."
      },
      {
        step: 3,
        indices: { i: 3 },
        item: "ate",
        signature: "a1e1t1",
        buckets: { "a1e1t1": ["eat", "tea", "ate"], "a1n1t1": ["tan"] },
        invariantStatus: "Holds ✓",
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
        invariantStatus: "Holds ✓",
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
        invariantStatus: "Triplet Found! 🎯",
        action: "Record Match",
        explanation: "-1 + (-1) + 2 = 0! Triplet recorded. Skip duplicate values and advance both L and R."
      },
      {
        step: 2,
        indices: { i: 1, left: 3, right: 4 },
        pointers: "i=1 (-1), L=3 (0), R=4 (1)",
        sum: 0,
        invariantStatus: "Triplet Found! 🎯",
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
        invariantStatus: "Holds ✓",
        action: "Advance L",
        explanation: "Height at L (1) < R (7). Shorter line 1 can never produce a larger area with any inner line. Increment L."
      },
      {
        step: 1,
        indices: { L: 1, R: 8 },
        currentArea: "min(8, 7) * 7 = 49",
        maxArea: 49,
        invariantStatus: "Max Area Updated ⚡",
        action: "Advance R",
        explanation: "Height at R (7) < L (8). Area = 49. Advance R leftwards."
      },
      {
        step: 2,
        indices: { L: 1, R: 6 },
        currentArea: "min(8, 8) * 5 = 40",
        maxArea: 49,
        invariantStatus: "Holds ✓",
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
        invariantStatus: "Unique Window ✓",
        action: "Expand Right",
        explanation: "Window [0..2] is 'abc'. All characters unique. Max length = 3."
      },
      {
        step: 1,
        indices: { L: 0, R: 3 },
        window: "'abca'",
        charMap: "Duplicate 'a' detected",
        maxLen: 3,
        invariantStatus: "Violated ⚠",
        action: "Contract Left",
        explanation: "'a' at index 3 was last seen at index 0. Jump L to 0 + 1 = 1 to restore uniqueness."
      },
      {
        step: 2,
        indices: { L: 1, R: 3 },
        window: "'bca'",
        charMap: "{a:3, b:1, c:2}",
        maxLen: 3,
        invariantStatus: "Restored ✓",
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
        invariantStatus: "Holds ✓",
        action: "Push Index 0",
        explanation: "Stack is empty. Push index 0 (val 73). Stack maintains decreasing order."
      },
      {
        step: 1,
        indices: { i: 1 },
        stack: [1],
        stackVals: "[74]",
        popped: "0 (73)",
        invariantStatus: "Popped 0 ✓",
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
        invariantStatus: "Holds ✓",
        action: "Examine Left Half",
        explanation: "nums[low]=4 <= nums[mid]=7, so left half is sorted. Target 0 is NOT in [4, 7]. Search right half."
      },
      {
        step: 1,
        indices: { low: 4, mid: 5, high: 6 },
        midVal: 1,
        rightHalf: "[0, 1, 2] (Sorted)",
        invariantStatus: "Holds ✓",
        action: "Examine Right Half",
        explanation: "low moved to 4. mid=5 (val 1). Target 0 < 1. Adjust high to mid - 1 = 4."
      },
      {
        step: 2,
        indices: { low: 4, mid: 4, high: 4 },
        midVal: 0,
        invariantStatus: "Target Met! 🎯",
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
        invariantStatus: "P(x) Holds ✓",
        action: "Contract Right",
        explanation: "Speed 15 is feasible. Candidate answer recorded. Discard speed >= 15 to find minimal feasible speed."
      },
      {
        step: 1,
        indices: { low: 1, high: 14, mid: 7 },
        predicate: "feasible(7) = false",
        invariantStatus: "Too Slow ✗",
        action: "Advance Left",
        explanation: "Speed 7 exceeds hours limit. All speeds <= 7 are impossible. low = mid + 1 = 8."
      },
      {
        step: 2,
        indices: { low: 8, high: 10, mid: 9 },
        predicate: "feasible(9) = true",
        invariantStatus: "Optimal Frontier 🎯",
        action: "Converge",
        explanation: "Search interval contracts. Monotonic step transition guarantees global minimum."
      }
    ]
  },

  // Day 10: Linked List In-Place Pointer Invariants
  10: {
    pattern: "Three-Pointer Iterative Reversal",
    inputDescription: "1 -> 2 -> 3 -> 4 -> null",
    type: "linked-list",
    steps: [
      {
        step: 0,
        pointers: "prev = null, curr = 1, next = 2",
        invariantStatus: "Holds ✓",
        action: "Cache next",
        explanation: "Store curr.next (2). Ready to sever forward pointer."
      },
      {
        step: 1,
        pointers: "curr.next = prev (null), prev = 1, curr = 2",
        invariantStatus: "Reversed 1 Node ✓",
        action: "Advance Prev & Curr",
        explanation: "1 now points back to null. prev advances to 1, curr advances to 2."
      },
      {
        step: 2,
        pointers: "2 -> 1 -> null, prev = 2, curr = 3",
        invariantStatus: "Reversed 2 Nodes ✓",
        action: "Advance",
        explanation: "2 points back to 1. Invariant: prev always heads the reversed prefix."
      }
    ]
  },

  // Day 11: Fast & Slow Pointer Floyd Cycle Invariant
  11: {
    pattern: "Floyd Cycle Distance Geometry",
    inputDescription: "Cycle begins at node with distance F from head",
    type: "floyd-cycle",
    steps: [
      {
        step: 0,
        pointers: "slow = 1 step/tick, fast = 2 steps/tick",
        invariantStatus: "Distance Closes",
        action: "Traverse",
        explanation: "Each tick, distance between fast and slow decreases by 1 in the loop of size C."
      },
      {
        step: 1,
        pointers: "slow meets fast at node M",
        invariantStatus: "Intersection Point Met",
        action: "Reset Pointer 1",
        explanation: "Meeting node M is exactly F steps away from cycle start. Reset pointer p1 to head."
      },
      {
        step: 2,
        pointers: "p1 from head (1 step), p2 from M (1 step)",
        invariantStatus: "Cycle Origin Discovered! 🎯",
        action: "Simultaneous Walk",
        explanation: "p1 and p2 walk at equal speed 1 step/tick. They intersect precisely at cycle entry!"
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
    pattern: "Subtree Depth Recurrence",
    inputDescription: "root = [3, 9, 20, null, null, 15, 7]",
    type: "tree-dfs",
    steps: [
      {
        step: 0,
        node: 3,
        leftDepth: "eval(9) = 1",
        rightDepth: "eval(20) = 2",
        invariantStatus: "Holds ✓",
        action: "Recurse",
        explanation: "maxDepth(node) = 1 + max(maxDepth(left), maxDepth(right)). Post-order evaluation."
      },
      {
        step: 1,
        node: 20,
        subtrees: "left=15 (depth 1), right=7 (depth 1)",
        invariantStatus: "Max Subtree = 2",
        action: "Aggregate",
        explanation: "Node 20 computes 1 + max(1, 1) = 2. Returns to root."
      },
      {
        step: 2,
        node: 3,
        result: "1 + max(1, 2) = 3",
        invariantStatus: "Global Depth = 3 🎯",
        action: "Return Root",
        explanation: "Root combines results: maximum tree depth is 3."
      }
    ]
  },

  // Day 14: BST Validation Range Bounds
  14: {
    pattern: "Propagating Open Invariant Bounds (low, high)",
    inputDescription: "root = [5, 1, 4, null, null, 3, 6]",
    type: "bst-bounds",
    steps: [
      {
        step: 0,
        node: 5,
        bounds: "(-inf, +inf)",
        invariantStatus: "Valid ✓",
        action: "Split Bounds",
        explanation: "Root 5 is valid. Left child must lie in (-inf, 5). Right child must lie in (5, +inf)."
      },
      {
        step: 1,
        node: 1,
        bounds: "(-inf, 5)",
        invariantStatus: "Valid ✓",
        action: "Verify Left",
        explanation: "1 < 5. Left subtree is a valid BST."
      },
      {
        step: 2,
        node: 4,
        bounds: "(5, +inf)",
        invariantStatus: "VIOLATION! ⚠",
        action: "Catch Invalid BST",
        explanation: "Node 4 <= low bound 5! Invariant violated. Instant early exit: return false."
      }
    ]
  },

  // Day 15: Lowest Common Ancestor
  15: {
    pattern: "LCA Bifurcation Invariant",
    inputDescription: "BST root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 8",
    type: "bst-lca",
    steps: [
      {
        step: 0,
        curr: 6,
        pVal: 2,
        qVal: 8,
        invariantStatus: "Bifurcation Point! 🎯",
        action: "LCA Found",
        explanation: "p (2) < 6 and q (8) > 6. Paths to p and q split here. 6 is guaranteed Lowest Common Ancestor!"
      }
    ]
  },

  // Day 16: Binary Tree Max Path Sum
  16: {
    pattern: "Branch Gain vs Combined Diameter Path",
    inputDescription: "root = [-10, 9, 20, null, null, 15, 7]",
    type: "tree-path-sum",
    steps: [
      {
        step: 0,
        node: 20,
        leftGain: "max(0, 15) = 15",
        rightGain: "max(0, 7) = 7",
        throughSum: "20 + 15 + 7 = 42",
        invariantStatus: "Max Path Candidate = 42 ⚡",
        action: "Update Global Max",
        explanation: "Subtree through 20 achieves 42. Return 20 + max(15, 7) = 35 to parent."
      },
      {
        step: 1,
        node: -10,
        throughSum: "-10 + 9 + 35 = 34",
        globalMax: 42,
        invariantStatus: "Holds ✓",
        action: "Compare Root",
        explanation: "Path through root gives 34 < 42. Global maximum remains 42."
      }
    ]
  },

  // Day 17: Trie Prefix Insertion
  17: {
    pattern: "Prefix Tree Deterministic Transitions",
    inputDescription: "Insert 'apple', query prefix 'app'",
    type: "trie",
    steps: [
      {
        step: 0,
        path: "root -> 'a' -> 'p' -> 'p' -> 'l' -> 'e' (isEnd=true)",
        invariantStatus: "Word Stored ✓",
        action: "Traverse",
        explanation: "Each character maps to a child pointer array of size 26 in O(L) time."
      },
      {
        step: 1,
        query: "startsWith('app')",
        pointer: "Reaches node 'p' without null mismatch",
        invariantStatus: "Prefix Verified! 🎯",
        action: "Return True",
        explanation: "All characters in prefix exist in order. Search terminates in O(L) steps."
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
        leftMaxHeap: "[5]",
        rightMinHeap: "[]",
        median: 5,
        invariantStatus: "Balanced ✓",
        action: "Add 5",
        explanation: "Left heap size = right heap size + 1. Median = top of left heap = 5."
      },
      {
        step: 1,
        leftMaxHeap: "[5]",
        rightMinHeap: "[15]",
        median: 10,
        invariantStatus: "Balanced ✓",
        action: "Add 15",
        explanation: "Both heaps have size 1. Median = (5 + 15) / 2 = 10.0."
      },
      {
        step: 2,
        leftMaxHeap: "[3, 1]",
        rightMinHeap: "[5, 15]",
        median: 4,
        invariantStatus: "Balanced ✓",
        action: "Rebalance",
        explanation: "All elements in left <= all elements in right. Median = (3 + 5) / 2 = 4.0 in O(1) query time."
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
        invariantStatus: "Dead End ✗",
        action: "Backtrack",
        explanation: "Remaining target 1 < candidate 2. Prune subtree and pop 2."
      },
      {
        step: 1,
        path: "[2, 2, 3]",
        rem: 0,
        invariantStatus: "Solution Recorded! 🎯",
        action: "Save Combination",
        explanation: "Remaining target == 0. Found combination [2, 2, 3]! Backtrack."
      },
      {
        step: 2,
        path: "[7]",
        rem: 0,
        invariantStatus: "Solution Recorded! 🎯",
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
    steps: [
      {
        step: 0,
        pos: "(r=0, c=0) 'A'",
        action: "board[0][0] = '#'",
        invariantStatus: "Visited Marked",
        explanation: "Temporarily mutate cell to '#' to prevent cyclic re-visitation."
      },
      {
        step: 1,
        pos: "(r=0, c=1) 'B'",
        action: "Explore 4 directions",
        invariantStatus: "Branch Matches",
        explanation: "Next letter 'B' found. Recurse into neighbors."
      },
      {
        step: 2,
        pos: "Unwind",
        action: "board[0][0] = 'A'",
        invariantStatus: "Backtracked Cleanly ✓",
        explanation: "Restore cell back to 'A' during post-order backtrack."
      }
    ]
  },

  // Day 21: Island Flood-Fill BFS / DFS
  21: {
    pattern: "Connected Component Sinking Invariant",
    inputDescription: "Grid with multiple '1's",
    type: "graph-floodfill",
    steps: [
      {
        step: 0,
        cell: "(0, 0) == '1'",
        action: "Increment Island Count",
        islandCount: 1,
        invariantStatus: "New Island",
        explanation: "Found unvisited land. Start BFS/DFS traversal."
      },
      {
        step: 1,
        cell: "Sink to '0'",
        action: "In-place Visited",
        invariantStatus: "Sunk ✓",
        explanation: "Turn all contiguous '1's into '0's to guarantee O(R * C) total cell inspections."
      }
    ]
  },

  // Day 22: Topological Sort Kahn's Algorithm Indegrees
  22: {
    pattern: "Kahn's Zero-Indegree Queue Invariant",
    inputDescription: "numCourses = 4, edges: [1->0, 2->0, 3->1, 3->2]",
    type: "topo-sort",
    steps: [
      {
        step: 0,
        indegrees: "{0: 2, 1: 1, 2: 1, 3: 0}",
        queue: "[3]",
        invariantStatus: "Queue Zero-Indegree",
        action: "Enqueue 3",
        explanation: "Course 3 has 0 prerequisites. Ready to process first."
      },
      {
        step: 1,
        pop: 3,
        indegrees: "{0: 2, 1: 0, 2: 0}",
        queue: "[1, 2]",
        invariantStatus: "Edges Decremented",
        action: "Enqueue 1, 2",
        explanation: "Course 3 completed. Prerequisites for 1 and 2 satisfied."
      },
      {
        step: 2,
        order: "[3, 1, 2, 0]",
        processed: 4,
        invariantStatus: "DAG Valid! 🎯",
        action: "Finished",
        explanation: "All 4 courses processed. No directed cycles exist."
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
        invariantStatus: "Holds ✓",
        explanation: "Node 1 attached to representative 0. Component count decrements to 4."
      },
      {
        step: 1,
        action: "find(2)",
        parents: "2 -> 1 -> 0 flattens to 2 -> 0",
        invariantStatus: "Path Compressed ⚡",
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
        invariantStatus: "Holds ✓",
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
        invariantStatus: "Optimal Answer: 3 Coins 🎯",
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
        invariantStatus: "Holds ✓",
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
        invariantStatus: "LIS Length = 4 🎯",
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
        invariantStatus: "Holds ✓",
        action: "Sum Paths",
        explanation: "Paths from top (1) + paths from left (1) = 2 ways to reach (1, 1)."
      },
      {
        step: 2,
        cell: "(2, 2)",
        transition: "dp[1][2] + dp[2][1] = 3 + 3 = 6",
        invariantStatus: "Total Paths: 6 🎯",
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
        invariantStatus: "Holds ✓",
        action: "First Interval",
        explanation: "Sort by start time. Initialize merged list with [1, 3]."
      },
      {
        step: 1,
        next: "[2, 6]",
        overlap: "2 <= 3",
        merged: "[[1, max(3, 6)]] -> [[1, 6]]",
        invariantStatus: "Overlap Merged ⚡",
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
        invariantStatus: "Holds ✓",
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
        invariantStatus: "Done 🎯",
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
        invariantStatus: "Holds ✓",
        action: "Add tree[7]",
        explanation: "Isolate LSB = 1. Add tree[7], transition to parent index 6."
      },
      {
        step: 1,
        index: "6 (0110_2)",
        lsb: "6 & -6 = 2",
        accumulated: "tree[7] + tree[6]",
        nextIndex: "6 - 2 = 4",
        invariantStatus: "Holds ✓",
        action: "Add tree[6]",
        explanation: "Isolate LSB = 2. Add tree[6], transition to parent index 4."
      },
      {
        step: 2,
        index: "4 (0100_2)",
        lsb: "4 & -4 = 4",
        accumulated: "tree[7] + tree[6] + tree[4]",
        nextIndex: "4 - 4 = 0",
        invariantStatus: "Prefix Sum Computed! 🎯",
        action: "Finished",
        explanation: "Index becomes 0. Prefix sum for 7 elements computed in exactly 3 steps (log2 N)."
      }
    ]
  }
};

if (typeof module !== 'undefined') {
  module.exports = { VISUALIZER_TRACES };
}
