---
title: "11. Container with most water"
description: "LeetCode problem solving: finding maximum water container area using two pointers"
pubDate: 2025-12-22
tags: ["code", "medium"]
---

## What does the problem want?
We are given an array of different heights, and with a pair of heights, we want to return the maximum amount of water a container can store.

## Brainstorm ideas
Then what can we do?
First off, this question is a two-pointer question.
So the common method would be to start from either ends and find which pointer to move one step inwards.

The first idea that comes to mind would be to have a `max_area` variable that stores the area value and a `left` and `right` variable to store the pointer positions.
We check the current area, compare it to the stored value and store which ever is greater.
Also, we can move the pointer that points to the smaller height, because a greater height will always benefit us more than the lower one.
With that, we can just store these three variables and iterate towards the middle from both left and right.

## Solution
```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height)-1
        max_area = 0
        while left < right:
            temp_area = (right - left) * min(height[left], height[right])
            max_area = max(max_area, temp_area)
            if height[right] > height[left]:
                left += 1
            else:
                right -= 1
        return max_area
```

### Time complexity
The time complextiy of this would be `O(n)` since we check until the left and right pointers meet.

### Space complexity
As for space complexity, since we introduce only three variables, it is a constant addition. Therefore, the space complexity is `O(1)`.

---

## Resources
