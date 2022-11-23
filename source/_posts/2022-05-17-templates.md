---
title: 模板复习
subtitle: 打不对
layout: post
show: false
top: 0
tags: 
- 模板
---

# 板子

## 图论

### tarjan:

- 割点
  
  - 条件:对于点u存在儿子v使low\[v\]>=dfn\[u\] (实现时low可以算u的dfn,也对)
  
  - 感性理解:说明v的子树内除了u之外没有其他方法走到外面
  
  - 注意:对于dfs树的根(开始dfs的节点),要通过统计子树个数方法判断(>1则为割点)
  
  - 代码:
    
    ```cpp
    void dfs(int u,int rt=0){
      if(rt==0)rt=u;
      dfn[u]=low[u]=++dcnt;
      int children=0;
      for(int v:G[u]){
          if(dfn[v]){
              low[u]=min(low[u],dfn[v]);
              continue;
          }
          dfs(v,rt);
          children++;
          low[u]=min(low[u],low[v]);
          if(u!=rt&&low[v]>=dfn[u]){
              //说明是割点
          }
      }
      if(children>1&&u==rt){
          //说明是割点
      }
    }
    ```

- 割边
  
  - 条件:对于边e:u->v,low\[v\]>=dfn\[u\]
  - 理解:同割点
  - 实现:简单不放

- 强联通分量
  
  - 条件:dfs时把点入栈,在dfn\[u\]=low\[v\]时,要退出dfs时若满足条件一直弹栈到把自己也弹了,弹出部分都是同一scc
  - 理解:同一强联通分量在dfs中是连续的一块,在栈里也是
  - 细节:low不更新横叉边指向的点(已经被访问却在栈外)
- 圆方树
  - 仙人掌版
    - ```cpp
      void addpoints(int stop,int ex) {
          scnt++;
          tadd_edge(ex,scnt);
          int v;
          do{
              v=stk.top();
              tadd_edge(v,scnt);
              stk.pop();
          }while(v!=stop);
      }
      void tarjan(int u) {
          dfn[u] = low[u] = ++dcnt;
          stk.push(u);
          for (int v : G[u])
              if (dfn[v])
                  low[u] = min(low[u], dfn[v]);
              else {
                  tarjan(v);
                  low[u] = min(low[u], low[v]);
                  if (low[v] >= dfn[u])
                      if (stk.top() == v) {
                          tadd_edge(u,v);
                          stk.pop();
                      } else
                          addpoints(v,u);
              }
      }
      ```

### 差分约束

#### 细节:

1. 最短路是满足条件的最大解,最长路是最小解

2. 建立隐藏条件边

3. 相等条件双向连边

## 字符串

### SAM

```cpp
const int N=1e6+500;
struct node{
    int nxt[27];
    int len,link;
} ns[N*2];
int root,last,scnt;
void init(){
    root=0;
    ns[0].link=-1;
    ns[0].len=0;
    last=root;
    scnt=0;
}
void insert(char c){
    int cur=++scnt;
    ns[cur].len=ns[last].len+1;
    int p=last;
    last=cur;
    while(p!=-1&&!ns[p].nxt[c]){
        ns[p].nxt[c]=cur;
        p=ns[p].link;
    }
    if(p==-1){
        ns[cur].link=root;
        return;
    }
    int q=ns[p].nxt[c];
    if(ns[p].len+1==ns[q].len){
        ns[cur].link=q;
        return;
    }
    int clone=++scnt;
    ns[clone].len=ns[p].len+1;
    ns[clone].link=ns[q].link;
    memcpy(ns[clone].nxt,ns[q].nxt,sizeof(ns[clone].nxt));
    while(p!=-1&&ns[p].nxt[c]==q){
        ns[p].nxt[c]=clone;
        p=ns[p].link;
    }
    ns[q].link=ns[cur].link=clone;
}
```

#### 细节:

