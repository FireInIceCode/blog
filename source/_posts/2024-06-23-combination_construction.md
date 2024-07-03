---
title: 几个组合构造的证明
subtitle: 本质不同无标号荒漠计数
layout: post
show: true
top: false
tags: 
- 生成函数
---

# 几个组合构造的证明

有人问无标号海胆计数,然后大喊CYC构造,然后发现大家都把各种构造是啥忘了.

设$A(x)=\sum_i a_ix^i$是我们要构造的东西

## 可重集构造MSET

EI在WC上讲过,MSET是这样的:
$$
\begin{gathered}
    \mathrm{MSET} A(x)=\prod (\dfrac{1}{1-x^i})^{a_i}\\
    =\exp \sum_i -a_i\ln (1-x^i)\\
    =\exp \sum_i a_i \sum_{j=1} \dfrac{x^{ij}}{j}\\
    =\exp \sum_{i=1} \dfrac{A(x^i)}{i}
\end{gathered}\\
$$

## 幂集构造PSET

类比MSET,写式子,求ln,展开ln,交换求和号.

$$
\begin{gathered}
    \mathrm{PSET} A(x)=\prod_i (1+x^i)^{a_i}\\
    =\exp \sum_i a_i \ln (1+x^i)\\
    =\exp \sum_i a_i \sum_{j=1} \dfrac{x^{ij}}{j}(-1)^{j-1}\\
    =\exp \sum_{i=1} \dfrac{(-1)^{i-1}}{i}A(x^i)
\end{gathered}
$$

## 环构造CYC

不burnside的证明来自 Analytic Combinatorics.

首先大家都知道不能直接$\mathrm{SEQ}$再积分,因为循环节.

那么定义一个序列/环是本原的当且仅当没有循环节,则对本原序列的GF积分就是本原环.

先数序列,用$x$统计容量,$y$统计成分,$F(x,y)=\mathrm{SEQ}_{\ge 1}(yA(x))=\dfrac{yA(x)}{1-yA(x)}$表示非空序列,设$G(x,y)$为本原序列的GF,则有$F(x,y)=\sum_{i\ge 1} G(x^i,y^i)$.应用莫反得到

$$
G(x,y)=\sum_{i\ge 1} \mu(i)F(x^i,y^i)=\sum_{i\ge 1}\mu(i)\dfrac{y^iA(x^i)}{1-y^iA(x^i)}
$$

于是本原环的GF有

$$
\begin{gathered}
    H(x,y)=\int \dfrac{G(x,y)}{y} \mathrm{d}y\\
    =\sum_{i\ge 1} \int \mu(i)\dfrac{A(x^i)}{1-y^iA(x^i)}\mathrm{d}y\\
    \because \int \dfrac{a}{1-ay^i}\mathrm{d}y=-\ln(1-ay^i)\dfrac{1}{i}\\
    \therefore H(x,y)=-\sum_{i\ge 1} \dfrac{\mu(i)}{i}\ln(1-A(x^i)y^i)
\end{gathered}
$$

最后环的GF显然有

$$
\begin{gathered}
    B(x,y)=\sum_{k\ge 1}H(x^k,y^k)\\
    =-\sum_{k\ge 1} \sum_{i\ge 1} \dfrac{\mu(i)}{i}\ln(1-A(x^{ik})y^{ik})\\
    =-\sum_{k\ge 1} \ln(1-A(x^k)y^k)\sum_{i\mid k}\dfrac{\mu(i)}{i}\\
    \because \sum_{i\mid k}\dfrac{\mu(i)}{i}=\frac{1}{k}\sum_i \mu(i)\dfrac{k}{i}=\dfrac{\varphi(k)}k\\
    \therefore B(x,y)=-\sum_{k\ge 1}ln(1-A(x^k)y^k)\dfrac{\varphi(k)}{k}
\end{gathered}
$$

大功告成.

## 试看看

无标号荒漠计数

$1$

无标号海胆计数

$\mathrm{CYC}(\mathrm{SEQ}(x))$
