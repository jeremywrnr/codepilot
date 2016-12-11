import sys
import traceback

from browser import document as doc
from browser import window, alert, console

_credits = """    Thanks to CWI, CNRI, BeOpen.com, Zope Corporation and a cast of thousands
    for supporting Python development.  See www.python.org for more information."""

_copyright = """Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
All Rights Reserved.

Copyright (c) 2001-2013 Python Software Foundation.
All Rights Reserved.

Copyright (c) 2000 BeOpen.com.
All Rights Reserved.

Copyright (c) 1995-2001 Corporation for National Research Initiatives.
All Rights Reserved.

Copyright (c) 1991-1995 Stichting Mathematisch Centrum, Amsterdam.
All Rights Reserved."""

_license = """Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer. Redistributions in binary
form must reproduce the above copyright notice, this list of conditions and
the following disclaimer in the documentation and/or other materials provided
with the distribution.
Neither the name of the <ORGANIZATION> nor the names of its contributors may
be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
"""

def credits():
    print(_credits)
credits.__repr__ = lambda:_credits

def copyright():
    print(_copyright)
copyright.__repr__ = lambda:_copyright

def license():
    print(_license)
license.__repr__ = lambda:_license

def write(data):
    doc['code'].value += str(data)


sys.stdout.write = sys.stderr.write = write
history = []
current = 0
_status = "main"  # or "block" if typing inside a block


### Include some things in the namespace

before_globals = list(globals().keys())


class Link:
    """A linked list.

    >>> s = Link(3, Link(4, Link(5)))
    >>> len(s)
    3
    >>> s[2]
    5
    >>> s
    Link(3, Link(4, Link(5)))
    >>> s.first = 6
    >>> s.second = 7
    >>> s.rest.rest = Link.empty
    >>> s
    Link(6, Link(7))
    """
    empty = ()

    def __init__(self, first, rest=empty):
        assert rest is Link.empty or isinstance(rest, Link)
        self.first = first
        self.rest = rest

    def __getitem__(self, i):
        if i == 0:
            return self.first
        else:
            return self.rest[i-1]

    def __len__(self):
        return 1 + len(self.rest)

    def __repr__(self):
        if self.rest:
            rest_str = ', ' + repr(self.rest)
        else:
            rest_str = ''
        return 'Link({0}{1})'.format(self.first, rest_str)

    @property
    def second(self):
        return self.rest.first

    @second.setter
    def second(self, value):
        self.rest.first = value

# Trees
class Tree:
    """A tree with root as its root value."""
    def __init__(self, root, branches=[]):
        self.root = root
        for branch in branches:
            assert isinstance(branch, Tree)
        self.branches = list(branches)

    def __repr__(self):
        if self.branches:
            branch_str = ', ' + repr(self.branches)
        else:
            branch_str = ''
        return 'Tree({0}{1})'.format(self.root, branch_str)

    def __str__(self):
        return '\n'.join(self.indented())

    def indented(self, k=0):
        indented = []
        for b in self.branches:
            for line in b.indented(k + 1):
                indented.append('  ' + line)
        return [str(self.root)] + indented

    def is_leaf(self):
        return not self.branches

def leaves(tree):
    """Return the leaf values of a tree.

    >>> leaves(fib_tree(4))
    [0, 1, 1, 0, 1]
    """
    if tree.is_leaf():
        return [tree.root]
    else:
        return sum([leaves(b) for b in tree.branches], [])

# Binary trees

class BTree(Tree):
    """A tree with exactly two branches, which may be empty."""
    empty = Tree(None)

    def __init__(self, root, left=empty, right=empty):
        for b in (left, right):
            assert isinstance(b, BTree) or b is BTree.empty
        Tree.__init__(self, root, (left, right))

    @property
    def left(self):
        return self.branches[0]

    @property
    def right(self):
        return self.branches[1]

    def is_leaf(self):
        return [self.left, self.right] == [BTree.empty] * 2

    def __repr__(self):
        if self.is_leaf():
            return 'BTree({0})'.format(self.root)
        elif self.right is BTree.empty:
            left = repr(self.left)
            return 'BTree({0}, {1})'.format(self.root, left)
        else:
            left, right = repr(self.left), repr(self.right)
            if self.left is BTree.empty:
                left = 'BTree.empty'
            template = 'BTree({0}, {1}, {2})'
            return template.format(self.root, left, right)

def fib_tree(n):
    """Fibonacci binary tree.

    >>> fib_tree(3)
    BTree(2, BTree(1), BTree(1, BTree(0), BTree(1)))
    """
    if n == 0 or n == 1:
        return BTree(n)
    else:
        left = fib_tree(n-2)
        right = fib_tree(n-1)
        fib_n = left.root + right.root
        return BTree(fib_n, left, right)

