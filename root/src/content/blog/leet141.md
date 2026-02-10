---
title: "141. Linked list cycle"
description: "LeetCode problem solving: detecting cycle in linked list using fast and slow pointers"
pubDate: 2026-01-06
tags: ["code", "easy"]
---

## Brainstorm ideas
Linked lists?!

I haven't touched on this since graph theory.

This question simply to determine whether or not a provided linked list has a cycle or not.

Pretty simple to implement, I think.

A linked list means that there are two components.
The value of the current node and the pointer to the next node.

If we consider these two points, we can store the position of each node we've traversed until we come across a node we've already seen.
A duplicate node means theres a cycle!

How will we implement that in code?

Since we know all nodes are unique, we might consider using a set to hold unique linked list nodes.
While we traverse through the linked list, we can add the new node to our visited set.
If we see a visited node, that must mean there's a cycle somewhere, so we return True.
If we saw nothing and end the loop, then we can safely assume there are no cycles and return False.

## Solution
```python
def hasCycle(self, head: Optional[ListNode]) -> bool:
    visited = set()
    while head:
        if head in visited:
            return True
        visited.add(head)
        head = head.next
    return False
```

### Time complexity
This solution has a time compleixty of `O(n)`, simple because we are are checking each node from the input.

### Space complexity
As for the space complexity, this solution is `O(n)` as well.
This might be the reason why this solution is not optimal.
If the linked list is extremely long, the space we need also will increase in in relatino to that.
Therefore a constant storage space would be better for this case.

### Afterthought
As a response to my comment above, a viable solution to reducing the space complexity to `O(1)` was to use the idea that IF there is a loop then there MUST be a time where two pointers will overlap.

If you've watched the first Caption America Movie, you'll remember the scene where Captain America passes by Sam Wilson with the comment "On your left!".
If a cycle exists, a faster pointer will be bound to overtake the slower pointer at some point.

Then we have a solution which uses two pointers, a slow and a fast one, to incrementally check nodes and different paces, until they overlap.
If that's the case, we return True.

If not, which means the linked list is finite, we can return False by default!

With this, we can have the same time complexity of `O(n)` while enjoying the much reduced space complexity of `O(1)`.

```python
def hasCycle(self, head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```
