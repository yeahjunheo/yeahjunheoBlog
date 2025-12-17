---
title: 26. Remove duplicates from sorted array
date: 20251216
link: https://leetcode.com/problems/remove-duplicates-from-sorted-array/?envType=study-plan-v2&envId=top-interview-150
tag: easy
---

# Brainstorm

Thinking about this and that...

# My solution

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        count = 1
        last_num = nums[0]
        l_num = len(nums)
        for i in range(1, l_num):
            if nums[i] != last_num:
                nums[count] = nums[i]
                last_num = nums[i]
                count += 1
        return count
```