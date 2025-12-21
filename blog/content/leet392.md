---
title: 392. Is subsequence
date: 20251221
tag: [code,easy]
link: https://leetcode.com/problems/is-subsequence/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
This question is simple. It just wants us to check if string `s` is a subsequences of `t`.
That means, can the elements in `s` be found in order within `t`, regardless of any adjancency.

## Brainstorm ideas
The simplest way to solve this would be to go through each letter in `t` against `s` to compare which if get a subsequence.

## Solution
```python
class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        s_point = 0
        for char in t:
            if s_point < len(s) and char == s[s_point]:
                s_point += 1
        return s_point == len(s)
```

### Time complexity
The time complexity of this will be `O(n+m)` where `n` is the length of `s` and `m` is the length of `t`.
Most cases where we don't check the whole `t`, then it will be smaller.

### Space complexity
My solution doesn't have any externally managed string, just a pointer.
Therefore, the space complexity is `O(1)`.