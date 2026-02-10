---
title: "57. Insert interval"
description: "LeetCode problem solving: inserting and merging a new interval into sorted intervals"
pubDate: 2026-01-03
tags: ["code", "medium"]
---

## Note from YJ
Just started using vim to try practicing working on the terminal.
This means it takes much more time to try unpacking how to navigate different files and especially editing files on the terminal.
Things are hard and confusing, but I will do my best to understand it and get used to it!

## What does the problem want?
This time, instead of just merging, we are checking if the new interval, after adding to the intervals, can be merged or not.

## Brainstorm ideas
Simply put, this question seems to ask us to do the same thing as the question 56.
By this I mean we add the `newInterval` to `intervals`, then run the same algorithm to merge the different intervals and return intervals with no overlapping intervals.

## Solution
```python
def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    intervals.append(newInterval)
    intervals.sort(key=lambda x: x[0])
    res = []
    for start,end in intervals:
        if not res or res[-1][1] < start:
            res.append([start,end])
        else:
            res[-1][1] = max(res[-1][1], end)
    return res
```

### Time complexity
This solution has a time complexity of `O(n log n)` because the sorting method dominates in time comlpexity within this solution.

### Space complexity
As for space complexity, we have `O(n)`.
