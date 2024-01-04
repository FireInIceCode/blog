# now it's useless code,use chatgpt!

import os
import re

markrule = (',.:;!?\"\'','，。：；！？“‘')
space=''


def translatexmark(s):
    ls = list(s)
    inlatex = False
    for i, c in enumerate(s):
        if c == '$' and (i == len(s)-1 or s[i+1] != '$') and (i == 0 or s[i-1] != '$'):
            if not inlatex and (i == 0 or s[i-1] not in (' ', '\n', *markrule[0],*markrule[1]) and ls[i-1] != ' '):
                ls[i] = ' $'
            if not inlatex and s[i+1] == ' ':
                ls[i+1] = ''
            if inlatex and (i == len(s)-1 or s[i+1] not in (' ', '\n', *markrule[0],*markrule[1]) and ls[i+1] != ' '):
                ls[i] = '$ '
            if inlatex and s[i-1] == ' ':
                ls[i-1] = ''
            inlatex = not inlatex
        if c == '|' and inlatex:
            ls[i] = ' \\vert '
    s = ''.join(ls)
    s = s.replace('\n\n$$\n\n', '\n$$\n\n')
    return s


def transdot(s):
    for a, b in zip(markrule[0], markrule[1]):
        s = s.replace(a+' ', b)
        s = s.replace(a, b)
    for a in space:
        s= re.sub('\\'+a+'(\S)',lambda c:a+' '+c.group(1),s)
    return s


def translink(s):
    return re.sub('(\!?)\[(.*?)\]\((.*?)\)',lambda r:f'{r.group(1)}[{r.group(2)}]({r.group(3).replace(" ","")})',s)

def transstr(s):

    ls=s.split('```')
    for i,l in enumerate(ls):
        if i&1:
            continue
        ns=l
        ns = transdot(ns)
        ns = translink(ns)
        ns = translatexmark(ns)
        ns = re.sub('\!\s*\[(.*?)\]\((.*?)\)',lambda r:f'![{r.group(1)}]({r.group(2).replace(" ","")})',ns)
        ls[i]=ns
    s=('```'.join(ls))
    return s



def transone(name):
    with open(name, 'r', encoding='utf-8') as f:
        s = f.read()
    print(name)
    with open(name, 'w', encoding='utf-8') as f:
        f.write(transstr(s))



def main():
    s=""
    l=input()
    while l!='@ed':
        s=s+l+'\n'
        l=input()
    s=transstr(s)
    for i in s.split('\n'):
        print(i)

main()
