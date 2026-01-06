---
title: 71. Simplify path
date: 20260106
tags: [code,medium]
link: https://leetcode.com/problems/simplify-path/?envType=study-plan-v2&envId=top-interview-150
# time: ?
---

## Brainstorm ideas
Simply said, the problem asks to simplify an absolute path with a given set of rules, and those rules being:

- Paths must start with a single slash `/`.
- Directories within the path must be split with a single slash `/`.
- Paths must not end with a slash `/`, unless it's the root directory.
- Paths must not have a single or double `.` since those denote current or previous directories.

With this being said, a possible solution would be to iterate through the characters within our path input `path`.
We can have a counter for both `.` and `/` where we can increment by one and check for a set of conditions, either to delete it or to move one back in the `path`.
But we can also isolate different conditions so we don't have be bothered by it.

We can make use of the `split()` method in python to deal with all conditions for the `/`s.
So if we had an input `path="/home//foo/"`, splitting it by `/` will give us `temp=['','home','','foo','']`.
To deal with the empty strings, we can simple use list comprehension (`[item for item in temp if item]`) and eleminate them to have `['home,'foo']`.

Now we've isolated our concerns to the periods `.`.
We have three cases we need to deal with.

- One period `.`: This just means the current directory, meaning we can forget about it.
- Two periods `..`: This points to the previous directory, meaning we delete the previous directory. If we had `/animals/pets/../goldenretriever`, this will be simplified to `/animals/goldenretriever`.
- Three or more periods: These will be understood as actual directory names, so nothing should be done to them.

These checks can be done while checking each item in our `temp` list that holds our absolute path.
If we see a '.', then we just skip. Nothing needs to be done here.
If we see a '..', then we have to `pop` the last element we added.
If we see anything else, we can add to our response array and forget about it.

And with this, we have a viable solution for this question.

## Solution
```python
def simplifyPath(self, path: str) -> str:
    temp = path.split('/')
    temp = [item for item in temp if item]
    res = []
    for item in temp:
        if item == '..' and res:
            res.pop()
        if item not in ['.', '..']:
            res.append(item)
    return '/' + '/'.join(res)
```

### Time complexity
This has a time complexity of `O(n)` since it iterates through the input list `path`.
So no matter what we will do checks in relation to `n`.

### Space complexity
Space complexity as well will be `O(n)` since we store `n` amount of elements.

### Afterthought
Going over the solution, I can recognized that there are areas in the code that could be simplified, not mainly for performance, but to reduce redundancy in the code.

Since we know that have `.` won't do anything, we can potentially just deal with it in our initial filtering stage.
This will help us deal simplify our for-loop conditions, getting rid of one more check.

```python
def simplifyPath(self, path: str) -> str:
    temp = [item for item in path.split('/') if item and item != '.']
    stack = []
    for item in temp:
        if item == '..':
            if stack:
                stack.pop()
        else:
            stack.append(item)
    return '/' + '/'.join(stack)
```