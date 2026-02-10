---
title: "169. Majority element"
description: "LeetCode problem solving: finding element appearing more than n/2 times using Counter"
pubDate: 2025-12-18
tags: ["code", "easy"]
---

## What does the problem want?
The main goal of this question is to see if we can find the element that appears more than `n/2`-floored times. This might mean that as long as we can find the element that appears that amount, we can call ends and return a value immediately.

## Brainstorm ideas
Then what can we do? We can do a check on the appearance of each unique element. This can be done by using python's `Counter()` function. After we do get that count, we can just look for the element that has the minimum appearances and return that value. If we don't want to use the `Counter()`, then we can just use a regular `dict()` and store each unique element in `nums` and increment the count by one each repeated appearance.

## Solution
```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        nums_count = Counter(nums)
        maj_count = len(nums) // 2
        for num in nums_count:
            if nums_count[num] > maj_count:
                return num
        return -1
```

### Time complexity
`Counter()` has a time complexity of O(n) and our for-loop to check for appearances is another O(n) for worst-case. Therefore, the total time complexity for this solution will be **O(n)**.

### Space complexity
As for space complexity, `Counter()` will create a Counter element of O(k) where k is the number of unique elements. Then we have a `maj_count` that holds our minimum comparison value. Therefore, we have a space complexity of O(k), which at worse-case will be **O(n/2) = O(n)**.

---

## Resources
