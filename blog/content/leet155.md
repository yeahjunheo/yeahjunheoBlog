---
title: 155. Min stack
date: 20260106
tags: [code,medium]
link: https://leetcode.com/problems/min-stack/description/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

## Brainstorm ideas
What caught me off guard about this question was it's time complexity requirement.
The other requirements like `push()`, `pop()`, and `top()` are all doable within constant time since lists in python already have dedicated methods for them AND they are just retrieval at best.
But what about `getMin()`?

Using the `min()` method for lists in python would exceed constant time, so that was a no-go.
The best way to retrieve the minimum value would be to also store it so we can retrieve it like how we do with the other methods.
And since we're dealing with a stack, then there should be a way to store and handle the minimum value using a stack as well.

What I came up with would be to store TWO things in each stack - the value itself and the previous minimum value.
Why the previous minimum value?
This comes in handy for our `pop()` method.
When we pop the top values one at a time, there will come a point where the current minimum value will also be popped.
Then we'll need to update the minimum value.
To help us retrieve this information in one single action, we can store the previously minimum value with the new pushed value so that when we pop it, we can use that record to update the new minimum.

## Solution
```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.minVal = None

    def push(self, val: int) -> None:
        self.stack.append([val,self.minVal])
        self.minVal = min(self.minVal, val) if self.minVal is not None else val

    def pop(self) -> None:
        if self.stack:
            temp = self.stack.pop()
            self.minVal = temp[1]

    def top(self) -> int:
        if self.stack:
            return self.stack[-1][0]

    def getMin(self) -> int:
        if self.stack:
            return self.minVal
```

### Time complexity
The time complexity for this solution is `O(1)`, as the question has required.

### Space complexity
The space complexity is `O(n)`, where the stack will contain `2n` values worth of space.