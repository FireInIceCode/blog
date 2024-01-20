---
title: 转置原理
subtitle: 已经是老年选手了但是没有科技树
layout: post
show: true
top: false
tags: 
- 多项式
- 笔记
- 数学
---

# 转置原理

其实两年前就集训听过了但是懂了0

向量用小写字母,矩阵用大写字母

基本内容是对于一个问题给定$v$计算$vM$的问题,考虑如果给定$v$计算$vM^T$的转置问题是容易的就可以直接改造出一个复杂度相同的算法计算原问题.

## 适用范围

要求算法是线性的,可以表示成上面的计算$vM$的形式,或者具体的对于输入的$v$,算法全程没有关于$v$的判断类语句,所有关于$v$的运算都是赋值和线性运算.

## 改造

一个非奇异矩阵$M$可以拆成若干个初等矩阵的积$M=E_1E_2\ldots E_k$,则$M^T=E_k^TE_{k-1}^k\ldots E_1^k$,于是只要转置每一步并倒序算法.

对于不同的初等矩阵的转置($v$为输入向量,其他均为常数):

- 交换$v_i,v_j$:不变
- $v_i=cv_i$:不变
- $v_i=v_i+cv_j$:$v_j=v_j+cv_i$
- $v_i=v_j$:先拆成$v_i=0v_i,v_i=v_i+v_j$,于是得到$v_j=v_j+v_i,v_i=0$
- $v_i=c$,在$v$中增加一个常数,$v_i=0v_i,v_i=v_i+v_j$,后果是$v_i=0$

## 转化

就是列出那个矩阵然后翻转一下.

比如DFT就是翻转范德蒙德矩阵($M_{i,j}=w^{ij}$),翻了等于没翻,所以计算的是原问题.

常见形式是BGF的矩阵($M_{i,j}=[x^iy^j]F(x,y)$)乘向量,如计算$f_i=\sum_i a_i[x^iy^j]F(x,y)$,翻转后的问题变为计算$f_i=\sum_i a_i[x^jy^i]F(x,y)$

## 例

### FFT

刚才说了DFT翻了等于没翻,所以计算的是原问题,那么把它改造成翻转之后因为顺序反转位逆序变换变成最后一步,不翻转的IDFT的第一步也是位逆序变换,就抵消了,就不需要变换了.

### 多点求值

等于计算$fM$,其中$f_i=[z^i]F(z)$,$M_{i,j}=x_j^i$,那么转置问题是计算$fA$,其中$A_{i,j}=x_i^j$,也就是对每个$i$计算$\sum_j f_jx_j^i=[z^i] \sum_j\dfrac{f_j}{1-x_jz}$,那么后面这个直接分治FFT维护分子分母通分累加就能计算,再把刚才的算法改造成转置的就是原问题算法了.

### Do Use FFT Gym102978D

> 给定序列$a_n,b_n,c_n$,对每个$k$求
> 
> $$
> f_k=\sum_{i=1}^nc_i\prod_{j=1}^k(a_i+b_j)
> $$
> $n\le 2\times 10^5$

把$c$作为输入向量,则矩阵为$M_{i,j}=\prod_{k=1}^j(a_i+b_k)$,转置之后$M_{i,j}=\prod_{k=1}^i(a_j+b_k)$,相当于计算
$$
f_k=\sum_{i=1}^nd_i\prod_{j=1}^i(a_k+b_j)
$$

相当于计算多项式$\sum_{j=1}^nd_i\prod_{j=1}^i(x+b_j)$带入每个$a_k$的值,只要分治FFT+多点求值都转置一下就行了.

### P7440 「KrOI2021」Feux Follets


