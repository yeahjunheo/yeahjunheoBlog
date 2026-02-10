---
title: "49. Group anagrams"
description: "LeetCode problem solving: grouping anagrams together using hash map with sorted keys"
pubDate: 2026-01-02
tags: ["code", "medium"]
---

## What does the problem want?
As a step up from determining if two strings are an anagram, this time we want to separate a list of strings into groups of anagrams.

## Brainstorm ideas
One thing would be to use a dictionary where we store information of the letters and atore the strings that are anagrams of the collection of letters.
So if we have `eat`, we might have a dictionary entry that looks like `{("e","a","t"):["eat"]}`.
Then if we have `tea`, it's an anagram of `eat`, so we have an appended entry to look like `{("e","a","t"):["eat", "tea"]}`.

Another thing is to make sure that the key we use in our dictionary is universally usable for other strings.
If we were to just use `("e","a","t")`, we might see problems when comparing it with `("t","e","a")`.
So making sure that the tuple of letters are sorted before adding to our pool of anagram strings.

Then at the end, we can return a list of all the values in our dictionary.

## Solution
```python
def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
    pool = {}
    for string in strs:
        char_pool = tuple(sorted(string))
        if char_pool not in pool:
            pool[char_pool] = [string]
        else:
            pool[char_pool].append(string)
    return list(pool.values())
```

### Time complexity
The time complexity of this solution is around `O(n * k log k)` where `n` is the number of strings and `k` is the sorting of each character count.
The `O(k log k)` exists because the `sorted()` function in python has a time complexity of `O(n log n)`.

### Space complexity
The space complexity for this is `O(n * k)`, mainly for storing the hash maps of our strings.
