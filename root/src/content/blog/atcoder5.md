---
title: "Atcoder Typical 90 - Sign Up Request (★2)"
description: "Day four of practicing the Atcoder problems. Follow this on the official website at (https://atcoder.jp/contests/typical90)!"
pubDate: 2026-02-14
tags: ["code", "atcoder"]
draft: False
---

I got reminded that today's Valentines day!
**HAPPY VALENTINES** to everyone single or together, and happy valentines to my gf too!
Hope she reads this when she's free...

## Another post? Why the hurry?

I had some time to do more today so here's another question.

This question asks to check if a series of requests to create a username is accepted or not.
Meaning, if I made a request to create `tony_hawks` twice in a row, only the first one is accepted.

So to check if we had created that user, we can just store the usernames we've created before and iterate through the inputs.
That should be pretty simple to implement.

## Here we go!

What I've don is created a single-pass solution.
It checks if the input exists in a pool of usernames, and prints out the index at the same time.
Python has a convenient data structure called `set()` (think of `dict()`) that gives us `O(1)` searches.
So instead of a `list()`, using this would be a much more efficient alternative.

```python
N = int(input())
users = set()

for i in range(N):
    userID = input()
    if userID in users:
        continue
    users.add(userID)
    print(i+1)
```

The time complexity of this is `O(N)`, pretty simple work, and the space complexity is `O(N)` as well (if all inputs are unique).

That was pretty simple! Maybe the two star questions are just easier...