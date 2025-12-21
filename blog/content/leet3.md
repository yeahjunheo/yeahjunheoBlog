---
title: 3. Longest substring without repeating characters
date: 20251220
tag: [code,medium]
link: https://leetcode.com/problems/longest-substring-without-repeating-characters/
---

## What does the problem want?
This time, we are given a string and told to find the length of the longest substring without duplicate characters.

For example, the string `abcabcbcbb` would give 3, with the substring being `abc` and `bbbbbbb` would give 1, with `s`.

## Brainstorm ideas
A simple check we could implement is to check all possible substrings.
So from index 0, we can check the max length we can get with a substring.
If we hit a limit, we store that length to a max length variable, then rinse-and-repeat.

However, this could result in a time complexity of `O(n)` if we have to count from the start for each starting index we count the substrings.
After checking for index 0, we might start for index 1 but that will mean checking everything we've seen.

A workaround for this might be to store the max length substring as well.
If a max length substring fails, then that means the first letter and the last letter or something in between is clashing.
I could then start from where the clash first happens and count from that section.

For example, if we had the string `abcabcbb`:

```bash
abcabcbb
^ = a
abcabcbb
^^ = ab
abcabcbb
^^^ = abc
abcabcbb
^^^^ = abca --> duplicate found!
Anything from the initial conflict would no longer be valid for the longest substring.
abcabcbb
 ^^^^ = bcab --> duplicate found!
abcabcbb
  ^^^^ = cabc --> duplicate found!
abcabcbb
   ^^^^ = abcb --> duplicate found!
abcabcbb
     ^^^ = cbb --> duplicate found!
```

So the initial longest substring with no duplicates would be `abc` and we return a 3.

## Solution
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        substr = {}
        left = 0
        res = 0
        for right in range(len(s)):
            if s[right] in substr and substr[s[right]] >= left:
                left = substr[s[right]] + 1
            substr[s[right]] = right
            res = max(res, right - left + 1)
        return res
```

### Time complexity

The time complexity for this is `O(n)`, since we only have one for-loop.


### Space complexity
As for space complexity, we have `O(min(n,m))` where `n` is the length of `s` and `m` is the length of `substr`.