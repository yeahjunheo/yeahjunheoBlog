---
title: 167. Two sum II - input array is sorted
date: 20251222
tag: [code,medium]
link: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
This question asks if we were given an 1-index array with numbers in non-decreasing order, then return a pair of numbers that add up to our `target`.
To simplify things, the question also specifies that there exists exactly one solution.

## Brainstorm ideas
The easiest logic I can think about when solving this would be to check for `target - current_number` within `numbers`.
If it exists, then we can return its index with the current index + 1 as the pair solution.
But checking if something exists within a list takes `O(n)` time, and worst-case this might check until the end element, giving us `O(n^2)`.

Thus, we might have to consider a different method for this.
We can create a dictionary of the values in `numbers` and look up within this.
This is a valid approach because dictinoary lookups are only `O(1)` in Python.
We will iterate through `numbers` and check if the `target - current_number` exists in our visited numbers.
If not, we add it to our list of visited numbers with it's index, if yes, we return the pair of indices.

Since a solution is guaranteed, we don't have to worry about the case where the current value and the `target - current_number` are the same.
This will be accounted for automatically, we just have to return the index pair.

## Solution
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        nums = dict()
        for i, val in enumerate(numbers, 1):
            temp = target - val
            if temp in nums:
                return [nums[temp], i]
            nums[val] = i
```

### Time complexity
The time complexity of this will be `O(n)`, since we only run a single iteration of checks.


### Space complexity
The space complexity, on the other hand, will be `O(n)` in the worst case scenario where the answer is at the end of `numbers`. But let's hope that won't be the case!