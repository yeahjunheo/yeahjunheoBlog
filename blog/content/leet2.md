---
title: 2. Add two numbers
date: 20260107
tags: [code,medium]
link: https://leetcode.com/problems/add-two-numbers/description/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

It's another cold day in Kyoto, Japan, and here I am writing another entry for my blog.

Yesterday was pretty fruitful since I got a lot done in terms of the thesis draft.
But still, I'm still ways behind a close friend that finished his thesis already.
I've got to really lock in.

In other news, I feel like leetcoding daily has helped me be a better problem solver.
By forcing myself to sit down and solve a question is helping me see problems in different ways, and writing about it also helps me vocalize my thought processes while solving a problem.

All this to help me be a better candidate for a job...

## Brainstorm ideas
Let's check this question out.

Given two linked lists, return a linked list that adds each node.
Note that the node value can only be single digits.
This means that we'll need to have a carry over variable while we traverse each node in `l1` and `l2`.

A solution to this question would be to simple traverse each node, one at a time, for both `l1` and `l2` simultaneously and store the sum to another linked list `dummy`.

While we check each one, we can calculate the sum of the values in both nodes AND the carry.
With the new sum, we can create a new node that has the first digit of the sum and the carry will be updated to the second digit (if it exists).

Then we also have the some edge cases such as `l1` or `l2` running out.
In this case, we can just set their value to zero, which will have no effect in the actual sum.

Also, we have to thing about when we have a carry over left.
In this case, same logic applies for the two values set to zero but we now add the carry over.

With all this, we now have a working solution that should meet the requirements of the problem.

## Solution
```python
def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0)
    currNode = dummy
    carryOver = 0

    while l1 or l2 or carryOver:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carryOver
        carryOver = total // 10
        currNode.next = ListNode(total % 10)
        currNode = currNode.next

        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next
```

### Time complexity
The time complexity of this solution will be `O(max(n,m))` where `n` is the length of `l1` and `m` is the length of `l2`.

### Space complexity
As for the space complexity, it is also `O(max(n,m))` since we have the dummy list link that stores our computed values.