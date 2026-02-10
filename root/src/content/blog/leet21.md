---
title: "21. Merge two sorted lists"
description: "LeetCode problem solving: merging two sorted linked lists into one"
pubDate: 2026-01-07
tags: ["code", "easy"]
---

## Brainstorm ideas
This question asks to sort two sorted linked lists `list1` and `list2`.

Since we know both linked lists are sorted, then we can simmply compare the nodes of both lists one at a time until we've checked all the nodes in one.

We'll have to take into consideration the cases where one or both lists run out, so we can have the solution run a specific action right after.
If `list1` is done, then that must mean all that is left in `list2` should be sorted and comes right after.
Same can be said for `list 2`.
If both are done, then we can just ignore that.

## Solution
```python
def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0)
    point = dummy
    while list1 and list2:
        if list1.val < list2.val:
            point.next = list1
            list1 = list1.next
        else:
            point.next = list2
            list2 = list2.next
        point = point.next
    if list1:
        point.next = list1
    else:
        point.next = list2
    return dummy.next
```

### Time complexity
This solution has a time complexity of `O(n+m)` where `n` is the length of `list1` and `m` is the length of `list2`.

### Space complexity
Same goes for the space complexity. This also has a complexity of `O(n+m)`.
