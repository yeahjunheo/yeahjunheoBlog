---
title: 19. Remove Nth node from end of list
date: 20260108
tags: [code,medium]
link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

Things seem to be going pretty well, especially with how solving questions are getting easier.

So let's try another!

## Brainstorm ideas
Given a `head` of a linked list, we want to remove the `n`th node from the end of the list and return the head.

The key problem with this is 'how do we know the `n`th node from the end?'.

`head` does not give us any info about the end unless we check every node in the list, then how do we do it?

One way would be to go through the whole linked list, store the information somewhere and then get rid of the node we don't want.

But that would take an external storage to hold onto all the nodes and also take more than one pass.

The other way would be to have two pointers, while making sure the distance between the two are `n`.
By updating both pointers when their distance is `n`, we ensure that if the further pointer is done with the linked list, the current pointer is `n` nodes away from the end!

By using this logic, we can update both pointers until we have one on our desired node, then delete the one node we don't want.

## Solution
```python
def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0,head)
    left = dummy
    right = head

    for _ in range(n):
        right = right.next
    
    while right:
        left = left.next
        right = right.next
    
    left.next = left.next.next

    return dummy.next
```

### Time complexity
The time complexity of this would be `O(n)` since the solution goes through one loop.

### Space complexity
The space complexity is constant at 3, so we have a complexity of `O(1)`.