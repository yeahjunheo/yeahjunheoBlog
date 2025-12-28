---
title: 290. Word pattern
date: 20251228
tags: [code,easy]
link: https://leetcode.com/problems/word-pattern/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
This question is the same as the [205. Isomorphic strings](https://yeahjunheo.com/leet205) with the exception of comparing the pattern instead of characters.

## Brainstorm ideas
Just like how we solved the Isomorphic strings question, we will make use of dictionaries to hold one-to-one maps of the characters in `pattern` to the words in `s`.

One small change to this would be to separate the words within `s` with the white space. With this, we can compare this and `pattern` like how we did with isomorphic strings.

Another check we can add is a check for the length. If the count of characters vs. the count of words are not equal, then we won't have a proper comparison. So we have that added into the solution.

## Solution
```python
def wordPattern(self, pattern: str, s: str) -> bool:
    s_pool = s.split()
    if len(pattern) != len(s_pool):
        return False
    p2s = {}
    s2p = {}
    for pc, sc in zip(pattern, s_pool):
        if pc in p2s:
            if p2s[pc] != sc:
                return False
        elif sc in s2p:
            return False
        else:
            p2s[pc] = sc
            s2p[sc] = pc
    return True
```

### Time complexity
In our case, the time complexity will be `O(m+n)` where `m` is the length of `s` and `n` is the length of `pattern`.

### Space complexity
The space complexity willbe `O(n + k)` where `k` is the number of words in `s`.