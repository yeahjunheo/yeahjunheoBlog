---
title: "Atcoder Typical 90 -  Select 5 (★2)"
description: "Day six of practicing the Atcoder problems. Follow this on the official website at (https://atcoder.jp/contests/typical90)!"
pubDate: 2026-02-16
tags: ["code", "atcoder"]
draft: False
---

Today's day six of this challenge!
I should do more questions that the current one per day though...

## Let's get into today's challenge!

This question was a odd one for me.
The whole structure of it demanded that I use some sort of nested loop and no other alternative.
Knowing how programming questions are, time complexity is extremely importatnt to keep watch out for, and nested loops are somewhat of a common enemy for this.
with that being said, I couldn't think of any other solution to this one...

The quest asks if given three integers `N`, `P`, and `Q`, and a list of `N` integers, what is the number of products of 5 integers from the list that will give a remainder of `Q` when divided by `P`.

Odd isn't it?
Becuase of how the question demands all these groupings for the product, I had no choice but to use nested loops to checkout all possible product combination.

Also, in order to noet go over maximum integer possible with Python, I used a neat trick that simplifies our calculations.
Let's say we have to integers `A` and `B` defined as `A = Qa * P + Ra` and `B = Qb * P + Rb`. Then for `AB`, we get the following: 

```
AB = (Qa * P + Ra)(Qb * P + Rb) == Qa * Qb * P^2 + Qa * P * Rb + Qb * P * Ra + Ra * Rb
```

This tells us that `AB % P` gives us the same value as `(A%P)(B%P)%P`.
We can make use of this to reduce the large integer edge cases that we would definitely encounter if we end up finding the products of large numbers.

## Nested loops?

With that being said, the solution below makes use of the nested loops to find all the different product groups of 5 integers and compares the remainder with `Q`.

```python
N,P,Q = map(int, input().split())
A = list(int(num) for num in input().split())
count = 0
for i in range(N):
    for j in range(i+1, N):
        p2 = A[i] * A[j] % P
        for k in range(j+1, N):
            p3 = A[k] * p2 % P
            for l in range(k+1, N):
                p4 = A[l] * p3 % P
                for m in range(l+1, N):
                    p5 = A[m] * p4 % P
                    if p5 == Q:
                        count += 1
print(count)
```
The space complexity of this is `O(N)` since we have the initial list of inputs.
The time complexity is a whole another story.
The total number of checks, or the number of choices we'll end up getting is the combination of `(N,5)`.
That gives us `(N!)/((N-5)!5!)` as total number of items to check, which will give a big-O notation of `O(N(N-1)(N-2)(N-3)(N-4)) = O(N^5)`.
Still a pretty heavy time complexity, but I feel we can't do more than this.