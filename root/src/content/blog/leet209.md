---
title: "209. Minimum size subarray sum"
description: "LeetCode problem solving: finding minimum subarray with sum >= target using sliding window"
pubDate: 2025-12-27
tags: ["code", "medium"]
---

## What does the problem want?
This question asks us to find the minimum length of consecutive integers in an array that gives us the target length. Otherwise, return 0.

## Brainstorm ideas
We can take the sliding window approach and have a left and right pointer that adjusts to the sum of the elements in between. This way we don't need an external array for storing and just adjust according to the current sum.

For example, let's have the array `[2,3,1,2,5,3]`, the we start at point `0` for both left and right pointers. We can also have an external variable `curr_sum` so we won't have to add all the elements between `light` to `right` and just add and delete when necessary.

If our `curr_sum` is larger than `target`, then we move the `left` one up. If `curr_sum` is smaller than `target`, then we move the `rigth` one up. And if `curr_sum` is equal to the `target`, then we can compare the number of elements vs the current minimum number.

After all that, we can check if our `curr_min` has changed to return either `0` or not.

## Solution
```python
def minSubArrayLen(self, target: int, nums: List[int]) -> int:
    left = 0
    curr_min = inf
    curr_sum = 0
    for right in range(len(nums)):
        curr_sum += nums[ight]
        while curr_sum >= target:
            curr_min = min(curr_min, right - left + 1)
            curr_sum -= nums[left]
            left += 1
    return curr_min if curr_min != inf else 0
```

### Time complexity
The time complexity of this would be `O(n)`.

### Space complexity
As for space, we only have a constant `O(1)`.
