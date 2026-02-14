---
title: "Atcoder Typical 90 - Select +/- One(★2)"
description: "Day four of practicing the Atcoder problems. Follow this on the official website at (https://atcoder.jp/contests/typical90)!"
pubDate: 2026-02-14
tags: ["code", "atcoder"]
draft: False
---

I do think these two star questions are on the easier side, but I do want to warmup before attempting the harder ones.
Let's give the fifth one a try.

## What does this want?

We're given two lists with `N` integers inside.
We want to check if we're given an interger `K`, would it be possible to convert one list to the other by adding or subtracting by `1` to an element at a time.

For example, if we're given `N = 2, K = 5` and two lists `[1,3]` and `[2,1]`, the answer would be `Yes`.
The steps would look like `[1,3]` to `[2,3]` then `[2,2]` and `[2,1]`.
Since we have two extra steps left, we can just subtract and add `1` to the same element to change nothing.

## Quick solution

Since we've gone through the logic, let's check the solution.
What I've come up with is the following.

```python
N, K = map(int, input().split())
listA = input().split()
listB = input().split()

for _ in range(N):
    diff = abs(int(listA.pop()) - int(listB.pop()))
    K -= diff

if K < 0:
    print("No")
elif K%2==1:
    print("No")
else:
    print("Yes")
```

Once we get the two lists, we'll check each the difference between each integer at the same index.
Since we're adding or subtracting by `1`, the difference is basically the number of steps.
Next, if the total difference is more than `K`, then that would be we can't.
If not, then we can check if whater remainder is even or odd.
This way we can check an element can revert itself back after a change.

The time complexity for this is just `O(N)` since we deal with everything within one single for-loop followed by just simple comparisons right after.
The space complexity is also just `O(N)` to store our input lists.

Pretty simple stuff!