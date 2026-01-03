---
title: 228. Summary ranges
date: 20260103
tags: [code,easy]
link: https://leetcode.com/problems/summary-ranges/description/?envType=study-plan-v2&envId=top-interview-150
---

## Note from YJ
Some of the problems you see here were solved prior to starting thie blog, but still are kinda tricky once I got back to solving them.
It's not like I do these sort of problem solving during my computer science courses, and even more so for my computer-network and security research.
Nonetheless, this seems to be trend, so I need to make sure I can properly solve these sort of questions while making my thoughts clear and loud.

One thing I should keep in mind is to make it clear when I dont understand or am unsure of a question's solution.
Better to learn from mistakes and from mentors than running with a lie.

## What does the problem want?
This problem asks to return a list of ranges for consecutive integers within a sorted array `nums`.

## Brainstorm ideas
Let's think with an example.
Given `[0,1,2,4,5,7]`, we have three unique consecutive ranges.
`[0,1,2]`, `[4,5]`, and `[7]`.
That means the expected output should be `["0->2","4->5","7"]`.

What we can do is to iterate through the array `nums` and check for consecutive integers.
For the current integer, we can check if a previous integer exists.
If it doesn't, then it's a start of a sequence.
If it does, then it is either the end or in the middle.

## Solution
```python
def summaryRanges(self, nums: List[int]) -> List[str]:
    if not nums:
        return []

    num_set = set(nums)
    res = []
    for num in nums:
        if num-1 not in num_set:
            start_num = num 
            curr_num = num
            while curr_num in num_set:
                curr_num += 1
            if curr_num-1 == start_num:
                res.append(f"{start_num}")
            else:
                res.append(f"{start_num}->{curr_num-1}")
    return res
```

### Time complexity
The time complexity for this solution is `O(n)` since we are still just iterating from the start to the end of `nums`.

### Space complexity
As for space complexity, we create `num_set` for the optimized lookups. This means the space complexity is `O(n)` as well.