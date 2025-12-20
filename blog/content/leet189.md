---
title: 189. Rotate array
date: 20251220
tag: [code,medium]
link: https://leetcode.com/problems/rotate-array/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
The task that this problem asks is to rotate the intgers in the array by `k` steps.

## Brainstorm ideas
One thing is for sure, if `k` goes over the length of `nums`, then there will definitely be redundancies in the rotation.
Then for a `nums` of length 4 and `k` of 5, we have redundancy of 4. So instead of shifting 5 times, we can just shift once.

Now how do we do the shifting. An easy way to do this would be to compare the current position with the shift, then store that value to a secondary array.
After that, we can replace all the values in `nums` with the values in our external array, let's say `res`.
In this case, the solution will be some like the following.

```python
class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        len_nums = len(nums)
        res = [0]*len_nums
        for i in range(len_nums):
            tar_pos = (i + k) % len_nums
            res[tar_pos] = nums[i]
        for i in range(len_nums):
            nums[i] = res[i]
```

But the question challenges us to work with `O(1)` extra spaces. The current solution uses `O(n)` since we have `res`.

From the hint given in the question, there is a way of solving this via reversing the array.
Looking at an example array `[1,2,3,4,5,6,7]`, the reverse of that will be `[7,6,5,4,3,2,1]`.
How does that help? If `k=3`, then it can be seen as reversing everything before `k=3` and everything after it.
```
       k
       v
[7,6,5,4,3,2,1]
       v
[5,6,7,4,3,2,1]
       v
[5,6,7,1,2,3,4]
```

How about we set this up? 

## Solution
```python
class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        def reverse(r_nums: list, left: int, right: int) -> None:
            while left < right:
                r_nums[left], r_nums[right] = r_nums[right], r_nums[left]
                left += 1
                right -= 1
        
        k = k % len(nums)
        reverse(nums, 0, len(nums)-1)
        reverse(nums, 0, k-1)
        reverse(nums, k, len(nums)-1)
```

### Time complexity
The time complexity for this will be `O(n)`. In total, this solution runs the loop three times, but two of the loop cycles will add up to `n` while the initial reverse is `n`, thus the time complexity.

### Space complexity
The space complexity, on the other hadn, will be `O(1)` since we don't add any extra space except for our original array `nums`.