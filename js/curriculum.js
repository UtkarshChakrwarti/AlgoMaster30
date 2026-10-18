// ============================================================================
// ALGOMASTER 30 — NEETCODE ROADMAP PROGRESSION × ICPC MASTER CURRICULUM
// 30 Days strictly aligned to the NeetCode Roadmap structure.
// Every single one of the 75 Blind 75 questions is explicitly scheduled as daily tasks!
// ============================================================================

const CURRICULUM_DATABASE = [
  // --------------------------------------------------------------------------
  // PHASE 1: ARRAYS, TWO POINTERS & SLIDING WINDOW (Days 1 - 6)
  // --------------------------------------------------------------------------
  {
    day: 1,
    phase: "Phase 1: Arrays & Pointers",
    category: "Arrays & Hashing",
    title: "Arrays & Hashing I: Complements & Hash Sets",
    subtitle: "NeetCode Step 1 — O(1) Lookups, State Deduplication, and Anagram Invariants",
    authoritativeResources: [
      {
        title: "USACO Guide Bronze: Introduction to Sets & Maps",
        source: "USACO Guide",
        type: "Foundational Monograph",
        url: "https://usaco.guide/bronze/intro-sets",
        description: "Hashing invariants, average O(1) lookup proofs, collision resolution, and frequency count arrays."
      },
      {
        title: "CP-Algorithms: String Hashing & Frequency Buckets",
        source: "CP-Algorithms",
        type: "Mathematical Theory",
        url: "https://cp-algorithms.com/string/string-hashing.html",
        description: "Polynomial rolling hash functions and deterministic anagram frequency vectors."
      }
    ],
    blind75Tasks: [
      { id: 1, title: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/", invariant: "Single-pass complement lookup: check (target - x) before inserting x." },
      { id: 3, title: "Contains Duplicate", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/", invariant: "Set insertion cardinality: seen before triggers early exit true." },
      { id: 15, title: "Valid Anagram", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/", invariant: "26-length character frequency vector equivalence." }
    ],
    extremeProblem: {
      title: "Distinct Numbers",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1621",
      url: "https://cses.fi/problemset/task/1621/",
      whyThisBenchmark: "Sorting vs hash set trade-offs on 2*10^5 elements under strict 1.00s execution."
    },
    invariant: "Hash tables provide expected O(1) average access. For problems with target sums, maintaining seen elements allows immediate verification of whether (target - current) has appeared previously, reducing naive O(N^2) searches to strict O(N).",
    amortizedProof: "Inserting N items into a hash table with good universal hash distribution runs in expected O(N) aggregate time. Auxiliary space is bounded by the number of unique elements O(U) <= O(N).",
    traps: [
      "Using the same element twice in Two Sum: verify that the index of the complement is distinct from current index.",
      "Hash collision DOS attacks in competitive programming: in C++, `std::unordered_map` can be hacked to O(N^2) without a custom splitmix64 hash functor."
    ],
    iqsRules: ["Validate empty or singleton input immediately with guard clause.", "Name frequency maps descriptively (e.g. `character_frequency_map`)."],
    socraticHints: {
      hint1: "Observation: Instead of searching forward for every number's pair, ask: 'Have I already seen what this number needs?'",
      hint2: "State Invariant: At step i, the map contains exactly the elements nums[0..i-1]. If target - nums[i] is in the map, a valid pair is found.",
      hint3: "Skeleton: Loop i from 0 to N-1: complement = target - nums[i]. If complement in map return [map[complement], i]. map[nums[i]] = i."
    },
    starterCode: {
      cpp: `// Day 1: Arrays & Hashing (Two Sum)\n#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(const std::vector<int>& numbers, int target) {\n        if (numbers.size() < 2) return {};\n        std::unordered_map<int, int> value_to_index_map;\n        \n        for (int current_index = 0; current_index < static_cast<int>(numbers.size()); ++current_index) {\n            int complement = target - numbers[current_index];\n            auto lookup_iterator = value_to_index_map.find(complement);\n            if (lookup_iterator != value_to_index_map.end()) {\n                return {lookup_iterator->second, current_index};\n            }\n            value_to_index_map[numbers[current_index]] = current_index;\n        }\n        return {};\n    }\n};`,
      java: `import java.util.HashMap;\nimport java.util.Map;\n\npublic class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        if (numbers == null || numbers.length < 2) return new int[0];\n        Map<Integer, Integer> valueToIndexMap = new HashMap<>();\n        for (int i = 0; i < numbers.length; i++) {\n            int complement = target - numbers[i];\n            if (valueToIndexMap.containsKey(complement)) {\n                return new int[]{valueToIndexMap.get(complement), i};\n            }\n            valueToIndexMap.put(numbers[i], i);\n        }\n        return new int[0];\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        if len(numbers) < 2: return []\n        value_to_index_map = {}\n        for current_index, val in enumerate(numbers):\n            complement = target - val\n            if complement in value_to_index_map:\n                return [value_to_index_map[complement], current_index]\n            value_to_index_map[val] = current_index\n        return []`
    }
  },
  {
    day: 2,
    phase: "Phase 1: Arrays & Pointers",
    category: "Arrays & Hashing",
    title: "Arrays & Hashing II: Signatures & Frequency Bucketing",
    subtitle: "NeetCode Step 2 — Canonical Key Representations and Prefix/Suffix Accumulations",
    authoritativeResources: [
      {
        title: "USACO Guide Silver: Prefix Sums",
        source: "USACO Guide",
        type: "Comprehensive Theory",
        url: "https://usaco.guide/silver/prefix-sums",
        description: "Decomposing products and sums into prefix and suffix accumulators to eliminate division operations."
      }
    ],
    blind75Tasks: [
      { id: 16, title: "Group Anagrams", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/", invariant: "Sorted word or 26-char frequency tuple as unique map key." },
      { id: 38, title: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/", invariant: "Bucket sort by frequencies [0..N] achieves exact O(N) linear time." },
      { id: 4, title: "Product of Array Except Self", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/", invariant: "output[i] = prefix_product[i-1] * suffix_product[i+1] without division in O(1) extra space." },
      { id: 5, title: "Maximum Subarray", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/", invariant: "Kadane's algorithm: curr_sum = max(x, curr_sum + x); max_sum = max(max_sum, curr_sum)." }
    ],
    extremeProblem: {
      title: "Sum of Two Values",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1640",
      url: "https://cses.fi/problemset/task/1640/",
      whyThisBenchmark: "Strict 1-indexed target sum verification on 2*10^5 elements."
    },
    invariant: "Prefix-Suffix decomposition: An aggregated query excluding index i decomposes into independent prefix accumulator [0..i-1] and suffix accumulator [i+1..N-1]. Computing suffix on-the-fly reduces auxiliary space to O(1).",
    amortizedProof: "Two linear passes: first pass populates prefix products in O(N); second reverse pass computes running suffix in O(1) space. Total time O(N).",
    traps: [
      "Zero Handling: In Product Except Self, division by zero makes division-based solutions invalid when zeroes exist in array.",
      "Sorting Strings in Group Anagrams: String sorting takes O(K log K) per word. For very long strings, use 26-character frequency count strings to achieve O(K)."
    ],
    iqsRules: ["Explicitly state that output array does not count toward auxiliary space complexity."],
    socraticHints: {
      hint1: "Observation: Can you calculate the answer for element i using only elements before it, and then combine it with elements after it?",
      hint2: "State Invariant: First pass: ans[i] = product of all elements to the left of i. Second pass: maintain running_suffix product from right to left.",
      hint3: "Skeleton: ans[0] = 1. For i in 1..N-1: ans[i] = ans[i-1] * nums[i-1]. suffix = 1. For i in N-1 down to 0: ans[i] *= suffix; suffix *= nums[i]."
    },
    starterCode: {
      cpp: `// Day 2 Product of Array Except Self\n#include <vector>\nclass Solution {\npublic:\n    std::vector<int> productExceptSelf(const std::vector<int>& numbers) {\n        int n = numbers.size();\n        std::vector<int> result(n, 1);\n        for (int i = 1; i < n; ++i) result[i] = result[i - 1] * numbers[i - 1];\n        int suffix_product = 1;\n        for (int i = n - 1; i >= 0; --i) {\n            result[i] *= suffix_product;\n            suffix_product *= numbers[i];\n        }\n        return result;\n    }\n};`,
      java: `public class Solution {\n    public int[] productExceptSelf(int[] numbers) {\n        int n = numbers.length;\n        int[] result = new int[n];\n        result[0] = 1;\n        for (int i = 1; i < n; i++) result[i] = result[i - 1] * numbers[i - 1];\n        int suffix = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            result[i] *= suffix;\n            suffix *= numbers[i];\n        }\n        return result;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def productExceptSelf(self, numbers: List[int]) -> List[int]:\n        n = len(numbers)\n        result = [1] * n\n        for i in range(1, n): result[i] = result[i-1] * numbers[i-1]\n        suffix = 1\n        for i in range(n-1, -1, -1):\n            result[i] *= suffix\n            suffix *= numbers[i]\n        return result`
    }
  },
  {
    day: 3,
    phase: "Phase 1: Arrays & Pointers",
    category: "Arrays & Matrix",
    title: "Arrays & Matrix: Sequences & In-Place Grid Sweeps",
    subtitle: "NeetCode Step 3 — Boundary Shrinking, Set Heads, and State Flags",
    authoritativeResources: [
      {
        title: "TopCoder: In-Place Matrix Transformations",
        source: "TopCoder",
        type: "Memory Optimization Guide",
        url: "https://www.topcoder.com/thrive/articles",
        description: "Matrix transposition along main diagonal followed by column reversal for 90-degree rotations."
      }
    ],
    blind75Tasks: [
      { id: 46, title: "Longest Consecutive Sequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/", invariant: "Only expand streaks from sequence heads (where x - 1 is not in set) for O(N) amortized." },
      { id: 71, title: "Set Matrix Zeroes", difficulty: "Medium", url: "https://leetcode.com/problems/set-matrix-zeroes/", invariant: "Use first row and first column as in-place storage flags for O(1) extra space." },
      { id: 72, title: "Spiral Matrix", difficulty: "Medium", url: "https://leetcode.com/problems/spiral-matrix/", invariant: "Shrink top, bottom, left, right bounds after completing each leg." },
      { id: 73, title: "Rotate Image", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-image/", invariant: "Transpose matrix across diagonal, then reverse each row horizontally." }
    ],
    extremeProblem: {
      title: "Forest Queries",
      platform: "CSES Range Queries",
      difficulty: "CSES Task 1652",
      url: "https://cses.fi/problemset/task/1652/",
      whyThisBenchmark: "2D inclusion-exclusion prefix sum queries on 1000x1000 grid in O(1) per query."
    },
    invariant: "Sequence Head Invariant: An element x is the head of a consecutive sequence if and only if (x - 1) is not in the set. Checking this condition guarantees that each sequence is traversed exactly once, achieving amortized O(N).",
    amortizedProof: "Each element is checked for presence of (x - 1) in O(1). Only elements that are sequence heads trigger a while loop, which visits each element in the streak once. Aggregate loop steps across all streaks = N. Total time O(N).",
    traps: [
      "Starting traversal from non-head elements: iterating when (x - 1) is present causes O(N^2) worst case on descending arrays.",
      "Matrix in-place flag overlap: row 0 and col 0 overlap at cell (0, 0); use a separate boolean variable `first_row_zero`."
    ],
    iqsRules: ["Do not allocate auxiliary visited sets when in-place matrix flags can be used."],
    socraticHints: {
      hint1: "Observation: In Longest Consecutive Sequence, how can you immediately tell if an element is the start of a streak?",
      hint2: "State Invariant: If num - 1 is in the set, skip num! It will be counted when its streak head is reached.",
      hint3: "Skeleton: Put all nums in set. For x in set: if (x - 1) not in set: streak = 1; while (x + streak) in set: streak += 1; ans = max(ans, streak)."
    },
    starterCode: {
      cpp: `// Day 3 Longest Consecutive Sequence\n#include <vector>\n#include <unordered_set>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int longestConsecutive(const std::vector<int>& numbers) {\n        std::unordered_set<int> unique_values(numbers.begin(), numbers.end());\n        int longest_streak = 0;\n        \n        for (const int value : unique_values) {\n            if (unique_values.find(value - 1) == unique_values.end()) {\n                int current_value = value;\n                int current_streak = 1;\n                while (unique_values.find(current_value + 1) != unique_values.end()) {\n                    current_value++;\n                    current_streak++;\n                }\n                longest_streak = std::max(longest_streak, current_streak);\n            }\n        }\n        return longest_streak;\n    }\n};`,
      java: `import java.util.HashSet;\nimport java.util.Set;\n\npublic class Solution {\n    public int longestConsecutive(int[] numbers) {\n        Set<Integer> set = new HashSet<>();\n        for (int num : numbers) set.add(num);\n        int longestStreak = 0;\n        for (int num : set) {\n            if (!set.contains(num - 1)) {\n                int curr = num, streak = 1;\n                while (set.contains(curr + 1)) { curr++; streak++; }\n                longestStreak = Math.max(longestStreak, streak);\n            }\n        }\n        return longestStreak;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def longestConsecutive(self, numbers: List[int]) -> int:\n        unique_set = set(numbers)\n        longest_streak = 0\n        for value in unique_set:\n            if value - 1 not in unique_set:\n                curr = value\n                streak = 1\n                while curr + 1 in unique_set:\n                    curr += 1\n                    streak += 1\n                longest_streak = max(longest_streak, streak)\n        return longest_streak`
    }
  },
  {
    day: 4,
    phase: "Phase 1: Arrays & Pointers",
    category: "Two Pointers",
    title: "Two Pointers: Inward Convergence & Bottleneck Elimination",
    subtitle: "NeetCode Step 4 — Symmetric Traversal, Duplicate Skipping, and Greedy Area Pruning",
    authoritativeResources: [
      {
        title: "USACO Guide Silver: Two Pointers",
        source: "USACO Guide",
        type: "Canonical Theory",
        url: "https://usaco.guide/silver/two-pointers",
        description: "Formal proof of two pointers convergence, sorted invariants, and bottleneck advancement."
      }
    ],
    blind75Tasks: [
      { id: 11, title: "Valid Palindrome", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/", invariant: "Symmetric convergence inward while skipping non-alphanumeric characters." },
      { id: 9, title: "3Sum", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/", invariant: "Sort + Fix i + Two pointers. Skip duplicate values on i, left, and right." },
      { id: 10, title: "Container With Most Water", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/", invariant: "Width decreases monotonically; moving taller bar can never increase area; must advance shorter bar." }
    ],
    extremeProblem: {
      title: "Sum of Three Values",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1641",
      url: "https://cses.fi/problemset/task/1641/",
      whyThisBenchmark: "Standard 3Sum target search on 5000 elements in O(N^2) under strict time bounds."
    },
    invariant: "Bottleneck Monotonicity: Area = min(height[left], height[right]) * (right - left). Since (right - left) decreases monotonically at each inward step, moving the pointer pointing to the taller height can only decrease the bottleneck height while decreasing the width, guaranteeing area cannot increase. Thus, advancing the shorter height is strictly required.",
    amortizedProof: "Pointers left = 0 and right = N - 1 move towards each other by at least 1 index per iteration. Loop terminates in exact N - 1 steps: O(N) time and O(1) space.",
    traps: [
      "Duplicate Triplets in 3Sum: Forgetting `while (left < right && nums[left] == nums[left+1]) left++;`.",
      "Equal Heights: When height[left] == height[right], either pointer can be moved without missing the optimal solution."
    ],
    iqsRules: ["Name pointers `left_boundary` and `right_boundary` rather than `l` and `r` in complex conditions."],
    socraticHints: {
      hint1: "Observation: In Container With Most Water, if height[left] < height[right], can moving right inward ever give a bigger area than current?",
      hint2: "State Invariant: The bar with the smaller height has already achieved its maximum possible area with all remaining candidates. It can be safely discarded.",
      hint3: "Skeleton: left = 0, right = N-1. While left < right: max_area = max(max_area, min(h[left], h[right]) * (right - left)). If h[left] < h[right] left++ else right--."
    },
    starterCode: {
      cpp: `// Day 4 Container With Most Water\n#include <vector>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int maxArea(const std::vector<int>& height) {\n        int left = 0, right = static_cast<int>(height.size()) - 1;\n        int max_water_volume = 0;\n        while (left < right) {\n            int current_width = right - left;\n            int bounding_height = std::min(height[left], height[right]);\n            max_water_volume = std::max(max_water_volume, bounding_height * current_width);\n            if (height[left] < height[right]) ++left;\n            else --right;\n        }\n        return max_water_volume;\n    }\n};`,
      java: `public class Solution {\n    public int maxArea(int[] height) {\n        int left = 0, right = height.length - 1;\n        int maxWater = 0;\n        while (left < right) {\n            maxWater = Math.max(maxWater, Math.min(height[left], height[right]) * (right - left));\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxWater;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def maxArea(self, height: List[int]) -> int:\n        left, right = 0, len(height) - 1\n        max_water = 0\n        while left < right:\n            max_water = max(max_water, min(height[left], height[right]) * (right - left))\n            if height[left] < height[right]: left += 1\n            else: right -= 1\n        return max_water`
    }
  },
  {
    day: 5,
    phase: "Phase 1: Arrays & Pointers",
    category: "Sliding Window",
    title: "Sliding Window I: Running Extrema & Dynamic Substrings",
    subtitle: "NeetCode Step 5 — Monotonic Windows, Last-Seen Indices, and O(N) Substrings",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Sliding Window Extrema",
        source: "CP-Algorithms",
        type: "Comprehensive Theory",
        url: "https://cp-algorithms.com/data_structures/stack_queue_modification.html#finding-the-minimum-for-all-subarrays-of-fixed-length",
        description: "Dynamic window boundaries, index eviction invariants, and maintaining running extrema."
      }
    ],
    blind75Tasks: [
      { id: 2, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", invariant: "Running minimum price seen so far: profit[i] = price[i] - min_price." },
      { id: 12, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", invariant: "Jump left boundary to max(left, last_seen[char] + 1) in O(1)." }
    ],
    extremeProblem: {
      title: "Subarray Sums I",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1660",
      url: "https://cses.fi/problemset/task/1660/",
      whyThisBenchmark: "Sliding window sum with strictly positive numbers finding subarray count with sum x."
    },
    invariant: "Last-Seen Jump Invariant: For substring without repeats, window [window_start, window_end] is valid iff no character repeats. When character c at window_end was last seen at index idx >= window_start, window_start jumps directly to idx + 1.",
    amortizedProof: "Both window_start and window_end move strictly forward. Total window movements <= 2N, guaranteeing exact O(N) time with O(min(N, Sigma)) space.",
    traps: [
      "Stale Last-Seen Indices: If last_seen[c] < window_start, do NOT retreat window_start backward! Always use `window_start = max(window_start, last_seen[c] + 1)`."
    ],
    iqsRules: ["Clearly distinguish character alphabet size (e.g. 128 ASCII or 26 lowercase) in space complexity analysis."],
    socraticHints: {
      hint1: "Observation: When you see a duplicate character, where does the new valid window have to start?",
      hint2: "State Invariant: The new window must start immediately after the previous occurrence of that character.",
      hint3: "Skeleton: last_seen map. start = 0. For end in 0..N-1: if s[end] in map: start = max(start, map[s[end]] + 1). ans = max(ans, end - start + 1). map[s[end]] = end."
    },
    starterCode: {
      cpp: `// Day 5 Longest Substring Without Repeating Characters\n#include <string>\n#include <vector>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(const std::string& text) {\n        std::vector<int> last_seen_index(128, -1);\n        int window_start = 0, max_length = 0;\n        for (int window_end = 0; window_end < static_cast<int>(text.length()); ++window_end) {\n            char current_char = text[window_end];\n            if (last_seen_index[current_char] >= window_start) {\n                window_start = last_seen_index[current_char] + 1;\n            }\n            last_seen_index[current_char] = window_end;\n            max_length = std::max(max_length, window_end - window_start + 1);\n        }\n        return max_length;\n    }\n};`,
      java: `public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int[] lastSeen = new int[128];\n        java.util.Arrays.fill(lastSeen, -1);\n        int start = 0, maxLen = 0;\n        for (int end = 0; end < s.length(); end++) {\n            char c = s.charAt(end);\n            if (lastSeen[c] >= start) start = lastSeen[c] + 1;\n            lastSeen[c] = end;\n            maxLen = Math.max(maxLen, end - start + 1);\n        }\n        return maxLen;\n    }\n}`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        last_seen = {}\n        start = max_len = 0\n        for end, char in enumerate(s):\n            if char in last_seen and last_seen[char] >= start:\n                start = last_seen[char] + 1\n            last_seen[char] = end\n            max_len = max(max_len, end - start + 1)\n        return max_len`
    }
  },
  {
    day: 6,
    phase: "Phase 1: Arrays & Pointers",
    category: "Sliding Window",
    title: "Sliding Window II: Window Extrema & Frequency Deficits",
    subtitle: "NeetCode Step 6 — Monotonic Deques, Deficit Counters, and Hard Window Bounds",
    authoritativeResources: [
      {
        title: "USACO Guide Gold: Sliding Window Extrema (Deques)",
        source: "USACO Guide",
        type: "Olympiad Masterclass",
        url: "https://usaco.guide/gold/stacks",
        description: "Monotonic decreasing deques maintaining candidate optimality in amortized O(1)."
      }
    ],
    blind75Tasks: [
      { id: 13, title: "Longest Repeating Character Replacement", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", invariant: "Window length - max_frequency <= k is valid condition." },
      { id: 14, title: "Minimum Window Substring", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/", invariant: "Frequency deficit counter: Expand right until deficit 0; contract left to find minimal valid boundary." },
      { id: 75, title: "Sliding Window Maximum", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/", invariant: "Monotonic decreasing deque: Discard elements smaller than incoming element from back; discard stale indices from front." }
    ],
    extremeProblem: {
      title: "Sliding Window Cost",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1077",
      url: "https://cses.fi/problemset/task/1077/",
      whyThisBenchmark: "Maintaining dynamic running median across sliding window using two balanced multisets."
    },
    invariant: "Monotonic Deque Invariant: Indices in deque maintain strictly decreasing values. If index j > i and nums[j] >= nums[i], nums[i] can never be the maximum in any current or future window containing j and can be popped immediately.",
    amortizedProof: "Each element is pushed once and popped from deque at most once across the entire sweep. Total deque operations bounded by 2N = O(N) time.",
    traps: [
      "Front eviction timing: Only pop front when `deque.front() <= window_end - window_size`.",
      "Minimum Window Substring missing characters: Keep a distinct satisfied-characters counter to verify validity in O(1) instead of re-scanning 128 frequencies."
    ],
    iqsRules: ["Name the deque `decreasing_candidate_indices` instead of `dq`."],
    socraticHints: {
      hint1: "Observation: When a large element enters the window, all smaller elements that arrived before it are rendered permanently useless.",
      hint2: "State Invariant: Deque contains only elements that could possibly be the maximum for the current or a future window.",
      hint3: "Skeleton: For i in 0..N-1: while deque and deque.front() <= i - k: pop_front. While deque and nums[deque.back()] <= nums[i]: pop_back. Push i. If i >= k-1: ans.push(nums[deque.front()])."
    },
    starterCode: {
      cpp: `// Day 6 Sliding Window Maximum Deque\n#include <vector>\n#include <deque>\n\nclass Solution {\npublic:\n    std::vector<int> maxSlidingWindow(const std::vector<int>& numbers, int k) {\n        std::deque<int> decreasing_indices;\n        std::vector<int> result;\n        for (int i = 0; i < static_cast<int>(numbers.size()); ++i) {\n            while (!decreasing_indices.empty() && decreasing_indices.front() <= i - k) decreasing_indices.pop_front();\n            while (!decreasing_indices.empty() && numbers[decreasing_indices.back()] <= numbers[i]) decreasing_indices.pop_back();\n            decreasing_indices.push_back(i);\n            if (i >= k - 1) result.push_back(numbers[decreasing_indices.front()]);\n        }\n        return result;\n    }\n};`,
      java: `import java.util.ArrayDeque;\nimport java.util.Deque;\npublic class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] ans = new int[n - k + 1];\n        Deque<Integer> dq = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();\n            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();\n            dq.offerLast(i);\n            if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];\n        }\n        return ans;\n    }\n}`,
      python: `from typing import List\nfrom collections import deque\nclass Solution:\n    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:\n        dq = deque()\n        ans = []\n        for i, val in enumerate(nums):\n            while dq and dq[0] <= i - k: dq.popleft()\n            while dq and nums[dq[-1]] <= val: dq.pop()\n            dq.append(i)\n            if i >= k - 1: ans.append(nums[dq[0]])\n        return ans`
    }
  },

  // --------------------------------------------------------------------------
  // PHASE 2: STACKS, BINARY SEARCH & LINKED LISTS (Days 7 - 12)
  // --------------------------------------------------------------------------
  {
    day: 7,
    phase: "Phase 2: Stacks, Search & Lists",
    category: "Stack",
    title: "Stack: LIFO Nesting & Monotonic Spans",
    subtitle: "NeetCode Step 7 — Balanced Parentheses, Min Stacks, and Temperature Spans",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Minimum Stack & Queue",
        source: "CP-Algorithms",
        type: "Data Structure Proof",
        url: "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
        description: "Maintaining O(1) minimum queries using pair<val, min_so_far> stack frames."
      }
    ],
    blind75Tasks: [
      { id: 17, title: "Valid Parentheses", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/", invariant: "Every closing bracket must match type of most recent unmatched opening bracket on top of stack." }
    ],
    extremeProblem: {
      title: "Daily Temperatures",
      platform: "LeetCode 739",
      difficulty: "Medium",
      url: "https://leetcode.com/problems/daily-temperatures/",
      whyThisBenchmark: "Next greater element span: finding distance to next warmer temperature in O(N)."
    },
    invariant: "LIFO Nesting Invariant: Sub-expressions resolve from innermost to outermost. A closing bracket cancels the top opening bracket if types match; any mismatch or premature stack emptiness immediately proves invalidity.",
    amortizedProof: "Each character is pushed and popped at most once: exact O(N) runtime and O(N) space.",
    traps: ["Starting string with a closing bracket: checking `stack.top()` on empty stack causes segfault."],
    iqsRules: ["Return early `if (s.length() % 2 != 0) return false;` at the very top."],
    socraticHints: {
      hint1: "Observation: Can an odd-length string ever be valid?",
      hint2: "State Invariant: The stack stores unmatched opening brackets. When a closing bracket arrives, it MUST match the top of the stack.",
      hint3: "Skeleton: For c in s: if c in '({[' push c. Else if stack empty or mismatch return false; else pop. Return stack.empty()."
    },
    starterCode: {
      cpp: `// Day 7 Valid Parentheses\n#include <string>\n#include <stack>\n\nclass Solution {\npublic:\n    bool isValid(const std::string& brackets) {\n        if (brackets.length() % 2 != 0) return false;\n        std::stack<char> open_brackets;\n        for (char c : brackets) {\n            if (c == '(') open_brackets.push(')');\n            else if (c == '{') open_brackets.push('}');\n            else if (c == '[') open_brackets.push(']');\n            else {\n                if (open_brackets.empty() || open_brackets.top() != c) return false;\n                open_brackets.pop();\n            }\n        }\n        return open_brackets.empty();\n    }\n};`,
      java: `import java.util.ArrayDeque;\nimport java.util.Deque;\npublic class Solution {\n    public boolean isValid(String s) {\n        if (s.length() % 2 != 0) return false;\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        if len(s) % 2 != 0: return False\n        stack = []\n        mapping = {')': '(', '}': '{', ']': '['}\n        for char in s:\n            if char in mapping:\n                if not stack or stack.pop() != mapping[char]: return False\n            else:\n                stack.append(char)\n        return not stack`
    }
  },
  {
    day: 8,
    phase: "Phase 2: Stacks, Search & Lists",
    category: "Stack",
    title: "Monotonic Stacks: Boundary Extents & Sentinels",
    subtitle: "NeetCode Step 8 — Virtual Sentinels, Span of Control, and O(N) Histograms",
    authoritativeResources: [
      {
        title: "USACO Guide Gold: Monotonic Stacks",
        source: "USACO Guide",
        type: "Olympiad Masterclass",
        url: "https://usaco.guide/gold/stacks",
        description: "Virtual boundary sentinels and span of control calculations."
      }
    ],
    blind75Tasks: [
      { id: 74, title: "Largest Rectangle in Histogram", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", invariant: "Strictly increasing height stack with virtual sentinels at -1 and N computing width in O(1)." }
    ],
    extremeProblem: {
      title: "Mike and Feet",
      platform: "Codeforces 547B",
      difficulty: "1900 Rating",
      url: "https://codeforces.com/problemset/problem/547/B",
      whyThisBenchmark: "Computing maximum of minimums for all window sizes 1..N in O(N)."
    },
    invariant: "Boundary Invariant: When popping bar y because of incoming bar x, x is strictly y's first smaller element to the right, and the bar beneath y in the stack is y's first smaller element to the left.",
    amortizedProof: "Each bar enters the stack once and is popped once. Aggregate operations bounded by 2N = O(N).",
    traps: ["Duplicate bar heights: handling ties using virtual height-0 sentinels."],
    iqsRules: ["Name the stack `increasing_height_indices`."],
    socraticHints: {
      hint1: "Observation: For each bar, what is the largest rectangle using its entire height?",
      hint2: "State Invariant: Maintain increasing heights in the stack.",
      hint3: "Skeleton: Loop i from 0 to N. While heights[stack.top()] >= current_height: pop, width = i - stack.top() - 1, update max."
    },
    starterCode: {
      cpp: `// Day 8 Largest Rectangle in Histogram\n#include <vector>\n#include <stack>\n#include <algorithm>\nclass Solution {\npublic:\n    int largestRectangleArea(const std::vector<int>& heights) {\n        std::stack<int> st;\n        int max_area = 0, n = heights.size();\n        for (int i = 0; i <= n; ++i) {\n            int h = (i == n) ? 0 : heights[i];\n            while (!st.empty() && heights[st.top()] >= h) {\n                int bar_h = heights[st.top()]; st.pop();\n                int left = st.empty() ? -1 : st.top();\n                max_area = std::max(max_area, bar_h * (i - left - 1));\n            }\n            st.push(i);\n        }\n        return max_area;\n    }\n};`,
      java: `import java.util.ArrayDeque;\nimport java.util.Deque;\npublic class Solution {\n    public int largestRectangleArea(int[] heights) {\n        Deque<Integer> st = new ArrayDeque<>();\n        int maxArea = 0, n = heights.length;\n        for (int i = 0; i <= n; i++) {\n            int h = (i == n) ? 0 : heights[i];\n            while (!st.isEmpty() && heights[st.peek()] >= h) {\n                int barH = heights[st.pop()];\n                int left = st.isEmpty() ? -1 : st.peek();\n                maxArea = Math.max(maxArea, barH * (i - left - 1));\n            }\n            st.push(i);\n        }\n        return maxArea;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def largestRectangleArea(self, heights: List[int]) -> int:\n        st = []\n        max_area = 0\n        n = len(heights)\n        for i in range(n + 1):\n            h = 0 if i == n else heights[i]\n            while st and heights[st[-1]] >= h:\n                bar_h = heights[st.pop()]\n                left = st[-1] if st else -1\n                max_area = max(max_area, bar_h * (i - left - 1))\n            st.append(i)\n        return max_area`
    }
  },
  {
    day: 9,
    phase: "Phase 2: Stacks, Search & Lists",
    category: "Binary Search",
    title: "Binary Search I: Rotated Partitions & Monotonicity",
    subtitle: "NeetCode Step 9 — Inflection Points, Sorted Halves, and O(log N) Queries",
    authoritativeResources: [
      {
        title: "TopCoder: Binary Search Comprehensive Tutorial",
        source: "TopCoder (lovro)",
        type: "Canonical Algorithm Monograph",
        url: "https://www.topcoder.com/thrive/articles/Binary%20Search",
        description: "Discrete predicate invariants, range halving proofs, and boundary termination."
      }
    ],
    blind75Tasks: [
      { id: 8, title: "Search in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", invariant: "Sorted Half Guarantee: At least one half is strictly sorted. Check if target lies within sorted half interval." },
      { id: 7, title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", invariant: "Inflection Monotonicity: Compare nums[mid] with nums[right]. If nums[mid] > nums[right], minimum lies strictly in right half." }
    ],
    extremeProblem: {
      title: "Factory Machines",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1620",
      url: "https://cses.fi/problemset/task/1620/",
      whyThisBenchmark: "Search on answer: Minimum time to produce t products across n machines."
    },
    invariant: "Partition Invariant: In a rotated sorted array without duplicates, for any midpoint mid, at least one of [low..mid] or [mid..high] is guaranteed to be strictly sorted in ascending order.",
    amortizedProof: "The search space size S = high - low + 1 is divided by 2 on each step. Maximum steps = ceil(log2(N)) = O(log N) time, O(1) space.",
    traps: ["Integer overflow: use `low + (high - low) / 2` instead of `(low + high) / 2`."],
    iqsRules: ["Document which half is proven sorted in comments."],
    socraticHints: {
      hint1: "Observation: If you cut a rotated sorted array in half, is it possible for BOTH halves to be unsorted?",
      hint2: "State Invariant: One half is always sorted! Check whether target falls inside that sorted range.",
      hint3: "Skeleton: If nums[low] <= nums[mid]: left is sorted; test target in [nums[low], nums[mid]]. Else right is sorted."
    },
    starterCode: {
      cpp: `// Day 9 Search in Rotated Sorted Array\n#include <vector>\nclass Solution {\npublic:\n    int search(const std::vector<int>& nums, int target) {\n        int low = 0, high = static_cast<int>(nums.size()) - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[low] <= nums[mid]) {\n                if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n                else low = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n                else high = mid - 1;\n            }\n        }\n        return -1;\n    }\n};`,
      java: `public class Solution {\n    public int search(int[] nums, int target) {\n        int low = 0, high = nums.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[low] <= nums[mid]) {\n                if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n                else low = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n                else high = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        low, high = 0, len(nums) - 1\n        while low <= high:\n            mid = low + (high - low) // 2\n            if nums[mid] == target: return mid\n            if nums[low] <= nums[mid]:\n                if nums[low] <= target < nums[mid]: high = mid - 1\n                else: low = mid + 1\n            else:\n                if nums[mid] < target <= nums[high]: low = mid + 1\n                else: high = mid - 1\n        return -1`
    }
  },
  {
    day: 10,
    phase: "Phase 2: Stacks, Search & Lists",
    category: "Binary Search",
    title: "Binary Search II: Search on Answer & Median Partitions",
    subtitle: "NeetCode Step 10 — Monotonic Decision Predicates and Logarithmic Partitions",
    authoritativeResources: [
      {
        title: "Errichto: Binary Search Masterclass",
        source: "Codeforces Blog",
        type: "Competitive Masterclass",
        url: "https://codeforces.com/blog/entry/67509",
        description: "Search on answer predicate design, machine epsilon precision, and partition invariants."
      }
    ],
    blind75Tasks: [
      { id: 76, title: "Median of Two Sorted Arrays", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", invariant: "Binary Search on Partition Cut: Binary search cut i in smaller array A such that max_left <= min_right simultaneously in O(log(min(M, N)))." }
    ],
    extremeProblem: {
      title: "Median of Two Sorted Arrays",
      platform: "LeetCode 4",
      difficulty: "Hard",
      url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      whyThisBenchmark: "O(log(min(M, N))) partition invariant: Partitioning the smaller array so max_left <= min_right simultaneously across both arrays."
    },
    invariant: "Partition Equivalence: We seek partition cut points i and j in arrays A and B such that left_half has (M + N + 1) / 2 elements AND max(A[i-1], B[j-1]) <= min(A[i], B[j]).",
    amortizedProof: "Binary searching cut point on the smaller array takes exactly O(log(min(M, N))) iterations.",
    traps: ["Index out-of-bounds when partition is at index 0 or N: use virtual -infinity and +infinity sentinels."],
    iqsRules: ["Always ensure binary search is invoked on the array of smaller length to guarantee log(min(M, N))."],
    socraticHints: {
      hint1: "Observation: Since both arrays are already sorted, can you partition both arrays such that all elements in the left partition are <= all elements in the right partition?",
      hint2: "State Invariant: If A[i-1] > B[j], cut point i in A is too far right; move high = i - 1.",
      hint3: "Skeleton: Search cutA in [0..M]. cutB = (M + N + 1) / 2 - cutA. Assert A_left <= B_right and B_left <= A_right."
    },
    starterCode: {
      cpp: `// Day 10 Median of Two Sorted Arrays\n#include <vector>\n#include <algorithm>\n#include <climits>\nclass Solution {\npublic:\n    double findMedianSortedArrays(const std::vector<int>& nums1, const std::vector<int>& nums2) {\n        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.size(), n = nums2.size();\n        int low = 0, high = m;\n        while (low <= high) {\n            int cut1 = (low + high) / 2;\n            int cut2 = (m + n + 1) / 2 - cut1;\n            int l1 = (cut1 == 0) ? INT_MIN : nums1[cut1 - 1];\n            int r1 = (cut1 == m) ? INT_MAX : nums1[cut1];\n            int l2 = (cut2 == 0) ? INT_MIN : nums2[cut2 - 1];\n            int r2 = (cut2 == n) ? INT_MAX : nums2[cut2];\n            if (l1 <= r2 && l2 <= r1) {\n                if ((m + n) % 2 == 0) return (std::max(l1, l2) + std::min(r1, r2)) / 2.0;\n                else return std::max(l1, l2);\n            } else if (l1 > r2) high = cut1 - 1;\n            else low = cut1 + 1;\n        }\n        return 0.0;\n    }\n};`,
      java: `public class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.length, n = nums2.length;\n        int low = 0, high = m;\n        while (low <= high) {\n            int cut1 = (low + high) / 2;\n            int cut2 = (m + n + 1) / 2 - cut1;\n            int l1 = cut1 == 0 ? Integer.MIN_VALUE : nums1[cut1 - 1];\n            int r1 = cut1 == m ? Integer.MAX_VALUE : nums1[cut1];\n            int l2 = cut2 == 0 ? Integer.MIN_VALUE : nums2[cut2 - 1];\n            int r2 = cut2 == n ? Integer.MAX_VALUE : nums2[cut2];\n            if (l1 <= r2 && l2 <= r1) {\n                if ((m + n) % 2 == 0) return (Math.max(l1, l2) + Math.min(r1, r2)) / 2.0;\n                return Math.max(l1, l2);\n            } else if (l1 > r2) high = cut1 - 1;\n            else low = cut1 + 1;\n        }\n        return 0.0;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        if len(nums1) > len(nums2): return self.findMedianSortedArrays(nums2, nums1)\n        m, n = len(nums1), len(nums2)\n        low, high = 0, m\n        while low <= high:\n            cut1 = (low + high) // 2\n            cut2 = (m + n + 1) // 2 - cut1\n            l1 = float('-inf') if cut1 == 0 else nums1[cut1 - 1]\n            r1 = float('inf') if cut1 == m else nums1[cut1]\n            l2 = float('-inf') if cut2 == 0 else nums2[cut2 - 1]\n            r2 = float('inf') if cut2 == n else nums2[cut2]\n            if l1 <= r2 and l2 <= r1:\n                if (m + n) % 2 == 0: return (max(l1, l2) + min(r1, r2)) / 2.0\n                return max(l1, l2)\n            elif l1 > r2: high = cut1 - 1\n            else: low = cut1 + 1\n        return 0.0`
    }
  },
  {
    day: 11,
    phase: "Phase 2: Stacks, Search & Lists",
    category: "Linked List",
    title: "Linked List I: Pointer Manipulation & Cycles",
    subtitle: "NeetCode Step 11 — Sentinel Nodes, In-Place Reversal, and Floyd's Cycle Detection",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Floyd's Cycle-Finding Algorithm",
        source: "CP-Algorithms",
        type: "Mathematical Theory",
        url: "https://cp-algorithms.com",
        description: "Proof why relative distance between slow and fast pointers decreases by 1 each step modulo C."
      }
    ],
    blind75Tasks: [
      { id: 18, title: "Reverse Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/", invariant: "Three-pointer traversal (prev, curr, next) ensuring prev always heads reversed prefix." },
      { id: 20, title: "Merge Two Sorted Lists", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/", invariant: "Sentinel dummy node eliminating null edge cases." },
      { id: 19, title: "Linked List Cycle", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/", invariant: "Floyd's Tortoise and Hare: slow advances 1, fast advances 2." }
    ],
    extremeProblem: {
      title: "Josephus Problem I",
      platform: "CSES Additional Problems",
      difficulty: "CSES Task 2162",
      url: "https://cses.fi/problemset/task/2162/",
      whyThisBenchmark: "Circular elimination modeling in O(N)."
    },
    invariant: "Floyd's Tortoise & Hare: If a cycle of length C exists, once both pointers enter the cycle, fast is behind slow by some distance d < C. Each step increases fast's distance by 2 and slow's by 1, reducing the gap (d - 1) % C until they collide in <= C steps.",
    amortizedProof: "Reversal and merge visit each node exactly once: exact O(N) time and O(1) space.",
    traps: ["Losing pointer reference to `curr.next` before mutating `curr.next = prev`."],
    iqsRules: ["Always use a dummy head node (`ListNode dummy(0);`) for splicing."],
    socraticHints: {
      hint1: "Observation: Before changing curr.next, what must you save to not lose the rest of the list?",
      hint2: "State Invariant: Maintain prev, curr, and next.",
      hint3: "Skeleton: prev = null, curr = head. While curr: next = curr.next; curr.next = prev; prev = curr; curr = next. Return prev."
    },
    starterCode: {
      cpp: `// Day 11 Reverse Linked List\nstruct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* previous_node = nullptr;\n        ListNode* current_node = head;\n        while (current_node != nullptr) {\n            ListNode* next_node = current_node->next;\n            current_node->next = previous_node;\n            previous_node = current_node;\n            current_node = next_node;\n        }\n        return previous_node;\n    }\n};`,
      java: `public class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}`,
      python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev = None\n        curr = head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev`
    }
  },
  {
    day: 12,
    phase: "Phase 2: Stacks, Search & Lists",
    category: "Linked List",
    title: "Linked List II: Midpoint Splits & K-Way Heaps",
    subtitle: "NeetCode Step 12 — Split-Reverse-Zip and O(N log k) Priority Queue Merges",
    authoritativeResources: [
      {
        title: "USACO Guide Gold: Priority Queues & Heaps",
        source: "USACO Guide",
        type: "Data Structure Guide",
        url: "https://usaco.guide/gold",
        description: "Min-heap priority queue invariant maintaining the minimum element across K sorted streams."
      }
    ],
    blind75Tasks: [
      { id: 23, title: "Reorder List", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/", invariant: "Find midpoint, reverse second half, interleave two halves in O(N)." },
      { id: 22, title: "Remove Nth Node From End of List", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", invariant: "Fast pointer advances n steps ahead to maintain constant gap." },
      { id: 21, title: "Merge k Sorted Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/", invariant: "Min-heap priority queue of size k containing heads of all lists in O(N log k)." }
    ],
    extremeProblem: {
      title: "Merge k Sorted Lists (Divide & Conquer)",
      platform: "LeetCode 23",
      difficulty: "Hard",
      url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      whyThisBenchmark: "Pairwise merge in O(N log k) with O(1) extra space."
    },
    invariant: "Heap Front Invariant: A min-heap of size k stores the current smallest unprocessed node from each of the k lists. Extracting the minimum and inserting its next node preserves the invariant in O(log k) per element.",
    amortizedProof: "Total elements across all k lists = N. Each element enters and leaves the min-heap once: exact O(N log k) runtime and O(k) space.",
    traps: ["Handling null head nodes inside the `lists` input array."],
    iqsRules: ["Implement custom comparator struct for priority queue in C++ cleanly."],
    socraticHints: {
      hint1: "Observation: Instead of merging all lists at once, what data structure lets you always get the smallest head among k candidates?",
      hint2: "State Invariant: Priority queue of size <= k.",
      hint3: "Skeleton: Push all non-null heads to min-heap. Pop min, append to dummy list. If popped.next: push popped.next."
    },
    starterCode: {
      cpp: `// Day 12 Merge k Sorted Lists\n#include <vector>\n#include <queue>\nstruct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };\nclass Solution {\npublic:\n    ListNode* mergeKLists(std::vector<ListNode*>& lists) {\n        auto comp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n        std::priority_queue<ListNode*, std::vector<ListNode*>, decltype(comp)> min_heap(comp);\n        for (auto list_head : lists) if (list_head) min_heap.push(list_head);\n        ListNode dummy(0); ListNode* tail = &dummy;\n        while (!min_heap.empty()) {\n            ListNode* smallest = min_heap.top(); min_heap.pop();\n            tail->next = smallest;\n            tail = tail->next;\n            if (smallest->next) min_heap.push(smallest->next);\n        }\n        return dummy.next;\n    }\n};`,
      java: `import java.util.PriorityQueue;\npublic class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);\n        for (ListNode h : lists) if (h != null) heap.offer(h);\n        ListNode dummy = new ListNode(0), tail = dummy;\n        while (!heap.isEmpty()) {\n            ListNode node = heap.poll();\n            tail.next = node; tail = tail.next;\n            if (node.next != null) heap.offer(node.next);\n        }\n        return dummy.next;\n    }\n}`,
      python: `import heapq\nclass Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        heap = []\n        for i, h in enumerate(lists):\n            if h: heapq.heappush(heap, (h.val, i, h))\n        dummy = ListNode(0)\n        tail = dummy\n        while heap:\n            val, i, node = heapq.heappop(heap)\n            tail.next = node\n            tail = tail.next\n            if node.next:\n                heapq.heappush(heap, (node.next.val, i, node.next))\n        return dummy.next`
    }
  },

  // --------------------------------------------------------------------------
  // PHASE 3: TREES, TRIES & HEAPS (Days 13 - 18)
  // --------------------------------------------------------------------------
  {
    day: 13,
    phase: "Phase 3: Trees, Tries & Heaps",
    category: "Trees",
    title: "Trees I: Tree Recursive Invariants & Symmetry",
    subtitle: "NeetCode Step 13 — Subtree Depths, Inversion, and Structural Equivalence",
    authoritativeResources: [
      {
        title: "USACO Guide Bronze/Silver: Tree Traversals",
        source: "USACO Guide",
        type: "Comprehensive Theory",
        url: "https://usaco.guide/silver/tree-traversals",
        description: "Recursive invariants, DFS subtree aggregations, and tree depth."
      }
    ],
    blind75Tasks: [
      { id: 24, title: "Invert Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/", invariant: "Swap left and right subtrees, then recurse on children." },
      { id: 25, title: "Maximum Depth of Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", invariant: "height(node) = 1 + max(height(left), height(right))." },
      { id: 26, title: "Same Tree", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/", invariant: "Structural and value equivalence on left and right subtrees." },
      { id: 27, title: "Subtree of Another Tree", difficulty: "Easy", url: "https://leetcode.com/problems/subtree-of-another-tree/", invariant: "Subtree check via recursive same-tree comparison or Merkle hashing." }
    ],
    extremeProblem: {
      title: "Tree Diameter",
      platform: "CSES Tree Algorithms",
      difficulty: "CSES Task 1131",
      url: "https://cses.fi/problemset/task/1131/",
      whyThisBenchmark: "Evaluating maximum distance between any two nodes in an unrooted tree in O(N)."
    },
    invariant: "Subtree Independence: In a rooted tree, any node's left subtree and right subtree are completely disjoint. Computation on the node combines independent results of left and right in O(1).",
    amortizedProof: "Each node is visited once in post-order DFS: exact O(N) time and O(H) recursion stack space.",
    traps: ["Deep trees with depth 10^5 causing recursion stack overflow."],
    iqsRules: ["Always check null root guard clause first."],
    socraticHints: {
      hint1: "Observation: If you have already inverted the left and right subtrees, what remains to invert current node?",
      hint2: "State Invariant: Just swap node.left and node.right!",
      hint3: "Skeleton: If not root return null. Swap(root.left, root.right). Recurse root.left, recurse root.right. Return root."
    },
    starterCode: {
      cpp: `// Day 13 Invert Binary Tree\nstruct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        std::swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};`,
      java: `public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left; root.left = root.right; root.right = temp;\n        invertTree(root.left); invertTree(root.right);\n        return root;\n    }\n}`,
      python: `class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root: return None\n        root.left, root.right = root.right, root.left\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        return root`
    }
  },
  {
    day: 14,
    phase: "Phase 3: Trees, Tries & Heaps",
    category: "Trees",
    title: "Trees II: BST Properties & Level-Order BFS",
    subtitle: "NeetCode Step 14 — Bounded Ranges, Inorder Monotonicity, and Queue Snapshots",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Binary Search Tree Invariants",
        source: "CP-Algorithms",
        type: "Data Structure Monograph",
        url: "https://cp-algorithms.com",
        description: "Inorder traversal strictly sorted property, BST bounds, and LCA split point."
      }
    ],
    blind75Tasks: [
      { id: 28, title: "Lowest Common Ancestor of a BST", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", invariant: "Left if both smaller, right if both larger; otherwise split point (LCA)." },
      { id: 29, title: "Binary Tree Level Order Traversal", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", invariant: "Loop over queue.size() elements to process exactly one level per round." },
      { id: 30, title: "Validate Binary Search Tree", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/", invariant: "Propagate interval (low_bound, high_bound) ensuring node value is strictly bounded." },
      { id: 31, title: "Kth Smallest Element in a BST", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", invariant: "Inorder traversal visits nodes in strictly ascending sorted order; stop at k-th." }
    ],
    extremeProblem: {
      title: "Company Queries II (LCA)",
      platform: "CSES Tree Algorithms",
      difficulty: "CSES Task 1688",
      url: "https://cses.fi/problemset/task/1688/",
      whyThisBenchmark: "LCA on arbitrary 2*10^5 trees via binary lifting in O(log N) per query."
    },
    invariant: "BST Inorder Monotonicity: An inorder traversal (Left -> Node -> Right) of a Binary Search Tree produces a sequence that is strictly monotonically increasing.",
    amortizedProof: "Inorder traversal visits each node at most once. For k-th smallest, traversal halts at node k: O(H + k) time and O(H) stack.",
    traps: ["BST validation: checking only parent-child relations instead of bounded ancestors."],
    iqsRules: ["Use 64-bit integer bounds (`long long min_val, long long max_val`) to prevent overflow when nodes equal INT_MIN or INT_MAX."],
    socraticHints: {
      hint1: "Observation: In Validate BST, does it suffice to check root.left.val < root.val?",
      hint2: "State Invariant: No! ALL nodes in the left subtree must be < root.val. Propagate (min_allowed, max_allowed).",
      hint3: "Skeleton: Validate(node, low, high): if not node return true. If node.val <= low or node.val >= high return false. Recurse left with (low, node.val), right with (node.val, high)."
    },
    starterCode: {
      cpp: `// Day 14 Validate BST\n#include <climits>\nstruct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\nprivate:\n    bool validate(TreeNode* node, long long low, long long high) {\n        if (!node) return true;\n        if (node->val <= low || node->val >= high) return false;\n        return validate(node->left, low, node->val) && validate(node->right, node->val, high);\n    }\npublic:\n    bool isValidBST(TreeNode* root) {\n        return validate(root, LLONG_MIN, LLONG_MAX);\n    }\n};`,
      java: `public class Solution {\n    private boolean validate(TreeNode node, Long low, Long high) {\n        if (node == null) return true;\n        if ((low != null && node.val <= low) || (high != null && node.val >= high)) return false;\n        return validate(node.left, low, (long)node.val) && validate(node.right, (long)node.val, high);\n    }\n    public boolean isValidBST(TreeNode root) { return validate(root, null, null); }\n}`,
      python: `class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        def validate(node, low, high):\n            if not node: return True\n            if node.val <= low or node.val >= high: return False\n            return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n        return validate(root, float('-inf'), float('inf'))`
    }
  },
  {
    day: 15,
    phase: "Phase 3: Trees, Tries & Heaps",
    category: "Trees",
    title: "Trees III: Arched Paths, Pre/Inorder, & Serialization",
    subtitle: "NeetCode Step 15 — Global Extrema vs Branch Gains, Bijective Codecs",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Tree Serialization & Preorder Invariants",
        source: "CP-Algorithms",
        type: "Comprehensive Theory",
        url: "https://cp-algorithms.com",
        description: "Bijective serialization with explicit null markers."
      }
    ],
    blind75Tasks: [
      { id: 32, title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", invariant: "First preorder element is root; inorder hash map splits left and right subtrees." },
      { id: 33, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", invariant: "Return single-branch gain node.val + max(0, left_gain, right_gain); update global arch." },
      { id: 34, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", invariant: "Preorder with '#' sentinel tokens guarantees unique bijection back to tree topology." }
    ],
    extremeProblem: {
      title: "Distance Queries",
      platform: "CSES Tree Algorithms",
      difficulty: "CSES Task 1135",
      url: "https://cses.fi/problemset/task/1135/",
      whyThisBenchmark: "dist(u, v) = depth[u] + depth[v] - 2*depth[LCA(u, v)] across 2*10^5 online queries."
    },
    invariant: "Branch Gain vs Arch Sum: A recursive function can only return a SINGLE path heading upward to parent (node.val + max(0, max_child)). However, the global path can ARCH through the node combining both left and right gains (node.val + left + right).",
    amortizedProof: "Each node visited once: O(N) time and O(H) recursion stack.",
    traps: ["All-negative node values: clamp branch gains with `max(0, gain)` to avoid negative contributions."],
    iqsRules: ["Maintain global max arch sum as an instance variable or pass by reference."],
    socraticHints: {
      hint1: "Observation: Can a path that goes down both left and right children continue upward to the node's parent?",
      hint2: "State Invariant: No! It forms an inverted 'V' arch. The return value to parent can only pick ONE branch.",
      hint3: "Skeleton: gain(node): if not node return 0. Left = max(0, gain(node.left)), right = max(0, gain(node.right)). Max_arch = max(max_arch, node.val + left + right). Return node.val + max(left, right)."
    },
    starterCode: {
      cpp: `// Day 15 Binary Tree Maximum Path Sum\n#include <algorithm>\n#include <climits>\nstruct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\nprivate:\n    int global_max_sum = INT_MIN;\n    int calculateGain(TreeNode* node) {\n        if (!node) return 0;\n        int left_gain = std::max(0, calculateGain(node->left));\n        int right_gain = std::max(0, calculateGain(node->right));\n        global_max_sum = std::max(global_max_sum, node->val + left_gain + right_gain);\n        return node->val + std::max(left_gain, right_gain);\n    }\npublic:\n    int maxPathSum(TreeNode* root) {\n        calculateGain(root);\n        return global_max_sum;\n    }\n};`,
      java: `public class Solution {\n    private int maxArch = Integer.MIN_VALUE;\n    private int gain(TreeNode node) {\n        if (node == null) return 0;\n        int left = Math.max(0, gain(node.left)), right = Math.max(0, gain(node.right));\n        maxArch = Math.max(maxArch, node.val + left + right);\n        return node.val + Math.max(left, right);\n    }\n    public int maxPathSum(TreeNode root) { gain(root); return maxArch; }\n}`,
      python: `class Solution:\n    def maxPathSum(self, root: Optional[TreeNode]) -> int:\n        max_arch = float('-inf')\n        def gain(node):\n            nonlocal max_arch\n            if not node: return 0\n            left = max(0, gain(node.left))\n            right = max(0, gain(node.right))\n            max_arch = max(max_arch, node.val + left + right)\n            return node.val + max(left, right)\n        gain(root)\n        return max_arch`
    }
  },
  {
    day: 16,
    phase: "Phase 3: Trees, Tries & Heaps",
    category: "Trees",
    title: "Tree DP & Rerooting: Subtree Contributions in O(N)",
    subtitle: "ICPC Tree Masterclass — Tree Rerooting, All-Pairs Distances, and Binary Lifting",
    authoritativeResources: [
      {
        title: "USACO Guide Gold: Tree DP (All-Roots Rerooting)",
        source: "USACO Guide",
        type: "Olympiad Masterclass",
        url: "https://usaco.guide/gold/all-roots",
        description: "2-pass DFS technique: post-order subtree aggregation followed by pre-order parent contribution push."
      }
    ],
    blind75Tasks: [
      { id: 77, title: "Sum of Distances in Tree", difficulty: "Hard", url: "https://leetcode.com/problems/sum-of-distances-in-tree/", invariant: "Tree DP Rerooting: First postorder DFS computes subtree counts and base answer for root. Second preorder DFS updates child root: ans[v] = ans[u] - count[v] + (N - count[v])." }
    ],
    extremeProblem: {
      title: "Sum of Distances in Tree",
      platform: "LeetCode 834",
      difficulty: "Hard",
      url: "https://leetcode.com/problems/sum-of-distances-in-tree/",
      whyThisBenchmark: "Rerooting DP: distance_sum[v] = distance_sum[u] - count[v] + (N - count[v]) across all nodes in O(N)."
    },
    invariant: "Rerooting Invariant: When shifting the root from node u to neighbor v, all nodes in v's subtree move 1 step closer (-count[v]), while all other (N - count[v]) nodes move 1 step further (+ (N - count[v])).",
    amortizedProof: "Pass 1 calculates subtree sizes and base distances in O(N). Pass 2 reroutes answers downward in O(N). Total runtime: exact O(N).",
    traps: ["Forgetting to multiply tree count by depth."],
    iqsRules: ["Separate `calculate_subtree_metrics` and `propagate_reroot` functions."],
    socraticHints: {
      hint1: "Observation: How does the distance sum change when you move from parent to child?",
      hint2: "State Invariant: ans[child] = ans[parent] - count[child] + (N - count[child]).",
      hint3: "Skeleton: DFS1: compute count[u] and ans[0]. DFS2: pass rerooted answer down to neighbors."
    },
    starterCode: {
      cpp: `// Day 16 Sum of Distances in Tree\n#include <vector>\nclass Solution {\npublic:\n    std::vector<int> sumOfDistancesInTree(int n, const std::vector<std::vector<int>>& edges) {\n        return {};\n    }\n};`,
      java: `public class Solution {\n    public int[] sumOfDistancesInTree(int n, int[][] edges) { return new int[0]; }\n}`,
      python: `class Solution:\n    def sumOfDistancesInTree(self, n: int, edges: List[List[int]]) -> List[int]: return []`
    }
  },
  {
    day: 17,
    phase: "Phase 3: Trees, Tries & Heaps",
    category: "Trie",
    title: "Tries: Prefix Edge Sharing & Bitwise XOR Trees",
    subtitle: "NeetCode Step 16 — Character Trees, Wildcard DFS, and 0-1 Bit Matching",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Prefix Tree (Trie)",
        source: "CP-Algorithms",
        type: "Comprehensive String Monograph",
        url: "https://cp-algorithms.com/string/prefix-tree-trie.html",
        description: "26-way prefix trie algorithms, character sharing, and wildcard search."
      },
      {
        title: "Codeforces: 0-1 Trie for Maximum XOR",
        source: "Codeforces Blog",
        type: "Technique Tutorial",
        url: "https://codeforces.com/blog/entry/60003",
        description: "Greedy opposite-bit matching from bit 31 down to 0 in O(31)."
      }
    ],
    blind75Tasks: [
      { id: 35, title: "Implement Trie (Prefix Tree)", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", invariant: "Nodes represent characters with child pointers [0..25] and boolean is_terminal." },
      { id: 36, title: "Design Add and Search Words Data Structure", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", invariant: "When '.' wildcard encountered, branch DFS into all 26 non-null children." },
      { id: 37, title: "Word Search II", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/", invariant: "Grid DFS with Trie node pruning: Step simultaneously through Trie and grid." }
    ],
    extremeProblem: {
      title: "Maximum XOR of Two Numbers in an Array",
      platform: "LeetCode 421",
      difficulty: "Medium / Hard",
      url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
      whyThisBenchmark: "Bitwise 2-way trie greedy bit matching in O(32 * N)."
    },
    invariant: "Prefix Sharing Invariant: Words sharing a common prefix of length L share the exact same path of L edges from root. Search terminates in O(L) regardless of total words stored.",
    amortizedProof: "Inserting a word of length L takes exactly L steps. Querying takes L steps. Exact O(L) time.",
    traps: ["Word Search II duplicate words: clear `node.word = null` after emitting a match to prevent duplicate output."],
    iqsRules: ["Wrap Trie nodes cleanly with array child pointers."],
    socraticHints: {
      hint1: "Observation: In Word Search II, why is searching the board with a Trie faster than searching for each word independently?",
      hint2: "State Invariant: If a prefix does not exist in the Trie, you can prune the entire board search branch immediately!",
      hint3: "Skeleton: Build Trie from words. DFS on grid: step node = node.children[c]. If node has word, add to ans, clear word. Recurse 4 neighbors."
    },
    starterCode: {
      cpp: `// Day 17 Implement Trie\nclass Trie {\nprivate:\n    struct Node {\n        Node* children[26] = {nullptr};\n        bool is_terminal = false;\n    };\n    Node* root;\npublic:\n    Trie() : root(new Node()) {}\n    void insert(const std::string& word) {\n        Node* curr = root;\n        for (char c : word) {\n            int idx = c - 'a';\n            if (!curr->children[idx]) curr->children[idx] = new Node();\n            curr = curr->children[idx];\n        }\n        curr->is_terminal = true;\n    }\n};`,
      java: `public class Trie {\n    static class Node { Node[] children = new Node[26]; boolean isEnd; }\n    Node root = new Node();\n    public void insert(String word) {\n        Node curr = root;\n        for (char c : word.toCharArray()) {\n            if (curr.children[c - 'a'] == null) curr.children[c - 'a'] = new Node();\n            curr = curr.children[c - 'a'];\n        }\n        curr.isEnd = true;\n    }\n}`,
      python: `class Trie:\n    def __init__(self):\n        self.root = {}\n    def insert(self, word: str) -> None:\n        curr = self.root\n        for c in word:\n            if c not in curr: curr[c] = {}\n            curr = curr[c]\n        curr['#'] = True`
    }
  },
  {
    day: 18,
    phase: "Phase 3: Trees, Tries & Heaps",
    category: "Heap",
    title: "Heap: Two-Heap Equilibrium & Dynamic Medians",
    subtitle: "NeetCode Step 17 — Max-Heap & Min-Heap Balance, O(log N) Stream Median",
    authoritativeResources: [
      {
        title: "USACO Guide Gold: Priority Queues",
        source: "USACO Guide",
        type: "Technique Monograph",
        url: "https://usaco.guide/gold",
        description: "Dual heap balancing invariants for running stream quantiles."
      }
    ],
    blind75Tasks: [
      { id: 39, title: "Find Median from Data Stream", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/", invariant: "Two heaps equilibrium: max_heap stores smaller half, min_heap stores larger half. Sizes differ by <= 1." }
    ],
    extremeProblem: {
      title: "Room Allocation",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1164",
      url: "https://cses.fi/problemset/task/1164/",
      whyThisBenchmark: "Min-heap sweep-line tracking departure times to assign minimum hotel rooms."
    },
    invariant: "Two-Heap Equilibrium: Max-heap (lower_half) and Min-heap (upper_half) maintain: (1) every element in lower <= every element in upper, and (2) 0 <= size(lower) - size(upper) <= 1. The median is always lower.top() or the average of both tops in O(1).",
    amortizedProof: "Inserting element into heap takes O(log N). Rebalancing takes O(log N). Finding median takes O(1). Total time per insertion O(log N).",
    traps: ["Allowing heap sizes to drift: must rebalance sizes after every single push."],
    iqsRules: ["Name heaps `smaller_half_max_heap` and `larger_half_min_heap`."],
    socraticHints: {
      hint1: "Observation: If you split all numbers in half at the median, what can you say about the maximum of the lower half and minimum of the upper half?",
      hint2: "State Invariant: Lower half max-heap and upper half min-heap. Top of lower and top of upper frame the median.",
      hint3: "Skeleton: Push to lower. Move lower.top to upper. If upper.size > lower.size: move upper.top to lower. If lower.size > upper.size return lower.top else avg(tops)."
    },
    starterCode: {
      cpp: `// Day 18 Find Median from Data Stream\n#include <queue>\nclass MedianFinder {\nprivate:\n    std::priority_queue<int> lower_half_max_heap;\n    std::priority_queue<int, std::vector<int>, std::greater<int>> upper_half_min_heap;\npublic:\n    MedianFinder() {}\n    void addNum(int num) {\n        lower_half_max_heap.push(num);\n        upper_half_min_heap.push(lower_half_max_heap.top());\n        lower_half_max_heap.pop();\n        if (upper_half_min_heap.size() > lower_half_max_heap.size()) {\n            lower_half_max_heap.push(upper_half_min_heap.top());\n            upper_half_min_heap.pop();\n        }\n    }\n    double findMedian() {\n        if (lower_half_max_heap.size() > upper_half_min_heap.size()) return lower_half_max_heap.top();\n        return (lower_half_max_heap.top() + upper_half_min_heap.top()) / 2.0;\n    }\n};`,
      java: `import java.util.Collections;\nimport java.util.PriorityQueue;\npublic class MedianFinder {\n    PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder());\n    PriorityQueue<Integer> upper = new PriorityQueue<>();\n    public void addNum(int num) {\n        lower.offer(num); upper.offer(lower.poll());\n        if (upper.size() > lower.size()) lower.offer(upper.poll());\n    }\n    public double findMedian() {\n        if (lower.size() > upper.size()) return lower.peek();\n        return (lower.peek() + upper.peek()) / 2.0;\n    }\n}`,
      python: `import heapq\nclass MedianFinder:\n    def __init__(self):\n        self.lower = [] # max-heap (negated)\n        self.upper = [] # min-heap\n    def addNum(self, num: int) -> None:\n        heapq.heappush(self.lower, -num)\n        heapq.heappush(self.upper, -heapq.heappop(self.lower))\n        if len(self.upper) > len(self.lower):\n            heapq.heappush(self.lower, -heapq.heappop(self.upper))\n    def findMedian(self) -> float:\n        if len(self.lower) > len(self.upper): return -self.lower[0]\n        return (-self.lower[0] + self.upper[0]) / 2.0`
    }
  },

  // --------------------------------------------------------------------------
  // PHASE 4: BACKTRACKING & GRAPHS (Days 19 - 22)
  // --------------------------------------------------------------------------
  {
    day: 19,
    phase: "Phase 4: Backtracking & Graphs",
    category: "Backtracking",
    title: "Backtracking: State Decision Trees & In-Place Pruning",
    subtitle: "NeetCode Step 18 — Candidate Reusability, Path Restoration, and Grid Visited Bits",
    authoritativeResources: [
      {
        title: "USACO Guide Silver: Complete Search with Backtracking",
        source: "USACO Guide",
        type: "Comprehensive Theory",
        url: "https://usaco.guide/silver",
        description: "Search trees, branch-and-bound pruning, and state restoration invariants."
      }
    ],
    blind75Tasks: [
      { id: 40, title: "Combination Sum", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/", invariant: "Index forwarding with reusability: branch can reuse candidate at index i or advance to i+1." },
      { id: 41, title: "Word Search", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/", invariant: "In-place grid mutating: board[r][c] = '#' during traversal, restore on backtracking." }
    ],
    extremeProblem: {
      title: "Grid Paths",
      platform: "CSES Introductory Problems",
      difficulty: "CSES Task 1625",
      url: "https://cses.fi/problemset/task/1625/",
      whyThisBenchmark: "Dead-end pruning optimization traversing 7x7 grid in 88 steps."
    },
    invariant: "State Restoration Invariant: Any mutation performed on the environment before recursing down a decision branch must be reverted upon returning. This preserves environmental invariants for sibling branches without allocating copies.",
    amortizedProof: "In Word Search, from each cell we branch in at most 3 directions. Running time bounded by O(M * N * 3^L) where L is word length.",
    traps: ["Passing mutable arrays/vectors by value instead of by reference causing O(N) allocation per recursive step."],
    iqsRules: ["Mutate board cell in-place to avoid auxiliary visited matrix."],
    socraticHints: {
      hint1: "Observation: Do you need a visited boolean matrix if you can temporarily change the character on the board?",
      hint2: "State Invariant: Set board[r][c] = '#' before moving to neighbor; reset board[r][c] = original_char right before returning.",
      hint3: "Skeleton: DFS(r, c, idx): if idx == word.len return true. If out of bounds or board[r][c] != word[idx] return false. Temp = board[r][c]; board[r][c] = '#'. Recurse 4 neighbors. Board[r][c] = temp."
    },
    starterCode: {
      cpp: `// Day 19 Word Search\n#include <vector>\n#include <string>\nclass Solution {\nprivate:\n    bool dfs(std::vector<std::vector<char>>& board, const std::string& word, int r, int c, int idx) {\n        if (idx == static_cast<int>(word.length())) return true;\n        if (r < 0 || r >= static_cast<int>(board.size()) || c < 0 || c >= static_cast<int>(board[0].size()) || board[r][c] != word[idx]) return false;\n        char temp = board[r][c];\n        board[r][c] = '#';\n        bool found = dfs(board, word, r + 1, c, idx + 1) || dfs(board, word, r - 1, c, idx + 1) ||\n                     dfs(board, word, r, c + 1, idx + 1) || dfs(board, word, r, c - 1, idx + 1);\n        board[r][c] = temp;\n        return found;\n    }\npublic:\n    bool exist(std::vector<std::vector<char>>& board, const std::string& word) {\n        for (int r = 0; r < static_cast<int>(board.size()); ++r)\n            for (int c = 0; c < static_cast<int>(board[0].size()); ++c)\n                if (dfs(board, word, r, c, 0)) return true;\n        return false;\n    }\n};`,
      java: `public class Solution {\n    private boolean dfs(char[][] board, String word, int r, int c, int idx) {\n        if (idx == word.length()) return true;\n        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(idx)) return false;\n        char temp = board[r][c]; board[r][c] = '#';\n        boolean found = dfs(board, word, r+1, c, idx+1) || dfs(board, word, r-1, c, idx+1) ||\n                        dfs(board, word, r, c+1, idx+1) || dfs(board, word, r, c-1, idx+1);\n        board[r][c] = temp;\n        return found;\n    }\n    public boolean exist(char[][] board, String word) {\n        for (int r = 0; r < board.length; r++)\n            for (int c = 0; c < board[0].length; c++)\n                if (dfs(board, word, r, c, 0)) return true;\n        return false;\n    }\n}`,
      python: `class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        R, C = len(board), len(board[0])\n        def dfs(r, c, idx):\n            if idx == len(word): return True\n            if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != word[idx]: return False\n            temp = board[r][c]\n            board[r][c] = '#'\n            found = dfs(r+1, c, idx+1) or dfs(r-1, c, idx+1) or dfs(r, c+1, idx+1) or dfs(r, c-1, idx+1)\n            board[r][c] = temp\n            return found\n        for r in range(R):\n            for c in range(C):\n                if dfs(r, c, 0): return True\n        return False`
    }
  },
  {
    day: 20,
    phase: "Phase 4: Backtracking & Graphs",
    category: "Graphs",
    title: "Graphs I: Matrix BFS/DFS & Connected Components",
    subtitle: "NeetCode Step 19 — Land Sinking, Reverse Ocean Inflows, and Visited Sets",
    authoritativeResources: [
      {
        title: "USACO Guide Silver: Flood Fill",
        source: "USACO Guide",
        type: "Comprehensive Theory",
        url: "https://usaco.guide/silver/flood-fill",
        description: "Grid graph transformations, connected components, and multi-source BFS."
      }
    ],
    blind75Tasks: [
      { id: 45, title: "Number of Islands", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/", invariant: "Encountering '1' increments island count and triggers BFS/DFS to sink reachable land to '0'." },
      { id: 42, title: "Clone Graph", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/", invariant: "Original node -> cloned node hash map avoids duplicate instances and cycle loops." },
      { id: 44, title: "Pacific Atlantic Water Flow", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", invariant: "Reverse flow: multi-source BFS inward from ocean borders moving only uphill." }
    ],
    extremeProblem: {
      title: "Counting Rooms",
      platform: "CSES Graph Algorithms",
      difficulty: "CSES Task 1192",
      url: "https://cses.fi/problemset/task/1192/",
      whyThisBenchmark: "Standard connected components flood fill on 1000x1000 grid."
    },
    invariant: "Reverse Flow Invariant: Testing if water can reach oceans from cell (r, c) forward is redundant. Instead, run BFS inward from oceans moving only to adjacent cells of equal or greater height. Cells reachable from both oceans form the intersection.",
    amortizedProof: "Each grid cell is visited at most once per ocean sweep: exact O(M * N) time and O(M * N) space.",
    traps: ["Diagonal movement: problem states cells connect horizontally or vertically only."],
    iqsRules: ["Define directional array vectors `const int dr[] = {0, 0, 1, -1};`."],
    socraticHints: {
      hint1: "Observation: Instead of running BFS from every single inland cell, where should you start BFS from?",
      hint2: "State Invariant: Start from the ocean boundaries! Water can flow down means you can walk uphill.",
      hint3: "Skeleton: BFS(pacific_queue, pacific_reachable). BFS(atlantic_queue, atlantic_reachable). Result is intersection."
    },
    starterCode: {
      cpp: `// Day 20 Number of Islands\n#include <vector>\nclass Solution {\nprivate:\n    void sinkIsland(std::vector<std::vector<char>>& grid, int r, int c) {\n        if (r < 0 || r >= static_cast<int>(grid.size()) || c < 0 || c >= static_cast<int>(grid[0].size()) || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        sinkIsland(grid, r + 1, c);\n        sinkIsland(grid, r - 1, c);\n        sinkIsland(grid, r, c + 1);\n        sinkIsland(grid, r, c - 1);\n    }\npublic:\n    int numIslands(std::vector<std::vector<char>>& grid) {\n        int island_count = 0;\n        for (int r = 0; r < static_cast<int>(grid.size()); ++r) {\n            for (int c = 0; c < static_cast<int>(grid[0].size()); ++c) {\n                if (grid[r][c] == '1') {\n                    island_count++;\n                    sinkIsland(grid, r, c);\n                }\n            }\n        }\n        return island_count;\n    }\n};`,
      java: `public class Solution {\n    private void sink(char[][] grid, int r, int c) {\n        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        sink(grid, r+1, c); sink(grid, r-1, c); sink(grid, r, c+1); sink(grid, r, c-1);\n    }\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++)\n            for (int c = 0; c < grid[0].length; c++)\n                if (grid[r][c] == '1') { count++; sink(grid, r, c); }\n        return count;\n    }\n}`,
      python: `class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        R, C = len(grid), len(grid[0])\n        def sink(r, c):\n            if r < 0 or r >= R or c < 0 or c >= C or grid[r][c] != '1': return\n            grid[r][c] = '0'\n            sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1)\n        count = 0\n        for r in range(R):\n            for c in range(C):\n                if grid[r][c] == '1': count += 1; sink(r, c)\n        return count`
    }
  },
  {
    day: 21,
    phase: "Phase 4: Backtracking & Graphs",
    category: "Graphs",
    title: "Graphs II: Kahn's Topo Sort & DSU Graph Axioms",
    subtitle: "NeetCode Step 20 — DAG In-Degrees, Cycle Detection, and Tree Equivalence",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Topological Sorting",
        source: "CP-Algorithms",
        type: "Graph Theory Invariant",
        url: "https://cp-algorithms.com/graph/topological-sort.html",
        description: "Kahn's in-degree reduction queue and DFS 3-color cycle detection."
      }
    ],
    blind75Tasks: [
      { id: 43, title: "Course Schedule", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/", invariant: "Kahn's in-degree 0 queue: DAG cycle exists iff processed count < total courses." },
      { id: 48, title: "Graph Valid Tree", difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/", invariant: "Tree Axiom: Graph has exactly (V - 1) edges AND has no cycles (DSU)." },
      { id: 49, title: "Number of Connected Components", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", invariant: "DSU union decrements component count by 1." }
    ],
    extremeProblem: {
      title: "Course Schedule",
      platform: "CSES Graph Algorithms",
      difficulty: "CSES Task 1679",
      url: "https://cses.fi/problemset/task/1679/",
      whyThisBenchmark: "Standard Kahn's topological sort on 10^5 nodes, 2*10^5 edges."
    },
    invariant: "DAG Topological Invariant: A directed graph possesses a topological ordering if and only if it contains no directed cycles. Kahn's algorithm maintains a queue of nodes with in-degree 0, peeling layers of prerequisites.",
    amortizedProof: "Each node enters and leaves the queue once. Each edge is decremented once: exact O(V + E) time.",
    traps: ["Returning true when processed nodes < V (cycle present)."],
    iqsRules: ["Clearly model in-degree array and zero-in-degree queue."],
    socraticHints: {
      hint1: "Observation: Which courses can you take first with zero prerequisites?",
      hint2: "State Invariant: Courses with in_degree == 0. When completed, reduce in_degree of their dependent courses.",
      hint3: "Skeleton: Build adj and in_degree. Enqueue all in_degree == 0. While queue: pop u, count++; for v in adj[u]: if --in_degree[v] == 0: enqueue v. Return count == numCourses."
    },
    starterCode: {
      cpp: `// Day 21 Course Schedule\n#include <vector>\n#include <queue>\nclass Solution {\npublic:\n    bool canFinish(int numCourses, const std::vector<std::vector<int>>& prerequisites) {\n        std::vector<std::vector<int>> adjacency(numCourses);\n        std::vector<int> in_degree(numCourses, 0);\n        for (const auto& edge : prerequisites) {\n            adjacency[edge[1]].push_back(edge[0]);\n            in_degree[edge[0]]++;\n        }\n        std::queue<int> zero_in_degree;\n        for (int i = 0; i < numCourses; ++i) if (in_degree[i] == 0) zero_in_degree.push(i);\n        int completed = 0;\n        while (!zero_in_degree.empty()) {\n            int course = zero_in_degree.front(); zero_in_degree.pop();\n            completed++;\n            for (int next : adjacency[course]) {\n                if (--in_degree[next] == 0) zero_in_degree.push(next);\n            }\n        }\n        return completed == numCourses;\n    }\n};`,
      java: `public class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        java.util.List<java.util.List<Integer>> adj = new java.util.ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new java.util.ArrayList<>());\n        int[] inDegree = new int[numCourses];\n        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); inDegree[p[0]]++; }\n        java.util.Queue<Integer> q = new java.util.ArrayDeque<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);\n        int count = 0;\n        while (!q.isEmpty()) {\n            int curr = q.poll(); count++;\n            for (int next : adj.get(curr)) if (--inDegree[next] == 0) q.offer(next);\n        }\n        return count == numCourses;\n    }\n}`,
      python: `from collections import deque, defaultdict\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        adj = defaultdict(list)\n        in_degree = [0] * numCourses\n        for u, v in prerequisites: adj[v].append(u); in_degree[u] += 1\n        q = deque([i for i in range(numCourses) if in_degree[i] == 0])\n        completed = 0\n        while q:\n            curr = q.popleft(); completed += 1\n            for next_c in adj[curr]:\n                in_degree[next_c] -= 1\n                if in_degree[next_c] == 0: q.append(next_c)\n        return completed == numCourses`
    }
  },
  {
    day: 22,
    phase: "Phase 4: Backtracking & Graphs",
    category: "Advanced Graphs",
    title: "Advanced Graphs: Alien Dictionary & Tarjan's SCC",
    subtitle: "NeetCode Step 21 — Lexicographical Dependencies, Bridges, and Cut Vertices",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Finding Bridges (Tarjan)",
        source: "CP-Algorithms",
        type: "Authoritative Theory",
        url: "https://cp-algorithms.com/graph/bridge-searching.html",
        description: "Low-link discovery values: condition low[v] > disc[u] for critical network bridges."
      }
    ],
    blind75Tasks: [
      { id: 47, title: "Alien Dictionary", difficulty: "Hard", url: "https://leetcode.com/problems/alien-dictionary/", invariant: "Adjacent words comparison: first differing character defines directed edge. Handle invalid prefix trap." }
    ],
    extremeProblem: {
      title: "Critical Connections in a Network",
      platform: "LeetCode 1192",
      difficulty: "Hard",
      url: "https://leetcode.com/problems/critical-connections-in-a-network/",
      whyThisBenchmark: "Bridge finding via Tarjan's low-link values (low[v] > disc[u])."
    },
    invariant: "Bridge Invariant: An undirected edge (u, v) is a bridge if and only if no node in v's subtree has a back-edge to an ancestor of u (i.e. low[v] > disc[u]).",
    amortizedProof: "Single pass DFS: visits each vertex and edge once. Exact O(V + E) time.",
    traps: ["Alien Dictionary invalid prefix: if word2 is proper prefix of word1 (e.g. ['abc', 'ab']), early return empty string."],
    iqsRules: ["Clearly differentiate `disc[u]` (discovery time) and `low[u]` (lowest reachable ancestor)."],
    socraticHints: {
      hint1: "Observation: Compare adjacent words. The first index where characters differ gives a strict directed edge.",
      hint2: "State Invariant: Trap! If word2 is a proper prefix of word1, language is invalid.",
      hint3: "Skeleton: Build graph and in_degrees for all unique characters. Run Kahn's Topo Sort."
    },
    starterCode: {
      cpp: `// Day 22 Alien Dictionary\n#include <string>\n#include <vector>\nclass Solution {\npublic:\n    std::string alienOrder(const std::vector<std::string>& words) { return ""; }\n};`,
      java: `public class Solution {\n    public String alienOrder(String[] words) { return ""; }\n}`,
      python: `class Solution:\n    def alienOrder(self, words: List[str]) -> str: return ""`
    }
  },

  // --------------------------------------------------------------------------
  // PHASE 5: DYNAMIC PROGRAMMING, INTERVALS & BITS (Days 23 - 28)
  // --------------------------------------------------------------------------
  {
    day: 23,
    phase: "Phase 5: DP, Intervals & Bits",
    category: "1-D Dynamic Programming",
    title: "1-D Dynamic Programming I: Non-Adjacent Extrema",
    subtitle: "NeetCode Step 22 — Fibonacci Transitions, Circular Splits, and O(1) Rolling States",
    authoritativeResources: [
      {
        title: "AtCoder Educational DP Contest",
        source: "AtCoder",
        type: "Canonical Problem Suite",
        url: "https://atcoder.jp/contests/dp",
        description: "The 26 standard DP benchmarks: Frog 1 & 2 linear state transitions."
      }
    ],
    blind75Tasks: [
      { id: 50, title: "Climbing Stairs", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/", invariant: "dp[i] = dp[i-1] + dp[i-2] rolling two variables." },
      { id: 56, title: "House Robber", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/", invariant: "Non-adjacent decision: dp[i] = max(dp[i-1], dp[i-2] + nums[i]) in O(1) space." },
      { id: 57, title: "House Robber II", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/", invariant: "Circular boundary disjunction: Solve two independent subproblems [0..N-2] and [1..N-1]." }
    ],
    extremeProblem: {
      title: "Frog 1",
      platform: "AtCoder DP Contest",
      difficulty: "Task dp_a",
      url: "https://atcoder.jp/contests/dp/tasks/dp_a",
      whyThisBenchmark: "The fundamental 1D linear recurrence with cost minimization."
    },
    invariant: "Circular Boundary Disjunction: In a circular array, elements 0 and N - 1 cannot be chosen simultaneously. The problem decomposes into two independent linear subproblems: solving over [0, N-2] and over [1, N-1], taking the maximum of both.",
    amortizedProof: "Two linear scans of length N: exact O(N) time and O(1) space.",
    traps: ["Single element array in House Robber II: return nums[0] immediately."],
    iqsRules: ["Reduce auxiliary space to two variables (`prev_rob`, `prev_skip`)."],
    socraticHints: {
      hint1: "Observation: Since house 0 and house N-1 are adjacent, what happens if you rob house 0?",
      hint2: "State Invariant: You cannot rob house N-1! Thus, solve two independent linear ranges.",
      hint3: "Skeleton: Return max(nums[0], max(robLinear(nums[0..N-2]), robLinear(nums[1..N-1])))."
    },
    starterCode: {
      cpp: `// Day 23 House Robber II\n#include <vector>\n#include <algorithm>\nclass Solution {\nprivate:\n    int robLinear(const std::vector<int>& nums, int start, int end) {\n        int prev1 = 0, prev2 = 0;\n        for (int i = start; i <= end; ++i) {\n            int curr = std::max(prev1, prev2 + nums[i]);\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\npublic:\n    int rob(const std::vector<int>& nums) {\n        int n = nums.size();\n        if (n == 1) return nums[0];\n        return std::max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));\n    }\n};`,
      java: `public class Solution {\n    private int robRange(int[] nums, int s, int e) {\n        int p1 = 0, p2 = 0;\n        for (int i = s; i <= e; i++) {\n            int curr = Math.max(p1, p2 + nums[i]);\n            p2 = p1; p1 = curr;\n        }\n        return p1;\n    }\n    public int rob(int[] nums) {\n        if (nums.length == 1) return nums[0];\n        return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def rob(self, nums: List[int]) -> int:\n        if len(nums) == 1: return nums[0]\n        def rob_linear(arr):\n            p1 = p2 = 0\n            for x in arr:\n                p1, p2 = max(p1, p2 + x), p1\n            return p1\n        return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`
    }
  },
  {
    day: 24,
    phase: "Phase 5: DP, Intervals & Bits",
    category: "1-D Dynamic Programming",
    title: "1-D Dynamic Programming II: Knapsack, LIS & Products",
    subtitle: "NeetCode Step 23 — Unbounded Knapsack, Patience Sorting, and Dual Extrema",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Knapsack & Longest Increasing Subsequence",
        source: "CP-Algorithms",
        type: "Canonical Monograph",
        url: "https://cp-algorithms.com/dynamic_programming/knapsack.html",
        description: "Unbounded knapsack and patience sorting tails array for O(N log N) LIS."
      }
    ],
    blind75Tasks: [
      { id: 51, title: "Coin Change", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/", invariant: "Unbounded Knapsack: dp[amount] = 1 + min(dp[amount - coin])." },
      { id: 52, title: "Longest Increasing Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/", invariant: "Patience sorting / Tails array with binary search in O(N log N)." },
      { id: 54, title: "Word Break", difficulty: "Medium", url: "https://leetcode.com/problems/word-break/", invariant: "Prefix reachability: dp[i] true iff dp[j] true and s[j..i] in dictionary." },
      { id: 6, title: "Maximum Product Subarray", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/", invariant: "Track both max_prod and min_prod because negative multiplication flips them." }
    ],
    extremeProblem: {
      title: "Coin Combinations I",
      platform: "CSES Dynamic Programming",
      difficulty: "CSES Task 1635",
      url: "https://cses.fi/problemset/task/1635/",
      whyThisBenchmark: "Counting total distinct ordered ways to produce sum x modulo 10^9+7."
    },
    invariant: "Patience Sorting Invariant: tails[i] stores the smallest tail of all increasing subsequences of length i + 1 found so far. The tails array is strictly sorted, allowing binary search replacement in O(log N) per incoming element.",
    amortizedProof: "Loop runs N times. Each iteration performs binary search in O(log N). Total runtime O(N log N) vs naive O(N^2).",
    traps: ["Duplicate elements in LIS: use `std::lower_bound` for strictly increasing vs `std::upper_bound` for non-decreasing."],
    iqsRules: ["Name tails array `smallest_tail_per_length`."],
    socraticHints: {
      hint1: "Observation: For Longest Increasing Subsequence, do you need to store every subsequence?",
      hint2: "State Invariant: Only store the smallest possible ending element for each length!",
      hint3: "Skeleton: Tails array. For x in nums: idx = binary_search(tails, x). If idx == tails.len: tails.push(x) else tails[idx] = x. Return tails.len."
    },
    starterCode: {
      cpp: `// Day 24 Longest Increasing Subsequence\n#include <vector>\n#include <algorithm>\nclass Solution {\npublic:\n    int lengthOfLIS(const std::vector<int>& nums) {\n        std::vector<int> tails;\n        for (int x : nums) {\n            auto it = std::lower_bound(tails.begin(), tails.end(), x);\n            if (it == tails.end()) tails.push_back(x);\n            else *it = x;\n        }\n        return tails.size();\n    }\n};`,
      java: `import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\npublic class Solution {\n    public int lengthOfLIS(int[] nums) {\n        List<Integer> tails = new ArrayList<>();\n        for (int x : nums) {\n            int idx = Collections.binarySearch(tails, x);\n            if (idx < 0) idx = -(idx + 1);\n            if (idx == tails.size()) tails.add(x);\n            else tails.set(idx, x);\n        }\n        return tails.size();\n    }\n}`,
      python: `import bisect\nclass Solution:\n    def lengthOfLIS(self, nums: List[int]) -> int:\n        tails = []\n        for x in nums:\n            idx = bisect.bisect_left(tails, x)\n            if idx == len(tails): tails.append(x)\n            else: tails[idx] = x\n        return len(tails)`
    }
  },
  {
    day: 25,
    phase: "Phase 5: DP, Intervals & Bits",
    category: "1-D Dynamic Programming",
    title: "1-D Dynamic Programming III: Prefix Decodes & Reachability",
    subtitle: "NeetCode Step 24 — String Decodes, Combinatorial Targets, and Furthest Reachable",
    authoritativeResources: [
      {
        title: "AtCoder DP Contest: Frog 2 & Vacations",
        source: "AtCoder",
        type: "Canonical Problem Suite",
        url: "https://atcoder.jp/contests/dp/tasks/dp_b",
        description: "K-step jumps and state-dependent daily rewards."
      }
    ],
    blind75Tasks: [
      { id: 58, title: "Decode Ways", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/", invariant: "1-digit and 2-digit valid decode conditions." },
      { id: 55, title: "Combination Sum IV", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-iv/", invariant: "Ordered permutation DP: dp[i] = sum(dp[i - num]) for all num <= i." },
      { id: 60, title: "Jump Game", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/", invariant: "Furthest reachable index: max_reach = max(max_reach, i + nums[i])." }
    ],
    extremeProblem: {
      title: "Dice Combinations",
      platform: "CSES Dynamic Programming",
      difficulty: "CSES Task 1633",
      url: "https://cses.fi/problemset/task/1633/",
      whyThisBenchmark: "Standard linear recurrence sum for dice rolls modulo 10^9+7."
    },
    invariant: "Reachability Invariant: In Jump Game, index i is reachable iff i <= max_reach. If i > max_reach at any point, the remainder of the array is unreachable.",
    amortizedProof: "Single pass through array in O(N) time and O(1) space.",
    traps: ["Leading zero in Decode Ways: '0' cannot map to any letter; '06' is invalid."],
    iqsRules: ["Add explicit guard for strings starting with '0'."],
    socraticHints: {
      hint1: "Observation: Do you need dynamic programming for Jump Game, or does a single integer tracking furthest reach suffice?",
      hint2: "State Invariant: Maintain max_reachable_index. If current_index > max_reachable, return false.",
      hint3: "Skeleton: max_reach = 0. For i in 0..N-1: if i > max_reach return false. Max_reach = max(max_reach, i + nums[i]). Return true."
    },
    starterCode: {
      cpp: `// Day 25 Jump Game\n#include <vector>\n#include <algorithm>\nclass Solution {\npublic:\n    bool canJump(const std::vector<int>& nums) {\n        int max_reach = 0;\n        for (int i = 0; i < static_cast<int>(nums.size()); ++i) {\n            if (i > max_reach) return false;\n            max_reach = std::max(max_reach, i + nums[i]);\n        }\n        return true;\n    }\n};`,
      java: `public class Solution {\n    public boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n        }\n        return true;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        max_reach = 0\n        for i, jump in enumerate(nums):\n            if i > max_reach: return False\n            max_reach = max(max_reach, i + jump)\n        return True`
    }
  },
  {
    day: 26,
    phase: "Phase 5: DP, Intervals & Bits",
    category: "2-D Dynamic Programming",
    title: "2-D Dynamic Programming: Grid Paths & Subsequence Alignment",
    subtitle: "NeetCode Step 25 — Grid Inflow Combinatorics, LCS Tables, and Interval DP",
    authoritativeResources: [
      {
        title: "AtCoder DP Contest: LCS (Task dp_f)",
        source: "AtCoder",
        type: "Canonical Benchmark",
        url: "https://atcoder.jp/contests/dp/tasks/dp_f",
        description: "Reconstructing the optimal longest common subsequence string from DP table."
      }
    ],
    blind75Tasks: [
      { id: 59, title: "Unique Paths", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/", invariant: "Grid inflow: dp[r][c] = dp[r-1][c] + dp[r][c-1]." },
      { id: 53, title: "Longest Common Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/", invariant: "If match: 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1])." }
    ],
    extremeProblem: {
      title: "Burst Balloons",
      platform: "LeetCode 312",
      difficulty: "Hard",
      url: "https://leetcode.com/problems/burst-balloons/",
      whyThisBenchmark: "Interval DP: Invert problem to consider which balloon is popped LAST in interval [i, j]."
    },
    invariant: "Subsequence Character Match Invariant: If s1[i-1] == s2[j-1], the optimal alignment strictly includes this pair (dp[i][j] = 1 + dp[i-1][j-1]). Otherwise, it must equal the best alignment dropping either s1[i-1] or s2[j-1].",
    amortizedProof: "M * N states with O(1) transition: O(M * N) time and O(min(M, N)) space with rolling array.",
    traps: ["1-based table indexing mismatch: allocate `(M+1) x (N+1)` to avoid negative indices."],
    iqsRules: ["Optimize space from O(M * N) to O(N) using rolling 1D row."],
    socraticHints: {
      hint1: "Observation: If the current characters match, can you make a greedy match?",
      hint2: "State Invariant: Yes! dp[i][j] = 1 + dp[i-1][j-1]. If they don't match, max(dp[i-1][j], dp[i][j-1]).",
      hint3: "Skeleton: Table dp[m+1][n+1]. For i 1..m: for j 1..n: if s1[i-1] == s2[j-1] dp[i][j] = 1 + dp[i-1][j-1] else dp[i][j] = max(dp[i-1][j], dp[i][j-1])."
    },
    starterCode: {
      cpp: `// Day 26 Longest Common Subsequence\n#include <string>\n#include <vector>\n#include <algorithm>\nclass Solution {\npublic:\n    int longestCommonSubsequence(const std::string& text1, const std::string& text2) {\n        int m = text1.length(), n = text2.length();\n        std::vector<int> prev(n + 1, 0), curr(n + 1, 0);\n        for (int i = 1; i <= m; ++i) {\n            for (int j = 1; j <= n; ++j) {\n                if (text1[i - 1] == text2[j - 1]) curr[j] = 1 + prev[j - 1];\n                else curr[j] = std::max(prev[j], curr[j - 1]);\n            }\n            prev = curr;\n        }\n        return prev[n];\n    }\n};`,
      java: `public class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[] prev = new int[n + 1], curr = new int[n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) curr[j] = 1 + prev[j - 1];\n                else curr[j] = Math.max(prev[j], curr[j - 1]);\n            }\n            System.arraycopy(curr, 0, prev, 0, n + 1);\n        }\n        return prev[n];\n    }\n}`,
      python: `class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        m, n = len(text1), len(text2)\n        prev = [0] * (n + 1)\n        for i in range(1, m + 1):\n            curr = [0] * (n + 1)\n            for j in range(1, n + 1):\n                if text1[i-1] == text2[j-1]: curr[j] = 1 + prev[j-1]\n                else: curr[j] = max(prev[j], curr[j-1])\n            prev = curr\n        return prev[n]`
    }
  },
  {
    day: 27,
    phase: "Phase 5: DP, Intervals & Bits",
    category: "Intervals",
    title: "Intervals: Sweep Line & Endpoint Scheduling",
    subtitle: "NeetCode Step 26 — Overlap Merging, Earliest Finish Time, and Meeting Room Sweeps",
    authoritativeResources: [
      {
        title: "USACO Guide Silver: Greedy with Sorting",
        source: "USACO Guide",
        type: "Comprehensive Theory",
        url: "https://usaco.guide/silver",
        description: "Earliest finish time greedy theorem for maximum non-overlapping intervals."
      }
    ],
    blind75Tasks: [
      { id: 61, title: "Merge Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/", invariant: "Sort by start time. Two intervals overlap iff s2 <= e1; merged is [s1, max(e1, e2)]." },
      { id: 62, title: "Insert Interval", difficulty: "Medium", url: "https://leetcode.com/problems/insert-interval/", invariant: "Three-phase linear sweep: Left disjoint, merged overlapping, right disjoint." },
      { id: 63, title: "Non-overlapping Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/", invariant: "Greedy Earliest End Time: Keep interval finishing earliest to maximize remaining capacity." },
      { id: 64, title: "Meeting Rooms", difficulty: "Easy", url: "https://leetcode.com/problems/meeting-rooms/", invariant: "Sort by start time. Return false if start[i] < end[i-1]." },
      { id: 65, title: "Meeting Rooms II", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/", invariant: "Min-heap of end times: reuse room if earliest finish <= current start; else add room." }
    ],
    extremeProblem: {
      title: "Restaurant Customers",
      platform: "CSES Sorting & Searching",
      difficulty: "CSES Task 1619",
      url: "https://cses.fi/problemset/task/1619/",
      whyThisBenchmark: "Coordinate event sweep-line tracking maximum simultaneous restaurant customers."
    },
    invariant: "Earliest End-Time Theorem: To minimize removals (or maximize disjoint intervals), greedily choose the interval that finishes earliest. This leaves the maximal possible amount of time for all remaining intervals.",
    amortizedProof: "Sorting intervals takes O(N log N). Single pass linear scan takes O(N). Total runtime O(N log N).",
    traps: ["Endpoint touching: problem specifies whether [1, 2] and [2, 3] overlap."],
    iqsRules: ["Use clean lambda comparator for sorting."],
    socraticHints: {
      hint1: "Observation: If two intervals overlap, which one should you remove?",
      hint2: "State Invariant: Always remove the one with the LARGER end time, because it conflicts with more future intervals!",
      hint3: "Skeleton: Sort by end time. Last_end = -inf. For interval in sorted: if interval.start >= last_end: last_end = interval.end else removals++."
    },
    starterCode: {
      cpp: `// Day 27 Non-overlapping Intervals\n#include <vector>\n#include <algorithm>\nclass Solution {\npublic:\n    int eraseOverlapIntervals(std::vector<std::vector<int>>& intervals) {\n        if (intervals.empty()) return 0;\n        std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) { return a[1] < b[1]; });\n        int removals = 0, last_end = intervals[0][1];\n        for (size_t i = 1; i < intervals.size(); ++i) {\n            if (intervals[i][0] < last_end) removals++;\n            else last_end = intervals[i][1];\n        }\n        return removals;\n    }\n};`,
      java: `import java.util.Arrays;\npublic class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int removals = 0, lastEnd = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < lastEnd) removals++;\n            else lastEnd = intervals[i][1];\n        }\n        return removals;\n    }\n}`,
      python: `from typing import List\nclass Solution:\n    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:\n        if not intervals: return 0\n        intervals.sort(key=lambda x: x[1])\n        removals = 0\n        last_end = intervals[0][1]\n        for i in range(1, len(intervals)):\n            if intervals[i][0] < last_end: removals += 1\n            else: last_end = intervals[i][1]\n        return removals`
    }
  },
  {
    day: 28,
    phase: "Phase 5: DP, Intervals & Bits",
    category: "Bit Manipulation",
    title: "Bit Manipulation: Kernighan's Bit Hacks & XOR Properties",
    subtitle: "NeetCode Step 27 — Lowest Set Bits, Self-Cancellation, and Half-Adder Logic",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Bit Manipulation & Submasks",
        source: "CP-Algorithms",
        type: "Comprehensive Monograph",
        url: "https://cp-algorithms.com/algebra/all-submasks.html",
        description: "Brian Kernighan's algorithm `n & (n - 1)` and bitwise arithmetic laws."
      }
    ],
    blind75Tasks: [
      { id: 66, title: "Number of 1 Bits", difficulty: "Easy", url: "https://leetcode.com/problems/number-of-1-bits/", invariant: "n = n & (n - 1) strips lowest set bit in exactly popcount iterations." },
      { id: 67, title: "Counting Bits", difficulty: "Easy", url: "https://leetcode.com/problems/counting-bits/", invariant: "dp[i] = dp[i >> 1] + (i & 1) in linear time." },
      { id: 68, title: "Reverse Bits", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-bits/", invariant: "Extract LSB, shift result left for 32 rounds." },
      { id: 69, title: "Missing Number", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/", invariant: "XOR Self-Cancellation: a ^ a = 0; XOR all indices with values." },
      { id: 70, title: "Sum of Two Integers", difficulty: "Medium", url: "https://leetcode.com/problems/sum-of-two-integers/", invariant: "Half-adder: sum = a ^ b, carry = (a & b) << 1." }
    ],
    extremeProblem: {
      title: "Shortest Path Visiting All Nodes",
      platform: "LeetCode 847",
      difficulty: "Hard",
      url: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",
      whyThisBenchmark: "Multi-source BFS on state space (current_node, visited_bitmask) across N <= 12."
    },
    invariant: "Kernighan's Invariant: The operation `n = n & (n - 1)` flips the lowest set bit of n to 0 while leaving all other bits unaltered. Hence, the loop runs in exact O(popcount) <= 32 iterations.",
    amortizedProof: "Runs in O(1) time bounded by 32 bits.",
    traps: ["Sign bit overflow: in Python/JS, bitwise operators treat numbers as arbitrary precision; mask with `0xFFFFFFFF`."],
    iqsRules: ["Use `uint32_t` or explicit bit masks."],
    socraticHints: {
      hint1: "Observation: What does subtracting 1 from a binary number do to its lowest set bit?",
      hint2: "State Invariant: It flips that bit and all bits below it. Doing bitwise AND with original strips that bit!",
      hint3: "Skeleton: Count = 0. While n != 0: n = n & (n - 1); count++. Return count."
    },
    starterCode: {
      cpp: `// Day 28 Number of 1 Bits\n#include <cstdint>\nclass Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        int set_bit_count = 0;\n        while (n != 0) {\n            n = n & (n - 1);\n            set_bit_count++;\n        }\n        return set_bit_count;\n    }\n};`,
      java: `public class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n = n & (n - 1);\n            count++;\n        }\n        return count;\n    }\n}`,
      python: `class Solution:\n    def hammingWeight(self, n: int) -> int:\n        count = 0\n        while n:\n            n &= (n - 1)\n            count += 1\n        return count`
    }
  },

  // --------------------------------------------------------------------------
  // PHASE 6: OLYMPIAD DATA STRUCTURES & FINAL CRUCIBLE (Days 29 - 30)
  // --------------------------------------------------------------------------
  {
    day: 29,
    phase: "Phase 6: Olympiad Structures & Capstone",
    category: "Advanced Range Queries",
    title: "Olympiad Data Structures: Segment Trees & Fenwick Trees",
    subtitle: "ICPC Regional Medal Bar — Lazy Propagation, Range Inversions, and Point Updates",
    authoritativeResources: [
      {
        title: "CP-Algorithms: Segment Tree with Lazy Propagation",
        source: "CP-Algorithms",
        type: "Data Structure Monograph",
        url: "https://cp-algorithms.com/data_structures/segment_tree.html#lazy-propagation",
        description: "Lazy tag invariants, deferred updates, and O(log N) range modifications."
      },
      {
        title: "CP-Algorithms: Fenwick Tree (Binary Indexed Tree)",
        source: "CP-Algorithms",
        type: "Comprehensive Theory",
        url: "https://cp-algorithms.com/data_structures/fenwick.html",
        description: "Lowest set bit i & -i prefix updates in O(log N)."
      }
    ],
    blind75Tasks: [
      { id: 78, title: "Range Update Queries", difficulty: "Hard", url: "https://cses.fi/problemset/task/1651/", invariant: "Difference Array on Fenwick / Segment Tree: Add value u at a and subtract u at b+1 on a BIT, reducing range updates to two O(log N) point updates and point queries to prefix sums." }
    ],
    extremeProblem: {
      title: "Range Update Queries",
      platform: "CSES Range Queries",
      difficulty: "CSES Task 1651",
      url: "https://cses.fi/problemset/task/1651/",
      whyThisBenchmark: "Lazy segment tree range additions and point queries on 2*10^5 elements."
    },
    invariant: "Lazy Tag Invariant: When an update range completely covers node p's interval [L, R], apply update to tree[p] and store deferred value in lazy[p]. Before accessing children of p, push lazy[p] down to guarantee children reflect latest truth.",
    amortizedProof: "Any range query/update visits at most 4 * log2(N) tree nodes: strictly O(log N) time.",
    traps: ["Allocating only 2N size for segment tree instead of 4N (causes segfault)."],
    iqsRules: ["Encapsulate tree into dedicated class."],
    socraticHints: {
      hint1: "Observation: Deferring updates to children prevents touching O(N) leaves.",
      hint2: "State Invariant: tree[p] is always updated immediately; lazy[p] holds tags for children.",
      hint3: "Skeleton: push(p, L, R): propagate lazy to children; lazy[p] = 0."
    },
    starterCode: {
      cpp: `// Day 29 Lazy Segment Tree\n#include <vector>\nclass LazySegmentTree {\nprivate:\n    std::vector<long long> tree, lazy;\n    int n;\npublic:\n    LazySegmentTree(int n) : n(n), tree(4 * n, 0), lazy(4 * n, 0) {}\n};`,
      java: `public class LazySegmentTree {\n    private long[] tree, lazy;\n    private int n;\n    public LazySegmentTree(int n) { this.n = n; this.tree = new long[4 * n]; this.lazy = new long[4 * n]; }\n}`,
      python: `class LazySegmentTree:\n    def __init__(self, n: int): self.n = n; self.tree = [0] * (4 * n); self.lazy = [0] * (4 * n)`
    }
  },
  {
    day: 30,
    phase: "Phase 6: Olympiad Structures & Capstone",
    category: "Capstone Crucible",
    title: "Capstone Gauntlet: 75/75 Closeout & 5-Hour Contest Simulation",
    subtitle: "Complete Blind 75 Master Audit + ICPC Regional Medal Execution",
    authoritativeResources: [
      {
        title: "Errichto: Randomized Stress-Testing with Generator Scripts",
        source: "Codeforces Blog",
        type: "Grandmaster Best Practice",
        url: "https://codeforces.com/blog/entry/61587",
        description: "Writing 10-line brute force verifiers to stress test against 1,000 random inputs before submission."
      }
    ],
    blind75Tasks: [
      { id: 79, title: "Distinct Values Queries", difficulty: "Hard", url: "https://cses.fi/problemset/task/1734/", invariant: "Offline Fenwick Sweep Line: Sort queries by right boundary R. Maintain BIT storing 1 at the latest position of each distinct value seen so far, clearing its prior occurrence." }
    ],
    extremeProblem: {
      title: "Distinct Values Queries",
      platform: "CSES Range Queries",
      difficulty: "CSES Task 1734",
      url: "https://cses.fi/problemset/task/1734/",
      whyThisBenchmark: "Offline queries sorted by right boundary + Fenwick tree tracking last occurrence in O((N + Q) log N)."
    },
    invariant: "Final Capstone Invariant: By Day 30, all 75 questions of Blind 75 are closed. Master the synthesis of multi-pattern algorithms under high-pressure competitive conditions.",
    amortizedProof: "Full verification of time and space complexity across all canonical problem classes.",
    traps: ["Submitting without verifying corner cases against a local randomized generator script."],
    iqsRules: ["100% adherence to Interview Quality Standards (zero macros, clean variable names)."],
    socraticHints: {
      hint1: "Advice: Verify that all 75 Blind 75 questions are marked Mastered in the matrix.",
      hint2: "Advice: State invariants out loud in the first 3 minutes of every interview mock.",
      hint3: "Advice: You have achieved the Hybrid ICPC x FAANG benchmark bar."
    },
    starterCode: {
      cpp: `// Day 30 Final Grandmaster Studio\n// 75/75 Blind 75 Completed. ICPC x FAANG Bar Achieved.`,
      java: `// Day 30 Final Grandmaster Studio`,
      python: `# Day 30 Final Grandmaster Studio`
    }
  }
];

if (typeof module !== 'undefined') {
  module.exports = { CURRICULUM_DATABASE };
}
