---
title: "Atcoder Typical 90 - Not Too Bright (★2)"
description: "Day five of practicing the Atcoder problems. Follow this on the official website at (https://atcoder.jp/contests/typical90)!"
pubDate: 2026-02-15
tags: ["code", "atcoder"]
draft: False
---

It's the day after Valentines Day, and my gf is still not in the same country...
That's a one sad sad sentence.

## Forget about it and grind!

Today's question is hard to understand.

If we were given the height and the width of a display, return how many of the LEDs on that display can be lit at the same time under a specific condition: If there exists a 2x2 region of 4 LEDs, no more than 1 LED can be lit.

Understanding this condition was the tricky bit of today's problem.
If we had a 2x3 matrix, then we'd have a display like the following:

```
# . #
. . .
```

But not a display like this:

```
# . #
. # .
```

Since the condition does not hold.
That means for a given row, we can have alternative LEDs lit at the same time.
Then with each row, we also need to alternate from a row with lit LEDs and no lit LEDs.
But writing a solution for only this would not be enough.

This is where it took me a while to realize that if the height or width is just `1`, then this condition can't hold in the first place.
A 2x2 section must exit for this condition to even exist.
So for this special case, we can have any and all the LEDs lit at the same time!

## So what do we get?

With this process of checking our conditions, we can get the following solution.
We can do a quick check for the height and width to check the edge case, followed by the actual calculation under the condition.


```python
H, W = map(int, input().split())
if H == 1 or W == 1:
    print(W if H == 1 else H)
else:
    perH = (H-1)//2 + 1
    perC = (W-1)//2 + 1
    print(perH * perC)
```

Both time and space complexity for this is a constant `O(1)` since the only variables saved are for the height and width, and no operations relative the input size are used.