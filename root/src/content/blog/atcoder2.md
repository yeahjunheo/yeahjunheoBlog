---
title: "Atcoder Typical 90 - Score Sum Queires (★2)"
description: "Day two of practicing the Atcoder problems. Follow this on the official website at (https://atcoder.jp/contests/typical90)!"
pubDate: 2026-02-12
tags: ["code", "atcoder"]
draft: False
---

It's the second day!
The first day was not as challenging, or rather seemed pretty basic.
Let's see how this one goes...

## What the problem do?

This time around, we're dealing with the sum-of scores, pretty similar to what I did the previous day.

We get a series of inputs related to a student, and those inputs include the course number and their score.
Afterwards, we are given a series of queries with a left and a right boundary which we use to return the sum of scores for students within it for each course.

Since the question only limits to two courses, my initial thought is to store the scores for course 1 and 2, where the indices indicates the student number.
Then during the second run of the scores, via the queries, we jsut calculate the sum of the scores from the left to right boundary.

But this had a flaw, that being how heavy the `sum()` is in python.
To call it for every query means that we have to calculate the sum from left to right, and who knows how many queries we'll have.
So a safer and `O(1)` solution to this would be to use prefix sums!

Instead of storing the scores one after another, we can just store sum of the scores as a new entry is added.
For example, if we have a list of `[1,2,3,4,5]`, the prefix sum for this would result in a list that looks like `[1,3,6,10,15]`.
This way we know the total sum of all elements until a certain index, and the sum of students between the left and right bounds can just be calculated by subtracting sums stored in the left and right index, aka for `(left,right) = (2,4)` we get `10-3 = 3+4 = 7`.

## Solution!

I ended up with the solution below!

```python
N = int(input())
class1_prefix = [0] * (N + 1)
class2_prefix = [0] * (N + 1)
for i in range(1, N + 1):
    C, P = map(int, input().split())
    class1_prefix[i] = class1_prefix[i - 1] + (P if C == 1 else 0)
    class2_prefix[i] = class2_prefix[i - 1] + (P if C == 2 else 0)
Q = int(input())
for _ in range(Q):
    L, R = map(int, input().split())
    total_class1 = class1_prefix[R] - class1_prefix[L - 1]
    total_class2 = class2_prefix[R] - class2_prefix[L - 1]
    print(total_class1, total_class2)
```

The prefix sums get stored in a list for each class.
Since each input for the student info either is for class 1 or 2, I've added a check to add the score for the corresponding class.
Then during the query inputs, we just find the difference between the left and right bounds.

The time complexity for this is `O(N + Q)` and the space complexity is `O(N)`.
Pretty optimal if you ask me!