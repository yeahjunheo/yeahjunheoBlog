---
title: "205. Isomorphic strings"
description: "LeetCode problem solving: checking if two strings are isomorphic using hash maps"
pubDate: 2025-12-27
tags: ["code", "easy"]
---

## What does the problem want?
This question asks if two strings are isomporphic.
By the question's definition, something is isomorphic if the characters is one string can be replaced to get the other.

So two strings `baba` and `dcdc` are isomorphic, and `abbababaa` and `baabababb` are isomorphic.

## Brainstorm ideas
With that said, there are couple things we need to take into account when iterative through each character.
First, we need to know which characters in string `s` map to in string `t`. If we know that, we can check each directions `s` to `t` and `t` to `s` to determine whether the one-to-one mapping of the string is consistent.
Second, we can use dictionaries to store these mappings so we can acces and store values in `O(1)` time. This will come in handy when we have more characters to compare, and not having search each character everytime will be great with time management.

## Solution
```python
def isIsomorphic(self, s: str, t: str) -> bool:
    s2t = {}
    t2s = {}
    for sc, tc in zip(s,t):
        if sc in s2t:
            if s2t[sc] != tc:
                return False
        elif tc in t2s:
            return False
        else:
            s2t[sc] = tc
            t2s[tc] = sc
    return True
```

### Time complexity
For this solution, we have a time complexity of `O(n)` since we only iterate between each value once.

### Space complexity
The space complexity is `O(k)` where `k` is the number of unique characters in `s` or `t`.
