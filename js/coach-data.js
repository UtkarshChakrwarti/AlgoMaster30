// ============================================================================
// ALGOMASTER 30 — TOUGH-LOVE COACH DATA & SANITY CHECKS
// Zero Pretentious Jargon • Plain Razor-Sharp English • Senior Engineer Voice
// ============================================================================

const COACH_DATA = {
  // 3-Sentence Plain-English Morning Briefings (Days 1 to 30)
  briefings: {
    1: "Today we start with the simplest trade in computer science: spending memory to kill nested loops. If you catch yourself scanning an array twice just to see if a match exists, stop and reach for a hash map. The mental habit today is single-pass thinking—don't look forward, query what you've already seen behind you.",
    2: "Today is about canonical signatures—creating a deterministic fingerprint for things that look different on the surface but are identical under the hood. For anagrams, sorting works, but counting 26 character frequencies proves you understand constant-space efficiency. Stop overcomplicating string matching and group by their core fingerprint.",
    3: "Consecutive sequences look like they scream for sorting, but sorting costs O(N log N). The game here is finding the 'origin' element before doing any work: if (x - 1) exists in your set, skip x immediately. That single, simple rule turns a potential quadratic nightmare into a guaranteed linear scan.",
    4: "Two pointers isn't just a trick; it's a way to eliminate an entire dimension of search space because the array is sorted. In 3Sum, lock down the first number, then let two pointers squeeze the remaining sum from both ends. Your biggest enemy today isn't the math—it's duplicate triplets, so skip repeated numbers deliberately.",
    5: "Container With Most Water is the classic trap where beginners want to check all pairs. The rule that never breaks: always move the shorter wall inward. The taller wall might find an even taller partner, but the shorter wall is already dead weight—shrinking width will never make it hold more water.",
    6: "Sliding window is all about dynamic boundaries: expand the right pointer to find valid states, shrink the left pointer the exact second an invariant breaks. In 'Longest Substring Without Repeating', never restart your search from scratch when you hit a duplicate—just slide your left pointer past the previous occurrence.",
    7: "Monotonic stack is the secret weapon for 'next greater' or 'previous smaller' questions. As you iterate through temperatures or heights, keep the stack strictly ordered; the moment a new number breaks that order, pop everything smaller and record the answer. Each element is pushed once and popped once, meaning it's strictly O(N) even with nested while loops.",
    8: "Rotated binary search terrifies candidates because they look for the pivot first. Don't do that. In any rotated sorted array, at least one half (left or right of mid) is always normally sorted. Figure out which half is sorted, check if your target falls inside that sorted range, and discard the other half instantly.",
    9: "Binary search isn't just for finding numbers in an array—it's for finding the boundary where an answer goes from 'impossible' to 'possible'. If eating bananas at speed k is possible, all speeds > k are also possible. Recognize this monotonicity and bisect the answer space itself.",
    10: "Linked list reversals don't require allocating new memory or recursion—they just require steady pointer wiring. You need exactly three pointers: prev, curr, and next. Before severing curr.next, store it in next; otherwise, you drop the rest of the list into the void.",
    11: "Floyd's Tortoise and Hare is pure modular arithmetic disguised as pointers. Fast moves two steps while slow moves one; in a cycle, the gap closes by one step every tick. When they collide, resetting one pointer to head and walking both at 1 step/tick lands them precisely at the cycle's entrance.",
    12: "Merging K sorted lists is where you decide between an ugly O(N * K) sequential merge and an elegant O(N log K) min-heap or divide-and-conquer approach. Think of it like a tournament bracket: merge lists in pairs, cutting the number of active lists in half at every round.",
    13: "Trees are solved by trust: trust your recursive function to return the answer for the left and right subtrees, then combine them at the root. In Maximum Depth or Invert Tree, never try to trace 10 levels deep in your head. Write the base case for null, write the 1-line root logic, and let the call stack do the heavy lifting.",
    14: "Validating a Binary Search Tree is where naive candidates get burned by only checking `node.left < node < node.right`. That check fails on subtrees! You must pass down valid open intervals (min_val, max_val) from root to leaves, tightening the bounds at every single branch.",
    15: "Lowest Common Ancestor in a BST is almost trivial if you use the ordering property: if p and q are both smaller, go left; if both are bigger, go right; the split point is your answer. In a general binary tree, look for where both left and right recursive calls return non-null.",
    16: "Binary Tree Maximum Path Sum is a quintessential FAANG interview question. The trick is distinguishing between what a subtree contributes to its parent (at most one branch) versus the max path that peaks at that node (left + node + right). Never mix those two values up.",
    17: "Tries exist because hashing prefixes requires copying strings, while a 26-way tree shares prefixes naturally. Each node represents a character state, with a boolean flag marking word endings. For autocomplete or dictionary search, Tries turn $O(L)$ prefix lookups into child-pointer jumps.",
    18: "Finding the running median of a stream in real-time requires balancing two opposing forces: a max-heap for the smaller half and a min-heap for the larger half. The median is always right at the boundary. Keep the sizes balanced within 1 element, and median lookup is an instant O(1).",
    19: "Backtracking is brute force with a brain: explore a choice, recurse, and undo the choice when returning. In Combination Sum, avoid duplicate combinations by only allowing choices from the current index forward. If the remaining target drops below zero, prune the branch immediately.",
    20: "Word Search on a grid teaches you in-place state management. Instead of allocating a slow boolean visited array, temporarily flip the current cell to '#' and restore it when backtracking. That single habit saves memory allocations and speeds up recursion by 5x.",
    21: "Graph BFS and DFS are identical except for the data structure: queue gives shortest path in unweighted graphs, stack gives deep exploration. In Number of Islands, the critical interview discipline is marking cells visited the exact millisecond you push them to the queue, not when you pop them.",
    22: "Topological Sort is about prerequisites and dependency resolution. Kahn's algorithm is straightforward: count incoming edges (in-degrees), throw all 0-indegree nodes into a queue, and decrement neighbor counts as you pop. If your finished list has fewer nodes than the graph, you caught a cycle.",
    23: "Disjoint Set Union (Union-Find) is the fastest data structure in computer science. With path compression and union by rank, operations run in nearly O(1) inverse Ackermann time. Use it whenever you need to dynamically connect components or detect undirected graph cycles.",
    24: "Dijkstra's algorithm is greedy BFS powered by a min-heap for non-negative edge weights. Always track distances in a lookup array and ignore popped heap nodes whose recorded distance is already smaller than the heap value—that simple guard prevents redundant relaxations.",
    25: "Dynamic Programming is not magic; it is simply recursion with a memo pad, or bottom-up tabulation. In Coin Change, build answers for amounts 0 through target using previous subproblems. If you can't state what `dp[i]` represents in plain English, you haven't understood the recurrence yet.",
    26: "Longest Increasing Subsequence has an intuitive O(N²) DP solution, but Staff engineers know the O(N log N) patience sorting trick. Keep an array `tails` where `tails[len]` is the smallest ending element of an increasing subsequence of that length, and binary search to update it.",
    27: "2D Grid DP is about looking back at your immediate predecessors. In Unique Paths, you can only arrive at cell (r, c) from above (r-1, c) or from the left (r, c-1). Base cases live on the top row and left column, and space can always be compressed to a single row.",
    28: "Interval problems almost always start by sorting by start time. Once sorted, two intervals either overlap (start2 <= end1) or they don't. If they overlap, stretch the current end to `max(end1, end2)`; if they don't, push the current interval to the result and start a new one.",
    29: "Bit manipulation is computer science at the silicon level. Master the trick `x & (x - 1)`: it clears the lowest set bit in exactly one clock cycle without looping through 32 bits. Today we train your bitwise reflexes so you stop fearing binary operators.",
    30: "The final boss day: Range Queries and Synthesis. Today we look at Fenwick Trees (Binary Indexed Trees), where each index isolates its lowest set bit `i & (-i)` to update and query prefix sums in O(log N). You made it to Day 30—now prove you can connect all these patterns under pressure."
  },

  // Problem-Specific Pre-Code Sanity Checks
  sanityChecks: {
    1: {
      question: "If nums = [3, 3] and target = 6, does your code accidentally match the first 3 with itself, or does it correctly find the two distinct indices?",
      coachCheck: "Check the hash map *before* adding the current number. When i = 0 (val 3), complement 3 is not in map yet, so we insert {3: 0}. When i = 1 (val 3), complement 3 *is* in map at index 0, returning [0, 1] cleanly with no self-matching.",
      targetTime: "O(N)",
      targetSpace: "O(N)"
    },
    3: {
      question: "Is allocating a hash set always necessary, or can you sort the array in O(N log N) if memory is constrained to O(1)?",
      coachCheck: "In an interview, always state this trade-off out loud: Hash set gives O(N) time with O(N) space. In-place sorting gives O(1) auxiliary space at the cost of O(N log N) time and mutating the input array.",
      targetTime: "O(N)",
      targetSpace: "O(N)"
    },
    15: {
      question: "What breaks if the two input strings have different lengths, or if they contain Unicode characters outside ASCII 'a'-'z'?",
      coachCheck: "Always add an immediate guard clause: if (s.length !== t.length) return false. For ASCII lowercase, a fixed size-26 int array runs in true O(1) space, but for general Unicode, use a hash map.",
      targetTime: "O(N)",
      targetSpace: "O(1)"
    },
    16: {
      question: "Sorting each word of length K costs O(K log K). Can you generate the anagram bucket key in strict O(K) time instead?",
      coachCheck: "Yes! Build a 26-element character count string like '#1#0#2...#0' as your hash key. On words of length K, that takes O(K) instead of O(K log K), which interviewers love to see.",
      targetTime: "O(N * K)",
      targetSpace: "O(N * K)"
    },
    38: {
      question: "Can you find the Top K Frequent Elements in O(N) time without using a priority queue (heap)?",
      coachCheck: "Yes—use Bucket Sort! Frequencies can never exceed N, so create an array of lists of size N+1 where index represents frequency. Iterate backwards from index N to collect K elements in linear time.",
      targetTime: "O(N)",
      targetSpace: "O(N)"
    },
    11: {
      question: "Why does Container With Most Water guarantee we never miss a larger container when moving the shorter pointer inward?",
      coachCheck: "Because the container height is limited by the shorter line. Moving the taller line can only decrease width without any chance of increasing the height limit. The shorter line has exhausted its maximum potential.",
      targetTime: "O(N)",
      targetSpace: "O(1)"
    },
    9: {
      question: "In 3Sum, how do you prevent duplicate triplets like [-1, -1, 2] from showing up multiple times in your output?",
      coachCheck: "Sort the array first. Whenever i > 0 and nums[i] === nums[i - 1], skip it with `continue`. Similarly, after finding a match, advance left past identical numbers and right past identical numbers.",
      targetTime: "O(N^2)",
      targetSpace: "O(1)"
    },
    17: {
      question: "In Longest Substring Without Repeating Characters, what goes wrong if you blindly update left = map[char] + 1 without checking where left currently is?",
      coachCheck: "If a duplicate character appeared *before* your current left boundary, blindly jumping could move left *backwards*! Always take `left = Math.max(left, map[char] + 1)`.",
      targetTime: "O(N)",
      targetSpace: "O(min(N, M))"
    },
    20: {
      question: "Why does Valid Parentheses require a stack rather than just counting open and close brackets like `count++` and `count--`?",
      coachCheck: "Because bracket types must match in nested order: '([)]' has equal counts of brackets, but is completely invalid. A stack verifies that the most recently opened bracket is closed first.",
      targetTime: "O(N)",
      targetSpace: "O(N)"
    },
    21: {
      question: "In Min Stack, how do you return the minimum element in O(1) without scanning the stack, even after elements are popped?",
      coachCheck: "Maintain a parallel stack (or pair) that stores the minimum seen up to each depth. When an element is pushed, push `min(val, current_min)` to the min-stack.",
      targetTime: "O(1)",
      targetSpace: "O(N)"
    },
    24: {
      question: "In Search in Rotated Sorted Array, why can't you just check if target > nums[mid] to decide which direction to search?",
      coachCheck: "Because rotation breaks global monotonicity. You must first determine whether the left half [low..mid] or the right half [mid..high] is normally sorted, then check if target lies within that sorted window.",
      targetTime: "O(log N)",
      targetSpace: "O(1)"
    },
    26: {
      question: "In Reverse Linked List, what is the single most common bug when reversing pointers iteratively?",
      coachCheck: "Severing curr.next before saving it! If you execute `curr.next = prev` without first doing `const next = curr.next`, you lose reference to the rest of the list forever.",
      targetTime: "O(N)",
      targetSpace: "O(1)"
    },
    27: {
      question: "In Linked List Cycle, why does Floyd's Tortoise and Hare never get stuck in an infinite loop inside the cycle?",
      coachCheck: "Because fast moves 2 steps and slow moves 1 step, the distance between them inside a cycle of length C increases (or closes) by exactly 1 node per iteration. A distance decreasing by 1 must hit 0.",
      targetTime: "O(N)",
      targetSpace: "O(1)"
    },
    31: {
      question: "In Validate Binary Search Tree, why is checking `root.left.val < root.val && root.right.val > root.val` insufficient?",
      coachCheck: "Because BST requires *all* nodes in the left subtree to be smaller than the root, not just immediate children. You must pass valid bounds `(min_val, max_val)` down recursively.",
      targetTime: "O(N)",
      targetSpace: "O(H)"
    },
    42: {
      question: "In Number of Islands, why does putting `visited[r][c] = true` at the moment of POPPING from the queue cause a Memory Limit Exceeded (MLE) or TLE?",
      coachCheck: "If you wait until popping to mark visited, multiple neighboring cells will push that same cell to the queue multiple times! Always mark visited the exact moment you PUSH to the queue.",
      targetTime: "O(R * C)",
      targetSpace: "O(R * C)"
    },
    46: {
      question: "In Coin Change, why doesn't a greedy choice (always picking the largest coin) produce the optimal answer?",
      coachCheck: "Counterexample: coins = [1, 3, 4], amount = 6. Greedy takes 4, leaving 2 (takes 1 + 1 = 3 coins total). But the optimal answer is 3 + 3 (2 coins). DP explores all transitions.",
      targetTime: "O(N * Amount)",
      targetSpace: "O(Amount)"
    }
  },

  // Coach's Spoken Reactions to Outcomes
  reactions: {
    cold: "Respect. You earned that one cold. Before you jump to the next problem, say out loud in two plain sentences why your time complexity holds.",
    buggy: "You got Accepted, but tripping on bugs during an interview costs 15 minutes of panicky live debugging. Review your bug tags below so your subconscious stays vigilant next time.",
    hints: "Reading hints feels like understanding, but the memory fades within 48 hours. Don't just nod—close the solution tab, rewrite the code from blank memory now, and I've put this in your Rematch Queue for 3 days from now.",
    editorial: "Reading the editorial gave you the answer, not the neural wiring. Close the solution tab immediately, implement it cold from scratch, and prepare for a mandatory rematch tomorrow.",
    nudgeWarning: "Stop for a second. Have you actually drawn a 5-element example on paper and traced it by hand? Struggle is what rewires your brain. Give it 15 honest minutes on paper before opening this nudge."
  }
};

if (typeof module !== 'undefined') {
  module.exports = { COACH_DATA };
}
