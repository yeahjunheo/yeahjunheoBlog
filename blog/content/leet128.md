---
title: 128. Longest consecutive sequence
date: 20260103
tags: [code,medium]
link: https://leetcode.com/problems/longest-consecutive-sequence/description/?envType=study-plan-v2&envId=top-interview-150
---

## Note from YJ!
It's a new year, so new year new me!

I've thought short-and-soft and came up with one small goal for this year.
And that is to make sure I regularly post at least one post a day.
That also means solving one question a day, whether it be leetcode or atCoder.
It might be a small task, but I wan't to make sure that I consistently post to this blog, to show both that I can solve coding questions (work my brain) and also vocalize/type-out my thoughts out.

Other than that, I need to really work on my graduation thesis. 
The deadline is getting closer, so I need lock in real bad.

## What does the problem want?
Then what is today's question.
It asks to return the length of the longest consecutive elements sequence when given an UNSORTED array of integers.

## Brainstorm ideas
The simplest method to solve this would be to sort our `nums` first, then to iterate through it and have a count for the longest streak.
This way we can quickly sort a list `[100,4,200,1,3,2]` to `[1,2,3,4,100,200]`, then count through it to see the longest continuation.
This would give a time complexity of `O(nlogn)` and a space complexity of `O(1)`

But is this the most optimal?
If space complexity is important, then this method seems like a viable solution since the list is in place and we only need a constant number of surplus space.

But what if time is important?
Then `O(nlogn)` can become a problem for larger lists.
Another method would be to do something similar to that of the sorted solution.
Instead of sorting the list, then counting, we can start from any number and check whether a larger increment exists or not.
This way, we can save on time with sorting and just increment our lookup integer by one.
Then the next problem is our lookup.
A lookup in a list is `O(n)`, and this will make this solution worse than the previous one.
Here we can employ sets, which have `O(1)` lookups.

## Solution
```python
def longestConsecutive(self, nums: List[int]) -> int:
    nums = set(nums)
    res = 0
    for num in nums:
        if (num-1) not in nums:
            curr_num = num
            curr_strk = 1
            while curr_num+1 in nums:
                curr_num += 1
                curr_strk += 1
            res = max(res, curr_strk)
    return res
```

### Time complexity
The time complexity of this method is `O(n)` worst case. Although we have a nested while-loop in a for-loop, this is only accessible for our `(num-1) not in nums` condition.
In addition, the while-loop condition also stops when there is no consecutive integers, which makes it so that our solution, even with the nested loops, run at most `n` times.

### Space complexity
As for space complexity, since we a constant number of additional space, it has a space complexity of `O(1)`.