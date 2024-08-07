---
title: 杂记
subtitle: ...
layout: post
show: true
top: false
tags: 
- note
---

## 记录奇怪的思考

- 存在确定结果的游戏等价于决策透明, 于是可以等价于一个人提出一个策略另一方对着你的策略卡.

## 记录代码细节错误

- noip2022 旅行: 手动实现矩阵乘法`*=`, 注意顺序, 可能要用旧的值更新而旧的被变了.
- csp2022 假期计划: 取max的初始值应设为-inf而不是0
- csp2021 回文: 函数没有返回值, dev默认值为true(? )
- P7916 区间dp时若转移到长度偶数则答案错的, 没有判
- P7077 初始化问题
- P7116 拉插次数没想清楚就往上试到不变化, 同时注意数组开小了
- P5666 线段树合并怎么会有人想到写 $x&y==0$ 判断是否有一个是空? /fn, 动态开点编号多测没清空/fn
- P5021 multiset erase(iter)会删除一个元素, erase(value)会删除所有等于这个值的元素.
- P4606 圆方树点数最大是图的两倍, 点双弹栈连放点时不是"删到栈顶为 $u$"而是"直到把 $v$ 删掉"(指处理 $u\to v$ 这条边)
- nfls vector, deque pushback后迭代器失效(重新分配空间)
- 写ODT, 不能有split返回set insert返回值的两个指针做端点, 因为分裂后一个端点的时候可能删前面的
- 满秩矩阵高斯消元也必须每次找一个非0行换上来.
- 用虚树统计答案注意区分作为原来点lca新增的点
- 错误的淀粉质深度有 $2$ 倍常数.
 
### vector扩容和求值顺序

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<array<int, 2>> nxt;
int tot;
int newnode() {
    ++tot;
    nxt.resize(tot);
    return tot - 1;
}
signed main() {
    newnode();
    nxt[0][0] = newnode(); //!
    return 0;
}
```

会RE, 为什么呢? 因为c++14及以前没有规定等号两边求值顺序, 所以对叹号处代码, 先获取`nxt[0][0]`的地址, 再调用`newnode()`使得`nxt`地址失效了! .

同理见[yaoxi的blog](https://www.cnblogs.com/yaoxi-std/p/17023579.html)