def contents(t):
    """The values in a binary tree.

    >>> contents(fib_tree(5))
    [1, 2, 0, 1, 1, 5, 0, 1, 1, 3, 1, 2, 0, 1, 1]
    """
    if t is BTree.empty:
        return []
    else:
        return contents(t.left) + [t.root] + contents(t.right)

# Binary search trees

def bst(values):
    """Create a balanced binary search tree from a sorted list.

    >>> bst([1, 3, 5, 7, 9, 11, 13])
    BTree(7, BTree(3, BTree(1), BTree(5)), BTree(11, BTree(9), BTree(13)))
    """
    if not values:
        return BTree.empty
    mid = len(values) // 2
    left, right = bst(values[:mid]), bst(values[mid+1:])
    return BTree(values[mid], left, right)

def largest(t):
    """Return the largest element in a binary search tree.

    >>> largest(bst([1, 3, 5, 7, 9]))
    9
    """
    if t.right is BTree.empty:
        return t.root
    else:
        return largest(t.right)

def second(t):
    """Return the second largest element in a binary search tree.

    >>> second(bst([1, 3, 5]))
    3
    >>> second(bst([1, 3, 5, 7, 9]))
    7
    >>> second(Tree(1))
    """
    if t.is_leaf():
        return None
    elif t.right is BTree.empty:
        return largest(t.left)
    elif t.right.is_leaf():
        return t.root
    else:
        return second(t.right)

# Sets as binary search trees

def contains(s, v):
    """Return true if set s contains value v as an element.

    >>> t = BTree(2, BTree(1), BTree(3))
    >>> contains(t, 3)
    True
    >>> contains(t, 0)
    False
    >>> contains(bst(range(20, 60, 2)), 34)
    True
    """
    if s is BTree.empty:
        return False
    elif s.root == v:
        return True
    elif s.root < v:
        return contains(s.right, v)
    elif s.root > v:
        return contains(s.left, v)

def adjoin(s, v):
    """Return a set containing all elements of s and element v.

    >>> b = bst(range(1, 10, 2))
    >>> adjoin(b, 5) # already contains 5
    BTree(5, BTree(3, BTree(1)), BTree(9, BTree(7)))
    >>> adjoin(b, 6)
    BTree(5, BTree(3, BTree(1)), BTree(9, BTree(7, BTree(6))))
    >>> contents(adjoin(adjoin(b, 6), 2))
    [1, 2, 3, 5, 6, 7, 9]
    """
    if s is BTree.empty:
        return BTree(v)
    elif s.root == v:
        return s
    elif s.root < v:
        return BTree(s.root, s.left, adjoin(s.right, v))
    elif s.root > v:
        return BTree(s.root, adjoin(s.left, v), s.right)

t = BTree(3, BTree(1),
              BTree(7, BTree(5),
                        BTree(9, BTree.empty, BTree(11))))


"""Functions that simulate dice rolls.

A dice function takes no arguments and returns a number from 1 to n
(inclusive), where n is the number of sides on the dice.

Types of dice:

 -  Dice can be fair, meaning that they produce each possible outcome with equal
    probability. Examples: four_sided, six_sided

 -  For testing functions that use dice, deterministic test dice always cycle
    through a fixed sequence of values that are passed as arguments to the
    make_test_dice function.
"""

from random import randint

def make_fair_dice(sides):
    """Return a die that returns 1 to SIDES with equal chance."""
    assert type(sides) == int and sides >= 1, 'Illegal value for sides'
    def dice():
        return randint(1,sides)
    return dice

four_sided = make_fair_dice(4)
six_sided = make_fair_dice(6)

def make_test_dice(*outcomes):
    """Return a die that cycles deterministically through OUTCOMES.

    >>> dice = make_test_dice(1, 2, 3)
    >>> dice()
    1
    >>> dice()
    2
    >>> dice()
    3
    >>> dice()
    1
    >>> dice()
    2

    This function uses Python syntax/techniques not yet covered in this course.
    The best way to understand it is by reading the documentation and examples.
    """
    assert len(outcomes) > 0, 'You must supply outcomes to make_test_dice'
    for o in outcomes:
        assert type(o) == int and o >= 1, 'Outcome is not a positive integer'
    index = len(outcomes) - 1
    def dice():
        nonlocal index
        index = (index + 1) % len(outcomes)
        return outcomes[index]
    return dice

after_globals = list(globals().keys())

custom_globals = set(after_globals) - set(before_globals)

# execution namespace
editor_ns = {'credits':credits,
    'copyright':copyright,
    'license':license,
    '__name__':'__main__',
    'custom_globals': custom_globals
    }

