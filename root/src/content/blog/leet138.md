---
title: "138. Copy list with random pointer"
description: "LeetCode problem solving: deep copying linked list with random pointers using hash map"
pubDate: 2026-01-07
tags: ["code", "medium"]
---

## Brainstorm ideas
This one surprised me with the amount of words just in the description itself.

It wants us to create a deep copy of a given linked list.

A deep copy, by its definition, is a copy that doesn't point to the original nodes.

Also, it doesn't help that the nodes of this list also have an additional field called `random` that points to either `null` or another random node in the list.
So a solution that does this in one go might not be possible,

Then what do we have to do?

For each node we pass, we do the following:

- Create a new `Node(head.val)` if it doesn't exist in our storage.
- Create/Update the random node in the storage.
- Create/Update the next node in the storage.

By repeating this until the end of the linked list, we can achieve our deep copying.

## Solution
```python
def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
    if head is None:
        return None

    storage = {}
    res = head
    while head:
        if head not in storage:
            storage[head] = Node(head.val)

        if head.random:
            if head.random not in storage:
                storage[head.random] = Node(head.random.val)
            storage[head].random = storage[head.random]

        if head.next:
            if head.next not in storage:
                storage[head.next] = Node(head.next.val)
            storage[head].next = storage[head.next]
        head = head.next
    return storage[res]
```

### Time complexity
The time complexity for this solution is `O(n)` since we have a single run through.

### Space complexity
The space compelxity is `O(n)` since we have `n` amount of entries to store the keys and the copied nodes.

### Afterthought
What my solution does is wants to cram everything within one single runthrough.

So adding and updating nodes were all done in one swift swoop.

But another rather clearer method exists where we split the adding and updating into two loops.

On the first loop, we copy and add all new nodes to our dictionary.
This is preparation for updating all the nodes.

On the second loop, we will check for next and random values from the original and map the copies accordingly.
Here we are reassured that all necessary nodes exist in our `storage` since we've just added all reachable nodes.

```python
def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
    if head is None:
        return None

    storage = {}
    curr = head
    while curr:
        storage[curr] = Node(curr.val)
        curr = curr.next

    curr = head
    while curr:
        if curr.next:
            storage[curr].next = storage[curr.next]
        if curr.random:
            storage[curr].random = storage[curr.random]
        curr = curr.next

    return storage[head]
```

This solution has both the same time and space complexity.
It's just a lot more clearer since it separates the steps into two different loops.
