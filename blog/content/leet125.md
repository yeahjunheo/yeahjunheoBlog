---
title: 125. Valid Palindrome
date: 20251220
tags: [code,easy]
link: https://leetcode.com/problems/valid-palindrome/description/?envType=study-plan-v2&envId=top-interview-150
---

## What does the problem want?
Finding a poalindorme type of question is a classic coding test that has been around for ages.
This question in particular asks to check if we only consider the letters, whether or not it is a valid palindrome.

## Brainstorm ideas
To solve this, I'd assume the first step would be to get rid of all white spaces, commas, other notations, and to convert all Upper-case letters to lower-case.
After that, we can just comparae reversed string nad the string and return the comparison.
That in itself is a pretty solid solution to finding a valid palindrome and can be written as the following.

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        s = re.sub(r'[^A-Za-z0-9]', '', s)
        s = s.lower()
        reverse = s[::-1]
        return s == reverse
```

But you'll notice that this solution has a time and space complexity of `O(n)`.

We can reduce the space complexity to `O(1)` if we use two-pointers, rather than reversing the array itself.
In that case, we can compare the two ends on each side and check for negative results.
If everything passes, it must be a palindrome, and we can return `true`.


## Solution
```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s)-1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True
```

### Time complexity
This has a time complexity of `O(n)`.
Although we do have a nested while-loop, keep in mind that these loops do not exceed `n` and only act within the bounds/limit that we had originally set, which is the `left < right`.
Therefore, even with the nested loops, this solution still retains the time complexity of `O(n)`.

### Space complexity
Since we don't have any external variables that stoe any values, this has a time compelxity of `O(1)`.