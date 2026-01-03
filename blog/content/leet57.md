---
title: 57. Insert interval
date: 20260103
tags: [code,medium]
link: https://leetcode.com/problems/insert-interval/description/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

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

