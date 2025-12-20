---
title: 121. Best time to buy and sell a stock
date: 20251220
tag: [code,easy]
link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
This question wants us to essentially find the largest gap between the buying point and the selling point.
A basic 'How can I maximize my gains' type of question.
The nice thing about this question is that we don't have to return a date.
Just the max profit is fine.

## Brainstorm ideas
Since we only have to return the max profit after checking the values in `prices`, but that poses a challenge.
Just comparing whether the current price is smaller or greater than the buying and selling points will require appropriate checks to ensure the buying comes before the selling.

Then how do we do our checks? One way would be to also compare the indices, but I feel that might be doing too much.
The other, more efficient way would be to do mainly two comparative checks.

1. Is this price the cheapest we've seen?
2. If we were to sell now, is the profit greater than what we know?

With these two checks, we can see whether or not we have our maximum profit within `prices` without having to take not of the dates we bought and sold.

## Solution
```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        buy_price = 1e4
        max_profit = 0
        for price in prices:
            if price < buy_price:
                buy_price = price
            else:
                profit = price - buy_price
                if profit > max_profit:
                    max_profit = profit
        return max_profit
```

### Time complexity
We have one for-loop with two if-else checks, so the time complexity is just `O(n)`.

### Space complexity
We have two variables that hold the buying price and the maximum profit, so the space complexity is `O(1)`.