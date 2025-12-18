---
title: 80. Remove duplicates from sorted array II
date: 20251217
tags: [medium]
link: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?

The problem wants us to make sure an array of non-decreasing integers has at most two of the same element. This means that for an array `[1,1,1,2,2,3]`, we would want to retrun `[1,1,2,2,3,_]` and return the number of elements in the array that should be checked, so 5 in this example.

## Brainstorm ideas

In the first version of this question, we had to remove duplicates from an array `[1,1,1,2,2,3]` to `[1,2,3,_,_,_]` and return 3. In this case, we had a `count` that worked like a left pointer, then we iterated from the first till last element, comparing each one for unique elements in the array.

This time, we need to implement a element counter as well, some thing that will act like an additional counter to the previous version. That might mean instead of checking if it's unique, we might add another counter that will move the `count` until at most a pair of an element has been spotted.

## Solution
The problem wants 

```python
def removeDuplicates(self, nums: List[int]) -> int:
    k = 0
    count = 0
    l_num = None
    for i in range(len(nums)):
        if l_num == None or nums[i] != l_num:
            l_num = nums[i]
            nums[k] = nums[i]
            count = 1
            k += 1
        elif nums[i] == l_num and count == 1:
            nums[k] = nums[i]
            count += 1
            k += 1
    return k
```


### Time complexity
The problem wants 


### Space complexity

---

## Resources