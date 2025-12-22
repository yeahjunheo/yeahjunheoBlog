---
title: 122. Best time to buy and sell stock II
date: 20251220
tags: [code,medium]
link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
Unlike the [first version](https://yeahjunheo.com/leet121) of this question, this asks for the maximum possible profit when we allow buying and selling multiple times.
That means if we had a price range that goes up and down, we can buy and sell multiple times to get an accumulative profit greater than a single cycle.

## Brainstorm ideas
How would we do this then? We can keep the same logic from the first version.
That means we have a check to see if the buying price is lower, and if we make a profit.
But one change we'll add is how to decide the selling.
The question changed this time with the clause "you can sell and buy the stock multiple times on the same day", meaning, we can just sell whenever a profit is made and buy it then too.
So a change in logic will mean if the current price is greater than the buy price, we just sell&buy, then record the profit to our max profit.

## Solution
```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        buy_price = int(1e4)
        tot_profit = 0
        for price in prices:
            if price < buy_price:
                buy_price = price
            else:
                profit = price - buy_price
                tot_profit += profit
                buy_price = price
        return tot_profit
```

### Time complexity
We have one for-loop with two if-else checks, so the time complexity is just `O(n)`.

### Space complexity
We have two variables that hold the buying price and the total profit, so the space complexity is `O(1)`.