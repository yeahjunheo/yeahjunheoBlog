---
title: 20. Valid parentheses
date: 20260105
tags: [code,easy]
link: https://leetcode.com/problems/valid-parentheses/description/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

## Brainstorm ideas
A simple approach to solve this question would be to use a stack to manage what parentheses we need to look out for.

The image of our solution is like this.
If we see any of the opening parantheses, we can add it to `pool`.
When we see a closing parantheses, we can check whether the post recent item in `pool` is a matching pair.
If it is, bingo! We have a valid pair and we take out (or also known as pop) the most recent item in `pool`.
If it isn't, we can return `False` straight away since that's an invalid parentheses.

Then there are some expceptions that we need to check.
If the `pool` is empty but we have a closing parentheses, then that's invalid too.
Also, if the `pool` isn't empty by the time we've went through all the characters in `s`, that's invalid as well.
So with those checks included with everything else, that should give a solid solution to this question.

## Solution
```python
def isValid(self, s: str) -> bool:
    pool = []
    closed = {")":"(","}":"{","]":"["}
    for char in s:
        if char in closed:
            if not pool or pool[-1] != closed[char]:
                return False
            pool.pop()
        else:
            pool.append(char)
    return len(pool) == 0
```

### Time complexity
With this solution, we're looking at a time complexity of `O(n)` because we make use of a for-loop to run a simple check with `pool`.

### Space complexity
As for the space complexity, we're look at a constant `O(n)` since we have a `pool` that will hold `n/2` characters IF `s` has valid parentheses.
This dominates over the variables `opened` and `closed` because they hold information on the patterns.