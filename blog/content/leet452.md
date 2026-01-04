---
title: 452. Minimum number of arrows to burst balloons
date: 20260104
tags: [code,medium]
link: https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/description/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

## What does the problem want?
Once given a list of points with items that hold the horizontal positions of each baloon, determin the minimum number of arrows to pop all the balloons.

## Brainstorm ideas
The greedy approach to solving this question would be to check for each interval for any overlaps.
One interaction we know is that if two or more baloons happend to be overlapping at one point, they can be shot with a single baloon.
And a simple check for this would be to compare whether the end of a balloon is greater than the start of another balloon.

```bash
 0 1 2 3 4 5 6 7 8 9
  [ balloon 1 ]
          [ balloon 2 ]
```

So as long as the balloons that come after the first balloon starts before the end of the first one, then we can say we only need one arrow to shoot it down.
Now we need to figure out how to deal with balloons that don't overlap.

```bash
 0 1 2 3 4 5 6 7 8 9
[ bln 1 ]
  [ bln 2 ]
              [ bln 3 ]
```

In the above example, `bln1` and `bln2` are within the case that I've talked above; however, `bln3` is not.
What we can do is we can set the new end check to be this balloon, increment the arrow count by one, then continue with the next balloon.

## Solution
```python
def findMinArrowShots(self, points: List[List[int]]) -> int:
    if not points:
        return 0

    points.sort(key=lambda x: x[1])
    res = 1
    currEnd = points[0][1]
    for point in points:
        if currEnd < point[0]:
            res += 1
            currEnd = point[1]
    return res
```

### Time complexity
The time complexity for this is `O(n log n)` because of the sort method we use to sort the intervals.
The for-loop is `O(n)`, but that is overshadowed by the sort.

### Space complexity
The space complexity is going to be `O(1)`, since we only use `res` as additional storage.
