---
title: "Atcoder Typical 90 - Cross Sum (★2)"
description: "To practice coding problems I figured might as well try out competitive programming. So this is the journey of trying out all 90 typical coding problems from Atcoder (https://atcoder.jp/contests/typical90). Feel free to join me on this journey!"
pubDate: 2026-02-11
tags: ["code", "atcoder"]
draft: False
---

Before anything, let's preface this first post with I haven't touched coding problems in a while.
So I'm probably pretty rusty with all the DSA and Algo needed to solve these types of problems, but that's not an issue.
I'll just have to remember them one-by-one from the back of my brain.

## What do we do?

The Cross Sum problem asks us to return a matrix of integers (INT) where each cell contains the sum of its row and column integers.
If we had a simple 3x3 matrix input:

```
1 1 1
1 1 1 
1 1 1
```

Then the output should be a 3x3 matrix:

```
5 5 5
5 5 5
5 5 5
```

With that being said, for any coding problem it's best to keep things going in minimal number of loops or runs.
What that means is we don't want to be repeating checks on elements if we can avoid the steps.

So an unlikely solution to this would be to store the matrix values of each cell, then add more loops to add the value of every other cell in its corresponding rows and columns.
This would add too many checks per cell, when that could be avoided.

A more likely method would be to store the INT for each cell in one matrix and simultaneously add the values to a list of row sums and column sums.
This way, we can store the sums of elements in each row and column in a single run.
Then on our second run of checking each cell, we can add the row sum and column sum, then take away the repeated cell value `output_cell[i][j] = sum_of_row[j] + sum_of_column[i] - cell[i][j]`.

## My solution...

```python
H, W = map(int, input().split())
rowSum = [0] * H
colSum = [0] * W
intMap = [[0] * W for _ in range(H)]

for i in range(H):
    s = input().split()
    for j, c in enumerate(s):
        rowSum[i] += int(c)
        colSum[j] += int(c)
        intMap[i][j] = int(c)

for i in range(H):
    row = [str(rowSum[i] + colSum[j] - intMap[i][j]) for j in range(W)]
    print(' '.join(row))
```

This solution has a time AND space complexity of `O(H *W)`, which isn't that bad.
It only takes two full runs of checking each value before it spits out an answer.

## Setting up

For the purpose of testing the Atcoder solutions, I created a simple python script that you can use to test your solution with test cases.

```python
# Python 3.11
import sys
import importlib.util
from io import StringIO


def run_tests(module_path):
    spec = importlib.util.spec_from_file_location("solution", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    if not hasattr(module, 'TEST_CASES'):
        print(f"Error: {module_path} does not have TEST_CASES defined")
        return
    if not hasattr(module, 'solve'):
        print(f"Error: {module_path} does not have solve() defined")
        return

    passed = 0
    failed = 0

    for i, (inp, expected) in enumerate(module.TEST_CASES, 1):
        sys.stdin = StringIO(inp)
        sys.stdout = StringIO()
        module.solve()
        result = sys.stdout.getvalue().strip()
        sys.stdin = sys.__stdin__
        sys.stdout = sys.__stdout__

        if result == expected.strip():
            print(f"Test case {i}: PASSED")
            passed += 1
        else:
            print(f"Test case {i}: FAILED")
            print(f"  Expected:\n{expected}")
            print(f"  Got:\n{result}")
            failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 test.py <solution_file.py>")
        sys.exit(1)

    run_tests(sys.argv[1])
```

In the actual solution file, I've added a `TEST_CASES` list of sets that contains the example inputs and outputs to check if my solution works with those.
In most cases, if the code works on those, it should work for other inputs, but who knows...