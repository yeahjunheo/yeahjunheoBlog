---
title: 383. Ransom note
date: 20251227
tags: [code,easy]
link: https://leetcode.com/problems/ransom-note/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
This questions wants us to see if we have a set of letters from a `magazine`, can we build a `ransomNote` with what we have.

## Brainstorm ideas
We can just use the `Counter()` from python to get how many of each letter we have in `magazine`. From this we can then compare it with `ransomNote` to see if we can write what we want with what we have.

## Solution
```python
def canConstruct(self, ransomNote: str, magazine: str) -> bool:
    pool = Counter(magazine)
    for e in ransomNote:
        if pool[e] <= 0:
            return False
        pool[e] -= 1
    return True
```

### Time complexity
This solution has a time complexity of just `O(m + n)` where `m` is the length of `magazine` and `n` is the length of `ransomNote`.

### Space complexity
And a space complexity of `O(k)` where `k` is the number of unique elements in `magazine`.