> 设 $\text{cyc}_\pi$ 将长为 $n$ 的排列 $\pi$ 当成置换时所能分解成的循环个数。给定两个整数 $n,k$ 和一个 $k-1$ 次多项式$G(x)$，对 $1\leq m\leq n$ 求：
> 
> $$
> \sum\limits_{\pi}F(\text{cyc}_{\pi})
> $$
> 
> 其中 $\pi$ 是长度为 $m$ 且不存在位置 $i$ 使得 $\pi_i=i$ 的排列。

先写GF,考虑排列个数是$\dfrac{1}{1-x}$,对环做exp应该得到排列,一个环的就是$\ln(\dfrac{1}{1-x})$,去掉自环减去$x$,再带上另一个元$exp$回去得到BEGF:

$$
F(x,y)=\exp(y(\ln(\dfrac{1}{1-x})-x))
$$

则要求

$$
\sum_i G(i)[x^my^i]F(x,y)
$$

转置就是

$$
\sum_i G(i)[x^iy^m]F(x,y)
$$

考虑
$$
\begin{gathered}
    F(x,y)=\dfrac{(\dfrac{1}{1-x})^y}{e^{xy}}\\
    \dfrac{\delta F}{\delta x}=\dfrac{xyF}{1-x}
\end{gathered}
$$

于是设$H_i(x)=[x^i]F(x,y)$,同时提取$x^{n-1}$的系数有$nH_{n}=(n-1)H_{n-1}+yH_{n-2}$,则设转移矩阵是$T$,相当于求

$$
\sum_{i=0}^m G(i)[y^m]H_0T_1\ldots T_i
=[y^m]\sum_{i=0}H_0T_1\ldots T_iG(i)
$$
然后分治计算,维护区间的矩阵乘积$S$和贡献$V$,则$S_{l,r}=S_{l,mid}\times S_{mid+1,r},V_{l,r}=V_{l,mid}+S_{l,mid}V_{mid+1,r}$,最后算出一个多项式取第$m$项即可.

#### [trick]

上面最后的问题,是已知BGF$F(x,y)$,求$\sum_ia_i[x^iy^n]F(x,y)$,此时若$F$在$x$上微分有限则可以写出关于$[x^i]F$的递推式,然后按照上文的方法分治做.

### Loj3640集训队互测 细菌

> 求从$a,b,c$开始走$d$步不走出$n\times m\times k$的长方体的方案数
> 
> $a,b,c,n,m,k,d\le 1\times 10^5$

首先显然可以卷起每一维的,而一维的方案数可以反射容斥,设以$i$为终点的路径的容斥系数是$c_i$,则走$n$步的方案数为$f_n=\sum_i c_i[x^i](x+x^{-1})^n=c_i[x^iy^n]\dfrac{1}{1-y(x+x^{-1})}$,转置后是$c_i[x^ny^i]\dfrac{1}{1-y(x+x^{-1})}=c_i[x^n](x+x^{-1})^y=[x^n]c_i(x+x^{-1})^i$,也就是$f$的OGF相当于$c$的OGF复合$x+x^{-1}$.

#### [trick]二次式的复合

[参考](https://www.luogu.com.cn/blog/Fly37510/FUHE-ERCIFENSHI)

- 复合普通二次函数$ax^2+bx+c$可以先配方成$a(x+b')^2+c'$,而算$F(x^2)$和$F(x+c)$都是简单的.
- 对于$\dfrac{1}{ax^2+bx+c}$的情况可以先算$x^{k}F(\dfrac{1}{x})$($k$为多项式次数)也就是直接把多项式系数翻转,再按照上面的方法复合.
- 对于$F(\dfrac{x^2}{ax^2+bx+c})$可以先翻转变成要算$F_R(\dfrac{c}{x^2}+\dfrac{b}{x}+a)$而这个等于$F_R(cx^2+bx+a)$复合$\dfrac{1}{x}$.
- 对于剩下的就一般二次式配方可以变成$F(\dfrac{(x+e)^2}{ax^2+bx+c}+d)$的形式,先复合$x+d$再复合里面的最后复合$x+e$即可.