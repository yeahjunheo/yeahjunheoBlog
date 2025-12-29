---
title: 242. Valid anagram
date: 20251229
tags: [code,easy]
link: https://leetcode.com/problems/valid-anagram/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
This questions asks whether two strings `s` and `t` are anagrams or not.

## Brainstorm ideas
A quick win we can get is check the lenght of `s` and `t`.
If they differ, then obviously we can't have a valid anagram.

Next, we can use the `ord()` function in python to get the unicode number of each string character. This way, we can compare via the number.

Then what can we do to solve this question?

A simple solution would be to use the `Counter()` function and compare the two for equivalence.

But if we consider the use of `ord()`, we can use an array to store the unicode number. When cycling through `s` we add by one; and for `t`, subtract by one.

Also, since we know that we're only dealing with lowercase letters, this approach is viable since we're only dealing with 26 letters. If we were to think about all unicode characters, then we might have a problem with space optimization.

## Solution
```python
def isAnagram(self, s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = [0]*26
    for char in s:
        counts[ord(char) - ord('a')] += 1
    for char in t:
        counts[ord(char) - ord('a')] -= 1
    return all(count == 0 for count in counts)
```

### Time complexity
This solution has a time complexity of `O(n)` since we have no nested loops.

### Space complexity
As for space complexity, we are dealing with `O(26)` since we have a constant number of alphabets we'll deal with.