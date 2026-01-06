---
title: 150. Evaluate reverse polish notation
date: 20260106
tags: [code,medium]
link: https://leetcode.com/problems/evaluate-reverse-polish-notation/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

## Brainstorm ideas
Reverse Polish Notation (RPM) is a type of notation where the operator comes after the operands.
So if we have `3 + 4`, then the RPN for that would be `3 4 +`.

To solve this, we can make use of a stack!
By utilizing a stack, what we can do is push new operands into the stack AND pop two new operands whenever we spot an operator.
This way, we can iterate from the start of `tokens` and check if the item we're at is an operator `{'+','-','*','/}` or not.

For every new item, if it's not an operator, we just push it into the stack `res` as an integer.
We do this until we get an operator.
At this point, we use `pop()` to get the left and right operand which we will use to derive our new operand to put back into the stack.
This repeats until we've gone through all values in `tokens`, which will leave us with one value in our stack.

By utilizing an external stack, we are able to solve an expression in RPM pretty efficiently as well AND without recursion.

## Solution
```python
def evalRPN(self, tokens: List[str]) -> int:
    operator = {'+','-','*','/'}
    res = []
    for char in tokens:
        if char not in operator:
            res.append(int(char))
        else:
            r_op = res.pop()
            l_op = res.pop()
            if char == '+':
                res.append(l_op + r_op)
            elif char == '-':
                res.append(l_op - r_op)
            elif char == '*':
                res.append(l_op * r_op)
            else:
                res.append(int(l_op / r_op))
    return res.pop()
```

### Time complexity
The time complexity for this solution is `O(n)` since we iterate through all the characters in `tokens`.

### Space complexity
As for space complexity, we also have `O(n)` since we have `res` that stores the operands that will most definitely be relative to the number of input values in `tokens`.