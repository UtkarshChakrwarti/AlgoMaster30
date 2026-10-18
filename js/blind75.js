// ============================================================================
// BLIND 75 COMPLETE REPOSITORY
// Strictly Mapped into the NeetCode Roadmap Progression across 30 Days
// ============================================================================

const BLIND_75_DATABASE = [
  // -------------------------------------------------------------
  // ARRAYS & HASHING (Day 1 - Day 3)
  // -------------------------------------------------------------
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    dayMapped: 1,
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    keyInvariant: "Complement Lookup: For every element x, check if (target - x) exists in the hash map before inserting x. Single-pass O(N).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Negative numbers, zero as target, identical duplicate pairs (e.g. [3,3] target 6)."
  },
  {
    id: 3,
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    dayMapped: 1,
    leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
    keyInvariant: "Set Cardinality: An element seen before triggers early exit true; otherwise size of set equals array length.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Empty array, all distinct, all identical."
  },
  {
    id: 15,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    dayMapped: 1,
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
    keyInvariant: "Frequency Equivalence: Two strings are anagrams iff their character frequency vectors are identical.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(26) = O(1)",
    edgeCases: "Different lengths (instant false), Unicode characters."
  },
  {
    id: 16,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    dayMapped: 2,
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    keyInvariant: "Canonical Signature Hashing: Use sorted string or 26-char frequency tuple as a unique hash map key grouping words.",
    timeComplexity: "O(N * K log K)",
    spaceComplexity: "O(N * K)",
    edgeCases: "Empty strings, strings with no anagram partners, single character words."
  },
  {
    id: 38,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    dayMapped: 2,
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
    keyInvariant: "Bucket Sort or Min-Heap of Size K: Count frequencies, then bucket frequencies by index [0..N] to achieve O(N) linear time.",
    timeComplexity: "O(N) with Bucket Sort",
    spaceComplexity: "O(N)",
    edgeCases: "k equals number of unique elements, all elements unique."
  },
  {
    id: 4,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    dayMapped: 2,
    leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    keyInvariant: "Prefix-Suffix Decomposition: output[i] = (prefix product 0..i-1) * (suffix product i+1..N-1) in O(1) extra space.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) auxiliary",
    edgeCases: "Single zero in array, multiple zeroes (all outputs 0), negative numbers."
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    dayMapped: 2,
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    keyInvariant: "Kadane's Algorithm: At index i, the maximum contiguous sum ending at i is max(nums[i], prev_max + nums[i]). If previous running sum is negative, reset to nums[i].",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "All negative numbers (e.g. [-3, -1, -2] returns -1), single element array, alternating signs."
  },
  {
    id: 46,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    dayMapped: 3,
    leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/",
    keyInvariant: "Sequence Head Identification: An element x is the start of a consecutive streak iff (x - 1) is not in the hash set.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Empty array, duplicates present, large negative numbers."
  },
  {
    id: 71,
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Matrix",
    dayMapped: 3,
    leetcodeUrl: "https://leetcode.com/problems/set-matrix-zeroes/",
    keyInvariant: "First Row and Column as Storage: Use matrix[0][..] and matrix[..][0] to record zeroes for O(1) space.",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(1)",
    edgeCases: "First row or first column itself contains zero initially."
  },
  {
    id: 72,
    title: "Spiral Matrix",
    difficulty: "Medium",
    category: "Matrix",
    dayMapped: 3,
    leetcodeUrl: "https://leetcode.com/problems/spiral-matrix/",
    keyInvariant: "Four-Boundary Shrinking: Maintain top, bottom, left, right bounds and shrink corresponding boundary after each perimeter leg.",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(1)",
    edgeCases: "Single row, single column, non-square matrices."
  },
  {
    id: 73,
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Matrix",
    dayMapped: 3,
    leetcodeUrl: "https://leetcode.com/problems/rotate-image/",
    keyInvariant: "Transpose + Horizontal Reflection: Transpose matrix along main diagonal, then reverse each row.",
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(1)",
    edgeCases: "1x1 matrix, 2x2 matrix."
  },

  // -------------------------------------------------------------
  // TWO POINTERS (Day 4)
  // -------------------------------------------------------------
  {
    id: 11,
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Two Pointers",
    dayMapped: 4,
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
    keyInvariant: "Symmetric Convergence: Inward pointers skipping non-alphanumeric characters while asserting equivalence.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "String with no alphanumerics, single character, mixed symbols."
  },
  {
    id: 9,
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    dayMapped: 4,
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    keyInvariant: "Sort + Two-Pointer Convergence: Fix nums[i], use two pointers (left, right) summing to -nums[i]. Skip duplicates on i, left, and right.",
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(1) extra space",
    edgeCases: "Duplicate triplets, all zeroes [0,0,0,0], no valid triplets."
  },
  {
    id: 10,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    dayMapped: 4,
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
    keyInvariant: "Bottleneck Monotonicity: Width decreases at each step. Moving the taller bar can never yield larger area; must advance shorter bar.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Equal heights, strictly increasing/decreasing heights."
  },

  // -------------------------------------------------------------
  // SLIDING WINDOW (Day 5 - Day 6)
  // -------------------------------------------------------------
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Sliding Window",
    dayMapped: 5,
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    keyInvariant: "Running Minimum: Maintain lowest price seen so far. Profit at day i is price[i] - min_price.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Strictly decreasing prices (profit must be 0), single day array."
  },
  {
    id: 12,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    dayMapped: 5,
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    keyInvariant: "Last-Seen Index Jump: When character repeats at index i, jump left pointer to max(left, last_seen[char] + 1).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(min(N, Sigma))",
    edgeCases: "All identical characters, empty string, all unique characters."
  },
  {
    id: 13,
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    category: "Sliding Window",
    dayMapped: 6,
    leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    keyInvariant: "Window Validity Invariant: Window [left..right] is valid iff (window_length - max_frequency_in_window) <= k.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(26) = O(1)",
    edgeCases: "k larger than string length, string of length 1, k = 0."
  },
  {
    id: 14,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Sliding Window",
    dayMapped: 6,
    leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
    keyInvariant: "Target Frequency Deficit: Expand right until deficit is 0; contract left to find minimal valid boundary.",
    timeComplexity: "O(N + M)",
    spaceComplexity: "O(Sigma)",
    edgeCases: "t longer than s, t characters not present, exact match required."
  },
  {
    id: 75,
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    category: "Sliding Window",
    dayMapped: 6,
    leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/",
    keyInvariant: "Monotonic Decreasing Deque: Discard indices outside window from front, smaller elements from back in amortized O(1).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(k)",
    edgeCases: "k = 1, k = N, strictly decreasing array."
  },

  // -------------------------------------------------------------
  // STACK & MONOTONIC STACKS (Day 7 - Day 8)
  // -------------------------------------------------------------
  {
    id: 17,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    dayMapped: 7,
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    keyInvariant: "LIFO Nesting Invariant: Every closing bracket must match the most recent unmatched opening bracket on stack.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Starting with closing bracket, unmatched leftover open brackets, odd length string."
  },
  {
    id: 74,
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Stack",
    dayMapped: 8,
    leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    keyInvariant: "Monotonic Increasing Stack: When element popped, its height is strictly bounded on right by current index and on left by element beneath it.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Monotonically increasing heights, monotonically decreasing, all equal heights."
  },

  // -------------------------------------------------------------
  // BINARY SEARCH (Day 9 - Day 10)
  // -------------------------------------------------------------
  {
    id: 8,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    dayMapped: 9,
    leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    keyInvariant: "Sorted Half Guarantee: At least one half [left..mid] or [mid..right] is strictly sorted. Test whether target falls within it.",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    edgeCases: "Target at boundary (left, right, or mid), target not found."
  },
  {
    id: 7,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    dayMapped: 9,
    leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    keyInvariant: "Inflection Monotonicity: Compare nums[mid] with nums[right]. If nums[mid] > nums[right], minimum lies strictly in [mid+1, right].",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    edgeCases: "Unrotated array (0 rotations), 2-element array [2, 1]."
  },

  // -------------------------------------------------------------
  // LINKED LIST (Day 11 - Day 12)
  // -------------------------------------------------------------
  {
    id: 18,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    dayMapped: 11,
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    keyInvariant: "Three-Pointer Reversal: Maintain prev, curr, next. Invariant: prev always heads the reversed prefix.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Empty list, single node list, two node list."
  },
  {
    id: 20,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    dayMapped: 11,
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
    keyInvariant: "Sentinel Dummy Node: Splice smaller head of the two remaining lists to eliminate null edge cases.",
    timeComplexity: "O(N + M)",
    spaceComplexity: "O(1)",
    edgeCases: "One list empty, both lists empty, lists of disparate lengths."
  },
  {
    id: 19,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    dayMapped: 11,
    leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
    keyInvariant: "Floyd's Tortoise & Hare: Relative distance between fast and slow decreases by 1 each step modulo C.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Empty list, single node without cycle, single node pointing to itself."
  },
  {
    id: 23,
    title: "Reorder List",
    difficulty: "Medium",
    category: "Linked List",
    dayMapped: 12,
    leetcodeUrl: "https://leetcode.com/problems/reorder-list/",
    keyInvariant: "Split-Reverse-Interleave: Find midpoint via slow/fast, reverse second half, zip first and reversed halves.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Even number of nodes, odd number of nodes, <= 2 nodes."
  },
  {
    id: 22,
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    category: "Linked List",
    dayMapped: 12,
    leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    keyInvariant: "Gap Preservation: Advance fast pointer n steps ahead. Then move slow and fast together until fast reaches end.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Removing head node (use dummy sentinel), n equals list length."
  },
  {
    id: 21,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List",
    dayMapped: 12,
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
    keyInvariant: "Min-Heap of Size K: Maintain priority queue containing current heads of all non-empty lists in O(N log k).",
    timeComplexity: "O(N log k)",
    spaceComplexity: "O(k)",
    edgeCases: "k = 0, lists contains empty lists, all elements identical."
  },

  // -------------------------------------------------------------
  // TREES (Day 13 - Day 15)
  // -------------------------------------------------------------
  {
    id: 24,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    dayMapped: 13,
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
    keyInvariant: "Recursive Mirror: Swap left and right subtrees of current node, then recursively invert children.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    edgeCases: "Empty tree, skewed tree (linked list structure)."
  },
  {
    id: 25,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    dayMapped: 13,
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    keyInvariant: "Subtree Height Recurrence: height(node) = 1 + max(height(left), height(right)).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    edgeCases: "Null root (depth 0), single root node (depth 1)."
  },
  {
    id: 26,
    title: "Same Tree",
    difficulty: "Easy",
    category: "Trees",
    dayMapped: 13,
    leetcodeUrl: "https://leetcode.com/problems/same-tree/",
    keyInvariant: "Structural & Value Equivalence: Both null returns true; one null returns false; values and subtrees must match.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    edgeCases: "One tree null, mirrored values but different structures."
  },
  {
    id: 27,
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    category: "Trees",
    dayMapped: 13,
    leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/",
    keyInvariant: "Identical Subtree Test: Node matches subRoot iff isSame(node, subRoot) or matches in left/right children.",
    timeComplexity: "O(N * M)",
    spaceComplexity: "O(H)",
    edgeCases: "subRoot is identical to root, subRoot exists as isolated leaf."
  },
  {
    id: 28,
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Medium",
    category: "Trees",
    dayMapped: 14,
    leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    keyInvariant: "BST Split Property: Left if both smaller than root, right if both larger; otherwise root is split point (LCA).",
    timeComplexity: "O(H)",
    spaceComplexity: "O(1) iterative",
    edgeCases: "p is ancestor of q, root is equal to p or q."
  },
  {
    id: 29,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    dayMapped: 14,
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    keyInvariant: "Queue Snapshot Invariant: Loop over queue.size() elements to process exactly one level at a time.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Empty tree, tree with only left or right spine."
  },
  {
    id: 30,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    dayMapped: 14,
    leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
    keyInvariant: "Interval Propagation: Node value must fall strictly within (low_bound, high_bound).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    edgeCases: "Values equal to INT_MIN or INT_MAX (use 64-bit bounds)."
  },
  {
    id: 31,
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    category: "Trees",
    dayMapped: 14,
    leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    keyInvariant: "Inorder Monotonicity: Inorder traversal of BST visits nodes in strictly ascending sorted order.",
    timeComplexity: "O(H + k)",
    spaceComplexity: "O(H)",
    edgeCases: "k = 1, k = total number of nodes."
  },
  {
    id: 32,
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    category: "Trees",
    dayMapped: 15,
    leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    keyInvariant: "Root Identification + Subtree Boundaries: First element in preorder is root. Inorder hash map splits left and right subtrees.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Single node tree, completely right-skewed tree."
  },
  {
    id: 33,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    category: "Trees",
    dayMapped: 15,
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    keyInvariant: "Gain vs Path Arch: Return max single-branch gain while updating global max with arched sum.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    edgeCases: "All negative node values (must pick highest negative single node)."
  },
  {
    id: 34,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    dayMapped: 15,
    leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    keyInvariant: "Null Sentinel Reconstruction: Preorder traversal preserving explicit '# / null' tokens guarantees unique bijection back to original topology.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Empty tree, negative node values, multi-digit values."
  },

  // -------------------------------------------------------------
  // TRIES (Day 17)
  // -------------------------------------------------------------
  {
    id: 35,
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    category: "Trie",
    dayMapped: 17,
    leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    keyInvariant: "Prefix Edge Sharing: Nodes represent characters with child pointers [0..25] and boolean is_terminal flag.",
    timeComplexity: "O(L) per operation",
    spaceComplexity: "O(Total Chars * 26)",
    edgeCases: "Search for word that is proper prefix of an existing longer word."
  },
  {
    id: 36,
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    category: "Trie",
    dayMapped: 17,
    leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    keyInvariant: "Wildcard Backtracking: When encountering '.' wildcard, branch DFS into all 26 non-null children; otherwise follow exact edge.",
    timeComplexity: "O(L) exact, O(26^L) worst case wildcards",
    spaceComplexity: "O(Total Chars)",
    edgeCases: "Word consisting purely of '...' wildcards."
  },
  {
    id: 37,
    title: "Word Search II",
    difficulty: "Hard",
    category: "Trie",
    dayMapped: 17,
    leetcodeUrl: "https://leetcode.com/problems/word-search-ii/",
    keyInvariant: "Grid DFS with Trie Pruning: Step through Trie nodes simultaneously with grid DFS. Prune search branches immediately if prefix absent.",
    timeComplexity: "O(M * N * 3^L)",
    spaceComplexity: "O(Sum of word lengths)",
    edgeCases: "Duplicate words found, overlapping paths, large board with no matches."
  },

  // -------------------------------------------------------------
  // HEAP / PRIORITY QUEUE (Day 18)
  // -------------------------------------------------------------
  {
    id: 39,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    category: "Heap",
    dayMapped: 18,
    leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/",
    keyInvariant: "Two Heaps Equilibrium: Max-heap stores smaller half; min-heap stores larger half. Sizes differ by at most 1.",
    timeComplexity: "O(log N) insert, O(1) findMedian",
    spaceComplexity: "O(N)",
    edgeCases: "Even number of elements (average tops), odd number of elements."
  },

  // -------------------------------------------------------------
  // BACKTRACKING (Day 19)
  // -------------------------------------------------------------
  {
    id: 40,
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Backtracking",
    dayMapped: 19,
    leetcodeUrl: "https://leetcode.com/problems/combination-sum/",
    keyInvariant: "Index Forwarding with Reusability: Recursive step can reuse current candidate at index i or advance to i+1. Prune when remaining < 0.",
    timeComplexity: "O(2^Target)",
    spaceComplexity: "O(Target / min_candidate)",
    edgeCases: "Target smaller than smallest candidate, candidates sorted for early pruning."
  },
  {
    id: 41,
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    dayMapped: 19,
    leetcodeUrl: "https://leetcode.com/problems/word-search/",
    keyInvariant: "In-Place Board Visiting: Mutate board[r][c] = '#' during traversal, restore on backtracking.",
    timeComplexity: "O(M * N * 3^L)",
    spaceComplexity: "O(L) recursion stack",
    edgeCases: "Word longer than total board cells, cyclic path attempts."
  },

  // -------------------------------------------------------------
  // GRAPHS (Day 20 - Day 22)
  // -------------------------------------------------------------
  {
    id: 45,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    dayMapped: 20,
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    keyInvariant: "Connected Component Sinking: Encountering '1' increments island count and triggers BFS/DFS to sink all reachable land into '0'.",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N) worst case queue",
    edgeCases: "All water, all land, diagonal land cells (diagonals do NOT connect)."
  },
  {
    id: 42,
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graphs",
    dayMapped: 20,
    leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
    keyInvariant: "Old-to-New Node Mapping: Hash map stores original_node -> cloned_node. DFS/BFS instantiates cloned node on first discovery.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    edgeCases: "Null node, single isolated node, cyclic self-loop."
  },
  {
    id: 44,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    category: "Graphs",
    dayMapped: 20,
    leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    keyInvariant: "Reverse Ocean Inflow: Run multi-source BFS/DFS inward from ocean borders moving only uphill. Result is intersection.",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
    edgeCases: "1x1 grid, flat plateau with equal heights."
  },
  {
    id: 43,
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graphs",
    dayMapped: 21,
    leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
    keyInvariant: "DAG Cycle Detection: Kahn's in-degree tracking or 3-color DFS. Cycle exists iff gray node visited.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    edgeCases: "Disconnected graph with independent cycles, isolated nodes."
  },
  {
    id: 48,
    title: "Graph Valid Tree",
    difficulty: "Medium",
    category: "Graphs",
    dayMapped: 21,
    leetcodeUrl: "https://leetcode.com/problems/graph-valid-tree/",
    keyInvariant: "Tree Axiom: Exactly (V - 1) edges AND acyclic/connected verified by DSU.",
    timeComplexity: "O(V + E * alpha(V))",
    spaceComplexity: "O(V)",
    edgeCases: "E != V - 1 (early return false), disconnected components."
  },
  {
    id: 49,
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "Medium",
    category: "Graphs",
    dayMapped: 21,
    leetcodeUrl: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    keyInvariant: "DSU Component Reducer: Initialize count = n. Every successful union decrements count by 1.",
    timeComplexity: "O(V + E * alpha(V))",
    spaceComplexity: "O(V)",
    edgeCases: "Zero edges, fully connected graph."
  },
  {
    id: 47,
    title: "Alien Dictionary",
    difficulty: "Hard",
    category: "Graphs",
    dayMapped: 22,
    leetcodeUrl: "https://leetcode.com/problems/alien-dictionary/",
    keyInvariant: "Prefix Edge Ordering + Kahn's: Compare adjacent words. First differing character defines dependency edge u -> v. Verify prefix invalidity.",
    timeComplexity: "O(Total Characters)",
    spaceComplexity: "O(26 + E)",
    edgeCases: "Invalid prefix: word2 is proper prefix of word1 (e.g. ['abc', 'ab'] is invalid)."
  },

  // -------------------------------------------------------------
  // DYNAMIC PROGRAMMING (Day 23 - Day 26)
  // -------------------------------------------------------------
  {
    id: 50,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    dayMapped: 23,
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
    keyInvariant: "Fibonacci Transition: dp[i] = dp[i-1] + dp[i-2] in O(1) space.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "n = 1, n = 2."
  },
  {
    id: 56,
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 23,
    leetcodeUrl: "https://leetcode.com/problems/house-robber/",
    keyInvariant: "Non-Adjacent Decision: dp[i] = max(dp[i-1], dp[i-2] + nums[i]) in O(1) space.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Single house, zero loot in houses."
  },
  {
    id: 57,
    title: "House Robber II",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 23,
    leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/",
    keyInvariant: "Circular Boundary Disjunction: Solve two independent linear subproblems: [0..N-2] and [1..N-1].",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Single house (return nums[0]), two houses."
  },
  {
    id: 51,
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 24,
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
    keyInvariant: "Unbounded Knapsack: dp[amount] = 1 + min(dp[amount - coin]).",
    timeComplexity: "O(Amount * Coins.length)",
    spaceComplexity: "O(Amount)",
    edgeCases: "Amount 0 (returns 0), impossible amount (returns -1)."
  },
  {
    id: 52,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 24,
    leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
    keyInvariant: "Patience Sorting / Tails Array: tails[i] stores smallest tail of all increasing subsequences of length i+1 in O(N log N).",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    edgeCases: "Strictly decreasing array (LIS length 1), all identical elements."
  },
  {
    id: 54,
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 24,
    leetcodeUrl: "https://leetcode.com/problems/word-break/",
    keyInvariant: "Prefix Reachability: dp[i] is true iff there exists j < i such that dp[j] is true and s[j..i] exists in dictionary.",
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(N + DictSize)",
    edgeCases: "Cannot segment entire string, overlapping dictionary words."
  },
  {
    id: 6,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 24,
    leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/",
    keyInvariant: "Dual Extrema Tracking: Maintain both max_product and min_product because multiplying by a negative flips them.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Zeroes resetting running product, odd vs even count of negative elements."
  },
  {
    id: 58,
    title: "Decode Ways",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 25,
    leetcodeUrl: "https://leetcode.com/problems/decode-ways/",
    keyInvariant: "1-Digit and 2-Digit Valid Decodes: Check if s[i-1] != '0' and if substring s[i-2..i-1] in [10..26].",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Leading zero '06' (invalid 0 decodes), consecutive zeroes '30' (invalid)."
  },
  {
    id: 55,
    title: "Combination Sum IV",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 25,
    leetcodeUrl: "https://leetcode.com/problems/combination-sum-iv/",
    keyInvariant: "Ordered Sequence DP: dp[i] = sum(dp[i - num]) for all num <= i.",
    timeComplexity: "O(Target * N)",
    spaceComplexity: "O(Target)",
    edgeCases: "32-bit integer overflow during addition (use unsigned integer or clamp)."
  },
  {
    id: 60,
    title: "Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 25,
    leetcodeUrl: "https://leetcode.com/problems/jump-game/",
    keyInvariant: "Greedy Furthest Reachable: max_reach = max(max_reach, i + nums[i]). If i > max_reach, return false.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Array of zeroes, single element array (instant true)."
  },
  {
    id: 59,
    title: "Unique Paths",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 26,
    leetcodeUrl: "https://leetcode.com/problems/unique-paths/",
    keyInvariant: "Grid Inflow: dp[r][c] = dp[r-1][c] + dp[r][c-1]. Equivalent to (m+n-2) choose (m-1).",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(N)",
    edgeCases: "1x1 grid (1 path), 1xN grid."
  },
  {
    id: 53,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    dayMapped: 26,
    leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/",
    keyInvariant: "Character Match Invariant: If text1[i] == text2[j], 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).",
    timeComplexity: "O(N * M)",
    spaceComplexity: "O(min(N, M))",
    edgeCases: "No common characters, identical strings, empty string."
  },

  // -------------------------------------------------------------
  // INTERVALS (Day 27)
  // -------------------------------------------------------------
  {
    id: 61,
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Intervals",
    dayMapped: 27,
    leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
    keyInvariant: "Start-Time Sorting: Two intervals overlap iff s2 <= e1. Merged interval is [s1, max(e1, e2)].",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    edgeCases: "One interval entirely enclosed by another, disjoint intervals."
  },
  {
    id: 62,
    title: "Insert Interval",
    difficulty: "Medium",
    category: "Intervals",
    dayMapped: 27,
    leetcodeUrl: "https://leetcode.com/problems/insert-interval/",
    keyInvariant: "Three-Phase Linear Sweep: Add non-overlapping left intervals, merge overlapping intervals, append remaining right intervals.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Insert before all existing, insert after all existing, new interval covers all."
  },
  {
    id: 63,
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    category: "Intervals",
    dayMapped: 27,
    leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/",
    keyInvariant: "Greedy Earliest End Time: Always keep the interval that finishes earliest to leave maximum room for future intervals.",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(1)",
    edgeCases: "Intervals touching at endpoint do NOT overlap."
  },
  {
    id: 64,
    title: "Meeting Rooms",
    difficulty: "Easy",
    category: "Intervals",
    dayMapped: 27,
    leetcodeUrl: "https://leetcode.com/problems/meeting-rooms/",
    keyInvariant: "Adjacent Overlap Check: Sort by start time. Return false if intervals[i].start < intervals[i-1].end.",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(1)",
    edgeCases: "Empty list, single meeting."
  },
  {
    id: 65,
    title: "Meeting Rooms II",
    difficulty: "Medium",
    category: "Intervals",
    dayMapped: 27,
    leetcodeUrl: "https://leetcode.com/problems/meeting-rooms-ii/",
    keyInvariant: "Chronological Sweep Line / Min-Heap of Ends: Add room if earliest finishing meeting > current.start; else reuse room.",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    edgeCases: "All simultaneous meetings, meetings touching at boundary."
  },

  // -------------------------------------------------------------
  // BIT MANIPULATION (Day 28)
  // -------------------------------------------------------------
  {
    id: 66,
    title: "Number of 1 Bits (Hamming Weight)",
    difficulty: "Easy",
    category: "Bit Manipulation",
    dayMapped: 28,
    leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/",
    keyInvariant: "Brian Kernighan's Algorithm: n = n & (n - 1) strips lowest set bit in each iteration.",
    timeComplexity: "O(Popcount) <= O(32)",
    spaceComplexity: "O(1)",
    edgeCases: "n = 0, n = 0xFFFFFFFF."
  },
  {
    id: 67,
    title: "Counting Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    dayMapped: 28,
    leetcodeUrl: "https://leetcode.com/problems/counting-bits/",
    keyInvariant: "Right-Shift Subproblem: dp[i] = dp[i >> 1] + (i & 1).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) extra space",
    edgeCases: "n = 0."
  },
  {
    id: 68,
    title: "Reverse Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    dayMapped: 28,
    leetcodeUrl: "https://leetcode.com/problems/reverse-bits/",
    keyInvariant: "Bitwise Shift Accumulation: Extract LSB of n, append to result, shift result left and n right for 32 rounds.",
    timeComplexity: "O(32) = O(1)",
    spaceComplexity: "O(1)",
    edgeCases: "All zeroes, all ones, alternating bit patterns."
  },
  {
    id: 69,
    title: "Missing Number",
    difficulty: "Easy",
    category: "Bit Manipulation",
    dayMapped: 28,
    leetcodeUrl: "https://leetcode.com/problems/missing-number/",
    keyInvariant: "XOR Self-Cancellation: a ^ a = 0 and a ^ 0 = a. XOR all indices 0..n with array values.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: "Missing 0, missing n."
  },
  {
    id: 70,
    title: "Sum of Two Integers",
    difficulty: "Medium",
    category: "Bit Manipulation",
    dayMapped: 28,
    leetcodeUrl: "https://leetcode.com/problems/sum-of-two-integers/",
    keyInvariant: "Half-Adder Logic: sum without carry = a ^ b; carry = (a & b) << 1. Repeat until carry is zero.",
    timeComplexity: "O(32) = O(1)",
    spaceComplexity: "O(1)",
    edgeCases: "Negative integers."
  },
  {
    id: 76,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    dayMapped: 10,
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    keyInvariant: "Binary Search on Partition Cut: Binary search partition of smaller array A at cut i such that A[i-1] <= B[j] and B[j-1] <= A[i] where i + j = (M + N + 1) / 2 in O(log(min(M, N))).",
    timeComplexity: "O(log(min(M, N)))",
    spaceComplexity: "O(1)",
    edgeCases: "One array empty, odd vs even total elements, partition cut at boundary."
  },
  {
    id: 77,
    title: "Sum of Distances in Tree",
    difficulty: "Hard",
    category: "Trees",
    dayMapped: 16,
    leetcodeUrl: "https://leetcode.com/problems/sum-of-distances-in-tree/",
    keyInvariant: "Tree DP Rerooting: First postorder DFS computes subtree node counts and base answer for root. Second preorder DFS updates child root: ans[v] = ans[u] - count[v] + (N - count[v]).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: "Single node tree (N=1), star graph, linear chain graph."
  },
  {
    id: 78,
    title: "Range Update Queries",
    difficulty: "Hard",
    category: "Advanced Data Structures",
    dayMapped: 29,
    leetcodeUrl: "https://cses.fi/problemset/task/1651/",
    keyInvariant: "Difference Array on Fenwick / Segment Tree: Add value u at position a and subtract u at position b+1 on a BIT, reducing range updates to two O(log N) point updates and point queries to prefix sums.",
    timeComplexity: "O(Q log N)",
    spaceComplexity: "O(N)",
    edgeCases: "b = N boundary update, consecutive range updates covering full array."
  },
  {
    id: 79,
    title: "Distinct Values Queries",
    difficulty: "Hard",
    category: "Capstone Gauntlet",
    dayMapped: 30,
    leetcodeUrl: "https://cses.fi/problemset/task/1734/",
    keyInvariant: "Offline Fenwick Sweep Line: Sort queries by right boundary R. Maintain BIT storing 1 at the latest position of each distinct value seen so far, clearing its prior occurrence.",
    timeComplexity: "O((N + Q) log N)",
    spaceComplexity: "O(N)",
    edgeCases: "All identical values, all distinct values, overlapping query ranges."
  }
];

