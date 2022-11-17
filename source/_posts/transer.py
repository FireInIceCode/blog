import os
import re

markrule = ('，。：；！？￥（）【】“‘《》', ',.:;!?$()[]\"\'<>')


def translatexmark(s):
    ls = list(s)
    inlatex = False
    for i, c in enumerate(s):
        if c == '$' and (i == len(s)-1 or s[i+1] != '$') and (i == 0 or s[i-1] != '$'):
            if not inlatex and (i == 0 or s[i-1] not in (' ', '\n', *markrule[0],*markrule[1]) and ls[i+1] != ' '):
                ls[i] = ' $'
            if not inlatex and s[i+1] == ' ':
                ls[i+1] = ''
            if inlatex and (i == len(s)-1 or s[i+1] not in (' ', '\n', *markrule[0]),*markrule[1] and ls[i+1] != ' '):
                ls[i] = '$ '
            if inlatex and ls[i-1][-1] == ' ':
                ls[i-1] = ''
            inlatex = not inlatex
        if c == '|' and inlatex:
            ls[i] = ' \\vert '
    s = ''.join(ls)
    s = s.replace('\n\n$$\n\n', '\n$$\n\n')
    return s


def transdot(s):
    for a, b in zip(markrule[0], markrule[1]):
        s = s.replace(a, b)
    return s


def transstr(s):
    s = translatexmark(s)
    s = transdot(s)
    return s


def transone(name):
    with open(name, 'r', encoding='utf-8') as f:
        s = f.read()
    print(name)
    with open(name, 'w', encoding='utf-8') as f:
        f.write(transstr(s))


def main():
    for f in os.listdir('./'):
        if f[-2:] == 'md':
            transone(f)


main()
