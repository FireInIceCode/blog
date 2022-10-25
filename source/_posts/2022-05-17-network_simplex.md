---
title: 感性理解网络单纯形
subtitle: 我网络流1e5
layout: post
show: true
istop: false
tags: 
- 图论 
- 网络流
- 单纯形
- 笔记
---
# 感性理解网络单纯形

传说最快费用流

## 前置知识

单纯形,费用流基本概念

## 符号说明

n为点数,m为边数,先假设图为**联通**的(显然不联通什么也不影响)

边e的单位费用为 $cost_e$ ,流量上界为 $cap_e$ , 由 $u_e$ 指向 $v_e$ 

虽然原文中无显式反向边,但我们还是**按有反向边考虑**更简单

## 理论基础

我们知道费用流模型在线性规划标准形式的系数矩阵是**全幺模矩阵**,(这个矩阵有n行m列,仅由0,1,-1组成,每一列可以表示一条边,设这条边由u指向v,则矩阵中u行为-1,v行为1).

直接单纯形,我们会设每一条边的流量,然后再转化标准形式,所以这里可以先感性理解的把边的流量作为LP中的变量(忽略松弛变量).

##### Th.此矩阵的一组基对应图的一棵生成树

(这个证起来简单就证一下

(如果没有线性规划基础看不懂证明可以跳过

证明:若选中的基包含一个环,则将这个环的边的列顺次相加得到0,则这不是一组基,所以基的列对应的图无环,又因其能张成原图,所以其联通,因此能唯一对应一棵生成树.

于是得到这样对应关系:

- 单纯形中变量对应边的流量

- 单纯形中基的选择对应图的一棵生成树(一种边的选择)

于是对应着其流程,我们要找到

- 如何将一个非基变量替换一个基变量
  
  - 如何选择一个非基变量并移入
    
    - 如何增加一个变量的值
  
  - 如何选择一个基变量并移出

#### 增加一个变量的值(边的流量)

对于一条边,我们可以沿着它在一个环上推动一个流:

![](https://raw.githubusercontent.com/FireInIceCode/imgs/main/imgs/202205111557679.png)

如图,如果图中存在这一一个环,我们可以沿着它推送10的流量,容易发现仍然满足流量平衡(一个环,进去的和出去的一样).

#### 寻找应该移入的非基变量

当我们沿着一个环增加变量的值时,为了保证费用最小,我们**只在环的费用和为负时做**,但这样无法保证流量最大,所以可以**先给源点到汇点建一条边流满,费用为 inf,流量为 inf**,此时它的反向边会和其他由源到汇的流形成一个环,且沿着这个环推动费用只降不增(反向边费用为 -inf )于是保证了在最大流前提下寻找最小费用.

于是我们面临的问题是,如何快速计算环的和,这里有一个不错的 trick:

对于每一个点计算它到根的路径的费用和,我们命名为 $Pi$ ,则对于边 e: u->v ,它形成的环的费用和为 $Reduce_e = Cost_e + Pi_u -Pi_v$ , 因为除了 e 本身的费用外,从 u 到 u 和 v 的 lca 的费用是 $pi_{lca} - pi_u$ (因为方向是逆着树边走的所以**费用取反**) ,从 lca 走到 v 的费用是 $Pi_u - Pi_{lca}$ ,两者相加即可得到.

#### 替换基变量:

按照单纯形算法我们要替换掉的是一个**限制最紧**的变量,对应到这里就是找到这个**环中剩余流量最小的边**把它移出.

#### 总结流程

于是我们按照以下流程去做:

1. 找到初始的基,也就是随便建一棵生成树

2. 根据选择策略找到一条边,给这个环整体加上一个流,所以
   
   1. 我们看看这个环最大能加多少(就是这个环上边容量的最小值),并给它加上这么多.这个操作就相当于我们在LP中把这条边的变量加入基变量,对于这条边的变量进行增加以在顶点间移动. 
   
   2. 加入这个基变量后要删除一个(基大小为矩阵的秩),移出环上剩余流量最小的边

## 实现

### 边的选择

三种方式

1. 按照单纯形中,我们可以检查每一条边并找到其中 $Reduce_e$ 最小的 e 作为新的基变量

2. 直接循环遍历所有边,每碰到一个 $Reduce_e < 0$ 的就选了

3. 平衡前两种,划分大小为B的块,对每一个块内使用策略1,块和块间策略2,按LEMON论文,B应取 $\sqrt V$ 

### 实现1,单次O(n),暴力

~~暴力怎么做? (小声) 暴力怎么做? (大声) 暴力是不是,加边,加边,加边,并查集查询~~

用向上标记法lca(充满了暴力的味道),每次删除一条边时暴力翻转一条链的父子关系(画图可以得知,这个关系是从删除的那条边中深的端点到新加的那条边的端点的链)

### 实现2,单次O(logn),Link-Cut Tree

我觉大家看到树上删去一条边,新加一条边,寻找链上最小值,是不是都想到LCT了

常数大,但再大 O(logn) 也大不过 O(n) 吧,不知道为什么没见人写过.

如果有人写了这个告诉我谢谢.

## 复杂度

> We target a complexity of  $O(V)$  per pivot in the worst-case, and for pivot selection we will perform a *block search* as described in the LEMON paper, with desired runtime of  $O(\sqrt E )$ (can be tuned), but worst-case runtime of  $O(E)$ .

每次移入移出遍历为最坏 $O(V)$ ,在边的选择上用策略3期望 $O(\sqrt E )$ 

至于到底要执行多少次这个移入,移出的过程,这和单纯形一样是玄学吧,~~目前有多种不同的分析,得出的结论大致相近,~~为:

~~O(能过),O(很快),O(玄学)和~~O(基本到不了的最坏指数级)

我为了~~偷懒~~代码的简洁选择了策略2+暴力的实现,经测试随机数据下,在我的拖拉机电脑上大概1s跑m=1.5e5,v=4e4的图刚刚好,已经远远超过EK和Zkw的 $VE^2$ 了吧

我的实现:

```cpp
#include<iostream>
using namespace std;
const int N=5e5+500,M=5e6+500,INF=1e
// #define int long long;

struct Edge{
    int u,v,w,c,next;
} edges[M];
int head[N],ecnt=1;
void _add_edge(int u,int v,int w,int c){
    edges[++ecnt]=(Edge){u,v,w,c,head[u]};
    head[u]=ecnt;
}
void add_edge(int u,int v,int w,int c){
    _add_edge(u,v,w,c);
    _add_edge(v,u,0,-c);
}

//fe为父亲指向自己的边,mark是标记当前信息是否过期等用途,curtime表示mark值为curtime的信息未过期
int piCache[N],fa[N],fe[N],circle[N],mark[N],curtime=1;
// 随机一棵生成树初始化
void init_tree(int u,int fi){
    fe[u]=fi;
    fa[u]=edges[fi].u;
    mark[u]=1;
    for(int i=head[u];i;i=edges[i].next){
        int v=edges[i].v;
        //不过这里mark就判重用的
        if(mark[v]||edges[i].w==0)continue;
        init_tree(v,i);
    }
}

int pi(int x){
    if(mark[x]==curtime)return piCache[x];
    mark[x]=curtime;
    piCache[x]=pi(fa[x])+edges[fe[x]].c;
    return piCache[x];
}

typedef pair<int,int> pii;

//沿着e在生成树上形成的环推送流
int pushFlow(int e){
    //向上标记法求lca,够暴力
    int rt=edges[e].u,lca=edges[e].v;
    curtime++;
    int ccnt=0;
    while(rt){
        mark[rt]=curtime;
        rt=fa[rt];
    }
    while(mark[lca]!=curtime){
        mark[lca]=curtime;
        lca=fa[lca];
    }

    //找到被替换的(省域流量最小的)边,记录环上最小剩余流量
    int minflow=edges[e].w,p=2,del_u=0;
    for(int u=edges[e].u;u!=lca;u=fa[u]){
        circle[++ccnt]=fe[u];
        if(edges[fe[u]].w<minflow){
            minflow=edges[fe[u]].w;
            del_u=u;
            p=0;
        }
    }
    for(int u=edges[e].v;u!=lca;u=fa[u]){
        int ne=fe[u]^1;
        circle[++ccnt]=ne;
        if(edges[ne].w<minflow){
            minflow=edges[ne].w;
            p=1;
            del_u=u;
        }
    }
    circle[++ccnt]=e;

    //沿着环推送流量
    int cost=0;
    for(int i=1;i<=ccnt;i++){
        cost+=edges[circle[i]].c*minflow;
        edges[circle[i]].w-=minflow;
        edges[circle[i]^1].w+=minflow;
    }

    //如果最小的就是当前边就不用加到树上了
    if(p==2)return cost;

    //把边加入树上,翻转一条链
    int u=edges[e].u,v=edges[e].v;
    if(p==1)swap(u,v);
    int last_e=e^p,last_u=v;
    while(last_u!=del_u){
        last_e^=1;
        mark[u]--; // 设置这条链上的信息过期
        swap(fe[u],last_e);
        int nu=fa[u];
        fa[u]=last_u;
        last_u=u;
        u=nu;
    }
    return cost;
}

//总算法
pii simplex(int s,int t){
    add_edge(t,s,INF,-INF);
    init_tree(t,0);
    mark[t]=++curtime;
    fa[t]=0;
    int cost=0,flow=0;
    //反复执行
    bool running=true;
    while(running){
        running=false;
        for(int i=2;i<=ecnt;i++){
            if(edges[i].w&&edges[i].c+pi(edges[i].u)-pi(edges[i].v)<0){
                cost+=pushFlow(i);
                running=true;
            }
        }
    }
    //flow在每次直接累加是错的,会把正反的都算上,直接根据一开始加的那条边算
    flow=edges[ecnt].w;
    return make_pair(flow,cost+flow*INF); //+flow*INF是消除一开始加的那条边的费用
}

//这个是luogu或uoj费用流板子对应的主程序
signed main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    int n,m,s,t;
    cin>>n>>m>>s>>t;
    for(int i=1;i<=m;i++){
        int u,v,w,c;
        cin>>u>>v>>w>>c;
        add_edge(u,v,w,c);
    }
    pii res=simplex(s,t);
    cout<<res.first<<" "<<res.second<<endl;
}
```

## 番外

Q:这东西太快了,我想用它跑最大流

A:可以,但费用设成0远比设成1或其他值快(然后你可以用它过HLPP板子

Q:有了它就不学模拟费用流了

A:显然不行,如洛谷上Raper你会获得48分好成绩(是的我用它测了个速

Q:为什么我用这个跑不过luogu费用流板子上最优解(一个EK算法)?

A:这是个笑话

![](https://raw.githubusercontent.com/FireInIceCode/imgs/main/imgs/202205111717746.png)--摘自你谷最优解

## 参考:

[[Tutorial] Network simplex - Codeforces](https://codeforces.com/blog/entry/94190) 好文,就是从这学的

[矩阵角度讲解](https://www.cs.upc.edu/~erodri/webpage/cps/theory/lp/network/slides.pdf)