1. 记得初始化
2. 记得p=ns[p].link的挑父亲
3. 记得数组开2倍
4. 广义SAM要特判!

## 数据结构

### Splay

```cpp
#include <iostream>
using namespace std;
const int N = 1e5 + 500,inf=1e7+500;
int n;
int cnt[N], siz[N], val[N], ch[N][2], fa[N],ncnt;
void refresh(int x) {
    siz[x] = siz[ch[x][0]] + siz[ch[x][1]] + cnt[x];
}
bool chk(int x) {
    return ch[fa[x]][1] == x;
}
void rotate(int x) {
    int f = fa[x], gf = fa[f], w1 = chk(x), w2 = chk(f);
    fa[ch[x][!w1]] = f;
    ch[f][w1] = ch[x][!w1];
    fa[f] = x;
    ch[x][!w1] = f;
    fa[x] = gf;
    ch[gf][w2] = x;
    refresh(f);
    refresh(x);
}
int root;
void splay(int x, int goal = 0) {
    while (fa[x] != goal) {
        int f = fa[x];
        if(fa[f]!=goal){
            if (chk(x) == chk(f))
                rotate(f);
            else
                rotate(x);
        }
        rotate(x);
    }
    if (!goal)
        root = x;
}
void insert(int v){
    int u=root;
    while(val[u]!=v&&ch[u][v>val[u]]){
        u=ch[u][v>val[u]];
    }
    if(val[u]==v){
        cnt[u]++;
        splay(u);
    }else{
        int x=++ncnt;
        cnt[x]=siz[x]=1;
        val[x]=v;
        fa[x]=u;
        if(u)ch[u][v>val[u]]=x;
        splay(x);
    }
}
int find(int v){
    int u=root;
    while(val[u]!=v&&ch[u][v>val[u]]){
        u=ch[u][v>val[u]];
    }
    return u;
}
int pre(int v){
    splay(find(v));
    if(val[root]<v)return root;
    int u=ch[root][0];
    while(ch[u][1])u=ch[u][1];
    splay(u);
    return u;
}
int succ(int v){
    splay(find(v));
    if(val[root]>v)return root;
    int u=ch[root][1];
    while(ch[u][0])u=ch[u][0];
    splay(u);
    return u;
}
void remove(int v){
    int u=find(v);
    if(cnt[u]>1){
        cnt[u]--;
        splay(u);
    }else{
        int pr=pre(val[u]),su=succ(val[u]);
        splay(pr);
        splay(su,pr);
        fa[u]=ch[su][0]=0;
        splay(su);
    }
}
int kth(int val){
    int u=root;
    while(true){
        if(val<=siz[ch[u][0]])u=ch[u][0];
        else if(val>siz[ch[u][0]]+cnt[u])val-=siz[ch[u][0]]+cnt[u],u=ch[u][1];
        else return u;
    }
}
int rank_(int x){
    int u=find(x);
    splay(u);
    return siz[ch[u][0]]+1;
}
int main(){
    cin>>n;
    insert(-inf);
    insert(inf);
    for(int i=1;i<=n;i++){
        int opt,x;
        cin>>opt>>x;
        if(opt==1){
            insert(x);
        }else if(opt==2){
            remove(x);
        }else if(opt==5){
            cout<<val[pre(x)]<<endl;
        }else if(opt==6){
            cout<<val[succ(x)]<<endl;
        }else if(opt==3){
            cout<<rank_(x)-1<<endl;
        }else{
            cout<<val[kth(x+1)]<<endl;
        }
    }
    return 0;
}
```

#### 细节