if (typeof module !== 'undefined') {
  module.exports = { BLIND_75_DATABASE };
}

// Enrich all 75 problems with canonical patternTag and 30-Second Interview Pitch
(function enrichBlind75() {
  const PATTERN_MAP = {
    "Arrays & Hashing": "Hash Map / Set",
    "Two Pointers": "Two Pointers",
    "Sliding Window": "Sliding Window",
    "Stack": "Monotonic Stack",
    "Binary Search": "Binary Search",
    "Linked List": "Linked List / Fast & Slow",
    "Trees": "Tree DFS / Recursion",
    "Trie": "Trie (Prefix Tree)",
    "Heap": "Heap / Priority Queue",
    "Backtracking": "Backtracking",
    "Graphs": "Graph BFS / DFS",
    "Matrix": "Graph BFS / DFS",
    "Dynamic Programming": "1D Dynamic Programming",
    "Intervals": "Greedy / Intervals",
    "Bit Manipulation": "Bit Manipulation",
    "Advanced Data Structures": "Segment Tree / BIT",
    "Capstone Gauntlet": "Segment Tree / BIT"
  };

  const CUSTOM_PATTERNS = {
    102: "Tree BFS / Level Order",
    200: "Graph BFS / DFS",
    207: "Graph Topo Sort",
    141: "Linked List / Fast & Slow",
    23: "Heap / Priority Queue",
    62: "2D Dynamic Programming",
    1143: "2D Dynamic Programming",
    300: "1D Dynamic Programming",
    322: "1D Dynamic Programming",
    70: "1D Dynamic Programming",
    198: "1D Dynamic Programming",
    213: "1D Dynamic Programming",
    139: "1D Dynamic Programming",
    91: "1D Dynamic Programming",
    55: "Greedy / Intervals",
    435: "Greedy / Intervals",
    56: "Greedy / Intervals",
    57: "Greedy / Intervals",
    252: "Greedy / Intervals",
    253: "Heap / Priority Queue",
    33: "Binary Search",
    153: "Binary Search",
    371: "Bit Manipulation",
    191: "Bit Manipulation",
    338: "Bit Manipulation",
    268: "Bit Manipulation",
    190: "Bit Manipulation",
    76: "Binary Search",
    77: "Tree BFS / DFS",
    78: "Segment Tree / BIT",
    79: "Segment Tree / BIT"
  };

  // 100% Tested & Verified Free Online Interactive Runners
  // Free in-browser compiler & test runners for all problems with zero subscription paywalls
  const FREE_RUNNER_MAP = {
    1: { url: "https://neetcode.io/problems/two-integer-sum", name: "NeetCode Free Runner", isPremium: false },
    3: { url: "https://neetcode.io/problems/duplicate-integer", name: "NeetCode Free Runner", isPremium: false },
    15: { url: "https://neetcode.io/problems/is-anagram", name: "NeetCode Free Runner", isPremium: false },
    16: { url: "https://neetcode.io/problems/anagram-groups", name: "NeetCode Free Runner", isPremium: false },
    38: { url: "https://neetcode.io/problems/top-k-elements-in-list", name: "NeetCode Free Runner", isPremium: false },
    4: { url: "https://neetcode.io/problems/products-of-array-discluding-self", name: "NeetCode Free Runner", isPremium: false },
    5: { url: "https://neetcode.io/problems/maximum-subarray", name: "NeetCode Free Runner", isPremium: false },
    46: { url: "https://neetcode.io/problems/longest-consecutive-sequence", name: "NeetCode Free Runner", isPremium: false },
    71: { url: "https://neetcode.io/problems/set-zeroes-in-matrix", name: "NeetCode Free Runner", isPremium: false },
    72: { url: "https://neetcode.io/problems/spiral-matrix", name: "NeetCode Free Runner", isPremium: false },
    73: { url: "https://neetcode.io/problems/rotate-matrix", name: "NeetCode Free Runner", isPremium: false },
    11: { url: "https://neetcode.io/problems/is-palindrome", name: "NeetCode Free Runner", isPremium: false },
    9: { url: "https://neetcode.io/problems/three-integer-sum", name: "NeetCode Free Runner", isPremium: false },
    10: { url: "https://neetcode.io/problems/max-water-container", name: "NeetCode Free Runner", isPremium: false },
    2: { url: "https://neetcode.io/problems/buy-and-sell-crypto", name: "NeetCode Free Runner", isPremium: false },
    12: { url: "https://neetcode.io/problems/longest-substring-without-duplicates", name: "NeetCode Free Runner", isPremium: false },
    13: { url: "https://neetcode.io/problems/longest-repeating-substring-with-replacement", name: "NeetCode Free Runner", isPremium: false },
    14: { url: "https://neetcode.io/problems/minimum-window-with-characters", name: "NeetCode Free Runner", isPremium: false },
    75: { url: "https://neetcode.io/problems/sliding-window-maximum", name: "NeetCode Free Runner", isPremium: false },
    17: { url: "https://neetcode.io/problems/validate-parentheses", name: "NeetCode Free Runner", isPremium: false },
    74: { url: "https://neetcode.io/problems/largest-rectangle-in-histogram", name: "NeetCode Free Runner", isPremium: false },
    8: { url: "https://neetcode.io/problems/find-target-in-rotated-sorted-array", name: "NeetCode Free Runner", isPremium: false },
    7: { url: "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array", name: "NeetCode Free Runner", isPremium: false },
    18: { url: "https://neetcode.io/problems/reverse-a-linked-list", name: "NeetCode Free Runner", isPremium: false },
    20: { url: "https://neetcode.io/problems/merge-two-sorted-linked-lists", name: "NeetCode Free Runner", isPremium: false },
    19: { url: "https://neetcode.io/problems/linked-list-cycle-detection", name: "NeetCode Free Runner", isPremium: false },
    23: { url: "https://neetcode.io/problems/reorder-linked-list", name: "NeetCode Free Runner", isPremium: false },
    22: { url: "https://neetcode.io/problems/remove-node-from-end-of-linked-list", name: "NeetCode Free Runner", isPremium: false },
    21: { url: "https://neetcode.io/problems/merge-k-sorted-linked-lists", name: "NeetCode Free Runner", isPremium: false },
    24: { url: "https://neetcode.io/problems/invert-a-binary-tree", name: "NeetCode Free Runner", isPremium: false },
    25: { url: "https://neetcode.io/problems/depth-of-binary-tree", name: "NeetCode Free Runner", isPremium: false },
    26: { url: "https://neetcode.io/problems/same-binary-tree", name: "NeetCode Free Runner", isPremium: false },
    27: { url: "https://neetcode.io/problems/subtree-of-a-binary-tree", name: "NeetCode Free Runner", isPremium: false },
    28: { url: "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree", name: "NeetCode Free Runner", isPremium: false },
    29: { url: "https://neetcode.io/problems/level-order-traversal-of-binary-tree", name: "NeetCode Free Runner", isPremium: false },
    30: { url: "https://neetcode.io/problems/valid-binary-search-tree", name: "NeetCode Free Runner", isPremium: false },
    31: { url: "https://neetcode.io/problems/kth-smallest-integer-in-bst", name: "NeetCode Free Runner", isPremium: false },
    32: { url: "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal", name: "NeetCode Free Runner", isPremium: false },
    33: { url: "https://neetcode.io/problems/binary-tree-maximum-path-sum", name: "NeetCode Free Runner", isPremium: false },
    34: { url: "https://neetcode.io/problems/serialize-and-deserialize-binary-tree", name: "NeetCode Free Runner", isPremium: false },
    35: { url: "https://neetcode.io/problems/implement-prefix-tree", name: "NeetCode Free Runner", isPremium: false },
    36: { url: "https://neetcode.io/problems/design-word-search-data-structure", name: "NeetCode Free Runner", isPremium: false },
    37: { url: "https://neetcode.io/problems/word-search-ii", name: "NeetCode Free Runner", isPremium: false },
    39: { url: "https://neetcode.io/problems/find-median-in-a-data-stream", name: "NeetCode Free Runner", isPremium: false },
    40: { url: "https://neetcode.io/problems/combination-target-sum", name: "NeetCode Free Runner", isPremium: false },
    41: { url: "https://neetcode.io/problems/search-for-word", name: "NeetCode Free Runner", isPremium: false },
    45: { url: "https://neetcode.io/problems/count-number-of-islands", name: "NeetCode Free Runner", isPremium: false },
    42: { url: "https://neetcode.io/problems/clone-graph", name: "NeetCode Free Runner", isPremium: false },
    44: { url: "https://neetcode.io/problems/pacific-atlantic-water-flow", name: "NeetCode Free Runner", isPremium: false },
    43: { url: "https://neetcode.io/problems/course-schedule", name: "NeetCode Free Runner", isPremium: false },
    48: { url: "https://neetcode.io/problems/valid-tree", name: "NeetCode Free Runner", isPremium: true, gfgUrl: "https://www.geeksforgeeks.org/problems/is-it-a-tree/1" },
    49: { url: "https://neetcode.io/problems/count-connected-components", name: "NeetCode Free Runner", isPremium: true, gfgUrl: "https://www.geeksforgeeks.org/problems/number-of-provinces/1" },
    47: { url: "https://neetcode.io/problems/foreign-dictionary", name: "NeetCode Free Runner", isPremium: true, gfgUrl: "https://www.geeksforgeeks.org/problems/alien-dictionary/1" },
    50: { url: "https://neetcode.io/problems/climbing-stairs", name: "NeetCode Free Runner", isPremium: false },
    56: { url: "https://neetcode.io/problems/house-robber", name: "NeetCode Free Runner", isPremium: false },
    57: { url: "https://neetcode.io/problems/house-robber-ii", name: "NeetCode Free Runner", isPremium: false },
    51: { url: "https://neetcode.io/problems/coin-change", name: "NeetCode Free Runner", isPremium: false },
    52: { url: "https://neetcode.io/problems/longest-increasing-subsequence", name: "NeetCode Free Runner", isPremium: false },
    54: { url: "https://neetcode.io/problems/word-break", name: "NeetCode Free Runner", isPremium: false },
    6: { url: "https://neetcode.io/problems/maximum-product-subarray", name: "NeetCode Free Runner", isPremium: false },
    58: { url: "https://neetcode.io/problems/decode-ways", name: "NeetCode Free Runner", isPremium: false },
    55: { url: "https://neetcode.io/problems/combination-target-sum-iv", name: "NeetCode Free Runner", isPremium: false },
    60: { url: "https://neetcode.io/problems/jump-game", name: "NeetCode Free Runner", isPremium: false },
    59: { url: "https://neetcode.io/problems/count-paths", name: "NeetCode Free Runner", isPremium: false },
    53: { url: "https://neetcode.io/problems/longest-common-subsequence", name: "NeetCode Free Runner", isPremium: false },
    61: { url: "https://neetcode.io/problems/merge-intervals", name: "NeetCode Free Runner", isPremium: false },
    62: { url: "https://neetcode.io/problems/insert-new-interval", name: "NeetCode Free Runner", isPremium: false },
    63: { url: "https://neetcode.io/problems/non-overlapping-intervals", name: "NeetCode Free Runner", isPremium: false },
    64: { url: "https://neetcode.io/problems/meeting-schedule", name: "NeetCode Free Runner", isPremium: true, gfgUrl: "https://www.geeksforgeeks.org/problems/attend-all-meetings/1" },
    65: { url: "https://neetcode.io/problems/meeting-schedule-ii", name: "NeetCode Free Runner", isPremium: true, gfgUrl: "https://www.geeksforgeeks.org/problems/meeting-rooms/1" },
    66: { url: "https://neetcode.io/problems/number-of-one-bits", name: "NeetCode Free Runner", isPremium: false },
    67: { url: "https://neetcode.io/problems/counting-bits", name: "NeetCode Free Runner", isPremium: false },
    68: { url: "https://neetcode.io/problems/reverse-bits", name: "NeetCode Free Runner", isPremium: false },
    69: { url: "https://neetcode.io/problems/missing-number", name: "NeetCode Free Runner", isPremium: false },
    70: { url: "https://neetcode.io/problems/sum-of-two-integers", name: "NeetCode Free Runner", isPremium: false },
    76: { url: "https://neetcode.io/problems/median-of-two-sorted-arrays", name: "NeetCode Free Runner", isPremium: false },
    77: { url: "https://neetcode.io/problems/sum-of-distances-in-tree", name: "NeetCode Free Runner", isPremium: false },
    78: { url: "https://cses.fi/problemset/task/1651/", name: "CSES Online Judge", isPremium: false },
    79: { url: "https://cses.fi/problemset/task/1734/", name: "CSES Online Judge", isPremium: false }
  };

  BLIND_75_DATABASE.forEach(p => {
    p.patternTag = CUSTOM_PATTERNS[p.id] || PATTERN_MAP[p.category] || "Hash Map / Set";
    
    // Attach Free Runner & LeetCode Premium metadata
    const freeInfo = FREE_RUNNER_MAP[p.id];
    if (freeInfo) {
      p.freeAlternativeUrl = freeInfo.url;
      p.freeAlternativeName = freeInfo.name || "NeetCode Free Runner";
      p.isPremium = !!freeInfo.isPremium;
      if (freeInfo.gfgUrl) p.gfgUrl = freeInfo.gfgUrl;
    } else {
      p.freeAlternativeUrl = p.leetcodeUrl;
      p.freeAlternativeName = "Online Runner";
      p.isPremium = false;
    }

    let naiveTrap = "A brute-force approach checks all combinations in " + (p.difficulty === 'Hard' ? 'O(2^N) or O(N^3)' : 'O(N^2)') + ", which hits Time Limit Exceeded on larger bounds.";
    let keyInsight = "Instead, as we process elements, we leverage " + p.patternTag + ": " + (p.keyInvariant.split(':')[1] || p.keyInvariant) + ".";
    let complexityGuarantee = "This guarantees " + p.timeComplexity + " time and " + p.spaceComplexity + " space, avoiding unnecessary re-computations.";

    if (p.id === 1) {
      naiveTrap = "A brute-force approach compares every pair in O(N²), which wastes time re-scanning seen elements.";
      keyInsight = "Instead, as we scan once, we query our hash map for (target - nums[i]) before inserting nums[i].";
      complexityGuarantee = "This guarantees single-pass O(N) time and O(N) space, avoiding duplicate self-matching.";
    } else if (p.id === 15 && p.title === '3Sum') {
      naiveTrap = "Three nested loops yield O(N³), and tracking unique triplets with a hash set is messy and slow.";
      keyInsight = "Instead, we sort the array in O(N log N) and fix one element, reducing the problem to two-pointer Two Sum with duplicate-skipping.";
      complexityGuarantee = "This guarantees O(N²) time and O(1) extra space (ignoring sort), completely eliminating duplicate triplets.";
    } else if (p.title.includes('Longest Substring Without Repeating')) {
      naiveTrap = "Checking all substrings takes O(N³) or O(N²) with a set for each start position.";
      keyInsight = "Instead, we maintain a sliding window [L..R] with a frequency map, sliding L forward whenever a duplicate character enters at R.";
      complexityGuarantee = "Each pointer moves at most N times, guaranteeing strict O(N) time and O(min(N, 26)) space.";
    } else if (p.id === 11) {
      naiveTrap = "Testing every possible pair of lines takes O(N²), which is too slow for 10^5 elements.";
      keyInsight = "We place pointers at both ends and greedily move the shorter line inward, because moving the taller line can never increase the area.";
      complexityGuarantee = "This guarantees a single O(N) pass and O(1) space with zero redundant checks.";
    }

    p.interviewPitch = {
      naiveTrap,
      keyInsight,
      complexityGuarantee,
      coreTrick: p.keyInvariant
    };
  });
})();
