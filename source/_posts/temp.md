# CF1852B Imbalanced Arrays

给一个不需要递归构造的新方法()

> 对于一个给定的长度为 $n$ 的数组 $A$, 定义一个长度为 $n$ 的数组 $B$ 是不平衡的当且仅当以下全部条件满足:
> 
> - $-n \leq B_{i} \leq n$ 且 $B_{i} \ne 0$. 即每个数在 $[-n, n]$ 内且不为 $0$.
> 
> - $\forall i, j \in [1, n], B_{i} + B_{j} \neq 0$. 即数组内不存在一对相反数.
> 
> - $\forall i \in [1, n], \sum_{j = 1}^{n} [ \left (B_{i} + B_{j} \right) > 0] = A_{i}$. 即对于任意的 $i$, 数组中与 $B_{i}$ 和大于 $0$ 的数的个数恰好为 $A_{i}$. **注意: 这里需要计算本身. 也即 $i$ 与 $j$ 可以相等. **
> 
> 请构造长度为 $n$ 的不平衡序列.

$b_i$ 要满足 $b_j>-b_i$ 的有恰好 $a_i$ 个, 那么显然 $a_i$ 越大, $-b_i$ 就要越小, 于是得到结论若 $a_i<a_j$, 则 $b_i<b_j$. 对于相等的 $a_i$ 显然可以随意钦定顺序.

因为有了 $b$ 的顺序, 可以确定每个 $a_i$ 的 $-b_i\in [b_{n-a_i}, b_{n-a_i+1}]$, 属于同一个区间的 $-b_i$ 又因为已知 $b_i$ 的大小关系而可以确定, 于是我们得到了一条包含 $b_i$ 和 $-b_i$ 的大小关系的长 $2n$ 的不等式链, 因为一共只有 $2n$ 个数, 只要从小到大对应赋值, 然后判定是否对应位置为相反数即可.

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
#define endl '\n'
using namespace std;
typedef long long ll;
const int N = 1e5 + 500;
int n;
struct P {
    int i, v;
} a[N];
bool cmp(P a, P b) {
    return a.v < b.v;
}
bool cmp2(P a, P b) {
    return a.i < b.i;
}
vector<int> bsep[N];
int bs[N * 2];
P b[N];
void solve() {
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i].v;
        a[i].i = i;
    }
    sort(a + 1, a + 1 + n, cmp);
    for (int i = 1; i <= n; i++) {
        bsep[n - a[i].v].push_back(i);
    }
    int p = 0;
    for (int i = 0; i <= n; i++) {
        if (i > 0)
            bs[++p] = i;
        sort(bsep[i].begin(), bsep[i].end(), greater<int>());
        for (int v : bsep[i]) {
            bs[++p] = -v;
        }
        bsep[i].clear();
    }
    int bcnt = 0;
    for (int i = 1; i <= p; i++) {
        if (bs[i] != -bs[2 * n - i + 1]) {
            cout << "NO" << endl;
            return;
        }
        if (bs[i] > 0)
            b[++bcnt].v = i > n ? i - n : -(n - i + 1);
    }
    for (int i = 1; i <= n; i++)
        b[i].i = a[i].i;
    sort(b + 1, b + 1 + n, cmp2);
    cout << "YES" << endl;
    for (int i = 1; i <= n; i++) {
        cout << b[i].v << " ";
    }
    cout << endl;
}

int main() {
    ios::sync_with_stdio(false);
    int t;
    cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}
```