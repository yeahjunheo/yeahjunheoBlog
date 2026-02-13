---
title: "Atcoder Typical 90 - Cubic Cake (★2)"
description: "Day three of practicing the Atcoder problems. Follow this on the official website at (https://atcoder.jp/contests/typical90)!"
pubDate: 2026-02-13
tags: ["code", "atcoder"]
draft: False
---

Today was a long day.
I just added a new visual compoenent to the home screen for this blog.
Also, I had to clean out my closet to slowly get ready for my move from Kyoto to Osaka.
Life is getting too real lately...

## What do we have to do this time?

The question for today was an odd one.
We're given a rectangular prism (cake) with sides A, B and C.
With this immovable cake, it asks to return the minimum number of cuts to get cubes.

If we have the sides A, B, and C, what can tell us the maximum side length of each cube?
Most likely it'll be the greatest common divisor for each side.
That way we know the maximum size of each cube that is potentially acheivable for our cake.

## Best answer?

Implementing this would just mean checking the three inputs for the greatest common divisor (gcd) for three elements,
then followed by adding all the cuts on each side to get these cubes with the gcd value.
As to get the gcd, we can just use the Euclidean algorithm, and since this is usually for two integers, we can run it twice with A and B first than with C.

```python
def gcd(x, y):
    while y:
        x, y = y, x % y
    return x

A, B, C= map(int, input().split())
cube = gcd(gcd(a, b), c)
print((A // cube) + (B // cube) + (C // cube) - 3)
```

The space complexity for this is obviously just `O(1)` since we only store a constant number of values.
As for the time complexity, it'll be `O(log(min(A,B,C)))`.
The time complexity does look weird, but heres the thought process behind it.

### Time complexity how...

If we look at the Euclidean algorithm, we follow a simple pattern.

From two values `x` and `y`, we switch their places and save them as `y` and `x%y`.
This way if `y` is bigger than `x`, nothing really changes,
but if `x` is bigger than `y`, we reduce `x` to a value smaller than `y`.
And with this movement `x -> x%y` we know for a fact that `x%y < x/2` holds.
- if `y <= x/2`: `x%y < y <= x/2`
- if `y > x/2`: `x%y < x-y < x/2`

If we follow through with this, the time complexity for each iteration will decrease by a factor of 2 and so on, giving us an upper bound of `log(N)`.
Since the smaller value between `A` and `B` will dictate when the algorithm will stop, we can look for the minimum value.

Through this idea, we get this time complexity!
Hopefully my message got across.