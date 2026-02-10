---
title: "1. Two sum"
description: "LeetCode problem solving: finding a pair of integers that sum to target using hash map"
pubDate: 2026-01-02
tags: ["code", "easy"]
draft: False
---

## What does the problem want?
As simple as the title, this question asks to find a pair of integers that sum up to our target.

## Brainstorm ideas
Note that this question asks determine a pair exists.
That means, our `goal` integer exists in `nums` where the `goal = target - current_number`.
With this idea, a simple solution can calulate its `goal` value and check if it exists within `nums`.

But let's check the algorithm's efficiency.
With the current idea, we would have to check the whole list at worst.
Also, the most tiring part would be the look-up operations within the list, which will take `O(n)` while looking through the list.

Then what can we do?
We can use a dictionary in python, which has a lookup of `O(1)`.
Also, we can have our dictionary store the index of our integers, which makes both the look up AND the output return significantly easier to manage.

With this tool, what we can do is iterate through `nums` once, and store to a `pool` of integers with their indices.
We calculate the `goal`, check if it exists in the `pool`.
If it does, we return the index pair.
If not, we just store our integer and index to the `pool`.

With this we have a clear and simplified solution that achieves our goal.

## Solution
```python
def twoSum(self, nums: List[int], target: int) -> List[int]:
    pool = {}
    for i in range(len(nums)):
        goal = target - nums[i]
        if goal in pool:
            return [pool[goal],i]
        pool[nums[i]]=i
```

### Time complexity
First, we have `O(n)` with our for-loop in our solution.
Since a lookup in a dictionary is only `O(1)`, our final time complexity is only `O(n)`!

### Space complexity
As for space complexity, we have a dictionary that can, at worst, store all the integers in `nums`.
Thus, the space complexity is also `O(n)`.
