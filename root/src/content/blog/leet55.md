---
title: "55. Jump game"
description: "LeetCode problem solving: determining if we can reach the end using greedy approach"
pubDate: 2025-12-20
tags: ["code", "medium"]
---

## What does the problem want?
The question asks can we reach the top of a staircase with our set jumping max distance per step.
So from my current step, can i keep jumping until I reach the top.

## Brainstorm ideas
Thinking about it, we can just check the max jump distance from my current step, jump the max distance, and repeat.
But this poses the question, what if the step I land on doesnt have enough "power" to reach the top.
For example, let's say we have the array `[3,4,3,0,1]`.
If we were to strictly go for the maximum jump, we'd end up not being able to reach the top.

Then let's go backwards. Let's start from the top and see if we can reach the bottom while comparing everything.
This way we can ensure that we can reach the top step with just one loop while with little to no additional space.

## Solution
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        goal = len(nums) - 1
        for i in range(len(nums)-1, -1, -1):
            if i + nums[i] >= goal:
                goal = i
        if goal == 0:
            return True
        return False
```

### Time complexity
Since we only have one for-loop, the time complexity of this will be `O(n)`.

### Space complexity
We only have one additional variable for storage, so the space complexity will be `O(1)`.
