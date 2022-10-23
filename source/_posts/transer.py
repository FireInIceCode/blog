import os,re


def translatexmark(s):
    ls=list(s)
    inlatex=False
    for i,c in enumerate(s):
        if c=='$' and (i==len(s)-1 or s[i+1]!='$') and (i==0 or s[i-1]!='$'):
            if not inlatex and (i==0 or s[i-1] not in (' ','\n') and ls[i+1]!=' '):
                ls[i]=' $'
            if not inlatex and s[i+1]==' ':
                ls[i+1]=''
            if inlatex and (i==len(s)-1 or s[i+1] not in (' ','\n') and ls[i+1]!=' '):
                ls[i]='$ '
            if inlatex and ls[i-1][-1]==' ':
                ls[i-1]=''
            inlatex=not inlatex
    return ''.join(ls)

def transdot(s):
    rule=('，。：；！？￥（）【】“‘《》',',.:;!?$()[]\"\'<>')
    for a,b in zip(rule[0],rule[1]):
        s=s.replace(a,b)
    return s

def transstr(s):
    s=translatexmark(s)
    s=transdot(s)
    return s

def transone(name):
    with open(name,'r',encoding='utf-8') as f:
        s=f.read()
    with open(name,'w',encoding='utf-8') as f:
        f.write(transstr(s))


def main():
    for f in os.listdir('./'):
        if f[-2:]=='md':
            transone(f)

main()