1. 双旋要判断祖父是不是目标
2. 当不保证求前驱后继的节点存在时,要在`splay(find(val))`后判断根是否满足条件.
3. 区分节点编号和值,用那个变量命名(

### LCT

```cpp
const int N=1e5+500;
int fa[N],ch[N][2],val[N],xors[N];
bool rev[N];
bool notroot(int x){
    return ch[fa[x]][0]==x||ch[fa[x]][1]==x;
}
bool chk(int x){
    return ch[fa[x]][1]==x;
}
void refresh(int x){
    xors[x]=xors[ch[x][0]]^xors[ch[x][1]]^val[x];
}
void tag_rev(int x){
    swap(ch[x][0],ch[x][1]);
    rev[x]^=1;
}
void pushdown(int x){
    if(!rev[x])return;
    tag_rev(ch[x][0]);
    tag_rev(ch[x][1]);
    rev[x]=false;
}
void rotate(int x){
    int f=fa[x],gf=fa[f],k1=chk(x),k2=chk(f);
    fa[x]=gf;
    if(notroot(f))ch[gf][k2]=x;
    if(ch[x][k1^1])fa[ch[x][k1^1]]=f;
    ch[f][k1]=ch[x][k1^1];
    fa[f]=x;
    ch[x][k1^1]=f;
    refresh(f);
    refresh(x);
}
int stk[N];
void splay(int x){
    int scnt=0,tmp=x;
    while(notroot(tmp)){
        stk[++scnt]=tmp;
        tmp=fa[tmp];
    }
    stk[++scnt]=tmp;
    while(scnt)pushdown(stk[scnt--]);
    while(notroot(x)){
        int f=fa[x];
        if(notroot(f)){
            if(chk(f)==chk(x)){
                rotate(f);
            }else{
                rotate(x);
            }
        }
        rotate(x);
    }
}
void access(int x){
    for(int y=0;x;y=x,x=fa[x]){
        splay(x);
        ch[x][1]=y;
        refresh(x);
    }
}
void changeroot(int x){
    access(x);
    splay(x);
    tag_rev(x);
}
int findroot(int x){
    access(x);
    splay(x);
    pushdown(x);
    while(ch[x][0]){
        x=ch[x][0];
        pushdown(x);
    }
    splay(x);
    return x;
}
void link(int u,int v){
    changeroot(u);
    if(findroot(v)!=u){
        fa[u]=v;
    }
}
void cut(int x,int y){
    changeroot(x);
    if(findroot(y)!=x||fa[y]!=x||ch[y][0])return;
    fa[y]=0;
    ch[x][0]=0;
    refresh(x);
}
void split(int x,int y){
    changeroot(x);
    access(y);
    splay(x);
}
```

#### 细节:

1. 注意findroot最后要splay根

2. cut的判断:findroot(y)==x说明在同一棵树,fa[y]==x是因为直接相连,ch[y][0]==0因为比它浅的只有根,根是它的父亲.

3. access背过

4. findroot要记得pushdown

## 多项式

### FWT

```cpp
void fwtAnd(int *f,int x){
    for(int l=2;l<=n;l<<=1){
        int mid=l>>1;
        for(int p=0;p<n;p+=l){
            for(int k=0;k<mid;k++){
                f[p+k]=(f[p+k]+f[p+k+mid]*x)%P;
            }
        }
    }
}
void fwtOr(int *f,int x){
    for(int l=2;l<=n;l<<=1){
        int mid=l>>1;
        for(int p=0;p<n;p+=l){
            for(int k=0;k<mid;k++){
                f[p+k+mid]=(f[p+k]*x+f[p+k+mid])%P;
            }
        }
    }
}
void fwtXor(int *f,int x){
    for(int l=2;l<=n;l<<=1){
        int mid=l>>1;
        for(int p=0;p<n;p+=l){
            for(int k=0;k<mid;k++){
                int o1=f[p+k],o2=f[p+k+mid];
                f[p+k]=(o1+o2)*x%P;
                f[p+k+mid]=(o1-o2)*x%P;
            }
        }
    }
}
```

别把与和或弄反,异或最后x是1(正变换)或1/2(逆变换)

输出时要注意把数弄回正的,因为减法过程会出负数