for name in custom_globals:
    editor_ns[name] = eval(name)

def cursorToEnd(*args):
    pos = len(doc['code'].value)
    doc['code'].setSelectionRange(pos, pos)
    doc['code'].scrollTop = doc['code'].scrollHeight

def get_col(area):
    # returns the column num of cursor
    sel = doc['code'].selectionStart
    lines = doc['code'].value.split('\n')
    for line in lines[:-1]:
        sel -= len(line) + 1
    return sel


def set_text_to(text):
    doc['code'].value = text

def myKeyPress(event):
    global _status, current
    if event.keyCode == 9:  # tab key
        event.preventDefault()
        doc['code'].value += "    "
    elif event.keyCode == 13:  # return
        src = doc['code'].value
        if _status == "main":
            currentLine = src[src.rfind('>>>') + 4:]
        elif _status == "3string":
            currentLine = src[src.rfind('>>>') + 4:]
            currentLine = currentLine.replace('\n... ', '\n')
        else:
            currentLine = src[src.rfind('...') + 4:]
        if _status == 'main' and not currentLine.strip():
            doc['code'].value += '\n>>> '
            event.preventDefault()
            return
        doc['code'].value += '\n'
        history.append(currentLine)
        current = len(history)
        if _status == "main" or _status == "3string":
            try:
                _ = editor_ns['_'] = eval(currentLine, editor_ns)
                if _ is not None:
                    write(repr(_)+'\n')
                doc['code'].value += '>>> '
                _status = "main"
            except IndentationError:
                doc['code'].value += '... '
                _status = "block"
            except SyntaxError as msg:
                if str(msg) == 'invalid syntax : triple string end not found' or \
                    str(msg).startswith('Unbalanced bracket'):
                    doc['code'].value += '... '
                    _status = "3string"
                elif str(msg) == 'eval() argument must be an expression':
                    try:
                        exec(currentLine, editor_ns)
                    except:
                        traceback.print_exc()
                    doc['code'].value += '>>> '
                    _status = "main"
                elif str(msg) == 'decorator expects function':
                    doc['code'].value += '... '
                    _status = "block"
                else:
                    traceback.print_exc()
                    doc['code'].value += '>>> '
                    _status = "main"
            except:
                traceback.print_exc()
                doc['code'].value += '>>> '
                _status = "main"
        elif currentLine == "":  # end of block
            block = src[src.rfind('>>>') + 4:].splitlines()
            block = [block[0]] + [b[4:] for b in block[1:]]
            block_src = '\n'.join(block)
            # status must be set before executing code in globals()
            _status = "main"
            try:
                _ = exec(block_src, editor_ns)
                if _ is not None:
                    print(repr(_))
            except:
                traceback.print_exc()
            doc['code'].value += '>>> '
        else:
            doc['code'].value += '... '

        cursorToEnd()
        event.preventDefault()

def myKeyDown(event):
    global _status, current
    if event.keyCode == 37:  # left arrow
        sel = get_col(doc['code'])
        if sel < 5:
            event.preventDefault()
            event.stopPropagation()
    elif event.keyCode == 36:  # line start
        pos = doc['code'].selectionStart
        col = get_col(doc['code'])
        doc['code'].setSelectionRange(pos - col + 4, pos - col + 4)
        event.preventDefault()
    elif event.keyCode == 38:  # up
        if current > 0:
            pos = doc['code'].selectionStart
            col = get_col(doc['code'])
            # remove current line
            doc['code'].value = doc['code'].value[:pos - col + 4]
            current -= 1
            doc['code'].value += history[current]
        event.preventDefault()
    elif event.keyCode == 40:  # down
        if current < len(history) - 1:
            pos = doc['code'].selectionStart
            col = get_col(doc['code'])
            # remove current line
            doc['code'].value = doc['code'].value[:pos - col + 4]
            current += 1
            doc['code'].value += history[current]
        event.preventDefault()
    elif event.keyCode == 8:  # backspace
        src = doc['code'].value
        lstart = src.rfind('\n')
        if (lstart == -1 and len(src) < 5) or (len(src) - lstart < 6):
            event.preventDefault()
            event.stopPropagation()


doc['code'].bind('keypress', myKeyPress)
doc['code'].bind('keydown', myKeyDown)
doc['code'].bind('click', cursorToEnd)
doc['code'].bind('click', cursorToEnd)

v = sys.implementation.version
doc['code'].value = "CS61A Python %s.%s.%s\n>>> " % (
    v[0], v[1], v[2])
#doc['code'].value += 'Type "copyright", "credits" or "license" for more information.'
doc['code'].focus()
cursorToEnd()
