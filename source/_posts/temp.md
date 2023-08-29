# CF1854E Game Bundles爆搜题解

> 给定一个正整数 $m\le 10^{10}$，请你构造一个数组 $a$，长度为 $k$，满足 $\forall 1\le i\le k\le 60,1\le a_i\le 60$，且恰好存在 $m$ 个集合 $S\subset\{1,2,\dots,k\}$，$\sum\limits_{i\in S}a_i=60$ 。

因为子集和非常多，能看出可能的解应该非常多，而这个问题看上去很没有靠谱的做法，考虑乱搞。

于是想到我放 $x$ 个 $1$，再放若干个小于 $60-x$ 的数，这样贡献只能由 $1$ 和一个其他数产生，也就是用 $\binom{x}{i}$ 去凑 $m$，于是从小到大枚举 $x$，爆搜剩下的数，加上朴素的可行性最优性剪枝，发现 testcase 46 搜不出来。问题基本上是，假设用了大量的 $1$，那么搜到细节处时微调的能力就很弱了，因为一调就至少动 $x-1$，导致会和 $m$ 很接近但差一点点，

于是再加上 $2$，放 $x$ 个 $1$ 和 $2$ 满足它们的和小于 $60$，dp算出 $f_i$ 表示用 $1，2$ 凑出 $i$ 的方案数，但是枚举 $1，2$ 太慢了，直接枚举总数 $x$，随一个 $2$ 的个数，可以搜出只有 $1$ 的部分。但仍然会TLE。

最后想到，从小往大枚举 $x$ 是很劣的，因为刚刚可行(存在一种方案大于 $m$ )的部分在 $m$ 附近的解的数量比较少，所以改成从大到小枚举 $x$，通过。

```cpp
#include <algorithm>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <map>
#include <vector>
#define int long long
#define endl '\n'
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;

const int N = 10010, M = 10000;
int arr[100];
map<ll, int> st;
bool done = false;
ll f[100], d[100];
int tcnt, mx;

void dfs(int i, ll s, int k, int li) {
    if (done)
        return;
    if (s > f[d[li]] * (60 - k - i))
        return;
    if (s == 0) {
        cout << i + k - 1 << endl;
        for (int j = 1; j < i; j++)
            cout << arr[j] << " ";
        for (int j = 1; j <= k - tcnt; j++)
            cout << 1 << " ";
        for (int j = 1; j <= tcnt; j++)
            cout << 2 << " ";
        cout << endl;
        done = true;
    }
    if (i >= 60 - k)
        return;
    for (int j = li; j >= 0; j--) {
        arr[i] = 60 - d[j];
        ll ns = s - f[d[j]];
        if (ns == s || ns < 0 || st.count(ns) && st[ns] <= i)
            continue;
        st[ns] = i;
        dfs(i + 1, ns, k, j);
    }
}
bool cmp(int a, int b) {
    return f[a] < f[b];
}
ll bino[100][100];
ll binom(int n, int k) {
    if (k > n)
        return 0;
    return bino[n][k];
}
signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ll m;
    cin >> m;
    for (int i = 0; i <= 60; i++) {
        for (int j = 0; j <= 60; j++) {
            if (j == 0) {
                bino[i][j] = 1;
                continue;
            }
            if (i == 0) {
                bino[i][j] = 0;
                continue;
            }
            bino[i][j] = bino[i - 1][j] + bino[i - 1][j - 1];
            if (bino[i][j] > m)
                bino[i][j] = m + 1;
        }
    }
    for (int i = 60; i >= 1; i--) {
        for (int _ = 1; _ <= 10; _++) {
            int j = rand() % i;
            if (i + j > 60)
                continue;
            f[0] = 1;
            memset(d, 0, sizeof(d));
            mx = 0;
            int dcnt = 0;
            for (int k = 1; k < 60 - i - j; k++) {
                __int128 x = 0;
                for (int l = 0; l <= min(k / 2, j); l++) {
                    x = x + (__int128)binom(j, l) * binom(i - j, k - 2 * l);
                }
                f[k] = (x > m ? m + 1 : x);
                mx = max(mx, f[k]);
                if (f[k])
                    d[k] = k, dcnt = k;
            }
            sort(d + 1, d + 1 + dcnt, cmp);
            tcnt = j;
            if (mx * (60 - i) < m)
                continue;
            dfs(1, m, i, dcnt);
            if (done)
                return 0;
            st.clear();
        }
    }
    return 0;
}
```