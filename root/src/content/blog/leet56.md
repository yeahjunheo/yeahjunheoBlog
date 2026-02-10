---
title: "56. Merge intervals"
description: "LeetCode problem solving: merging overlapping intervals after sorting"
pubDate: 2026-01-03
tags: ["code", "medium"]
---

## What does the problem want?
If given an array of intervals `[start_i, end_i]`, then the end goal is to return an array where all mergable intervals are merged.
So if we have `[[4,5],[1,4]]`, the output should be `[1,5]`.

## Brainstorm ideas
The first idea that popped up for me to brute force a solution was to go through each interval and save each possible value for each test case to a set.
By doing this, I can explicitly know what values are gonna be seen, then we can iterate over each value and make the intervals to return.
However, this got blocked by `[[1,4],[5,6]]`, which resulted in `[1,6]` and not the original.

Because of this, it was necessary to look for another solution.
And this is where sorting `intervals` prior to doing anything became a thing (*I had been stuck on this question for a while, so I used my editorial chance!*).
By sorting the items in `intervals` based on the start integer of an interval, we can systematically test the next entry in `intervals` and update the output list accordingly.

## Solution
```python
def merge(self, intervals: List[List[int]]) -> List[List[int]]:
    intervals.sort(key=lambda x: x[0])

    res = []
    for interval in intervals:
        if not res or res[-1][1] < interval[0]:
            res.append(interval)
        else:
            res[-1][1] = max(res[-1][1], interval[1])
    return res
```

### Time complexity
The time complexity of this solution is `O(nlogn)` because the sorting in the first line in `merge` dominates any other operation in the solution.

### Space complexity
As for space complexity, we can have worst-case `O(n)` because of our output array.
