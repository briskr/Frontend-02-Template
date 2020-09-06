学习笔记

## LL 构建语法树

### 应用正则表达式实现词法分析

A.K.A. tokenize

- 定义允许出现的每个词法元素的 regexp 及名称
- 依次扫描输入内容，识别出遇到的每个 token 的类型和对应的原文的字符串
- 利用 generator 实现迭代器，异步实现逐个获取 token 信息对象

### LL 语法分析

```bnf
<Expression> ::=
  <AddExpression> "EOF"

<AddExpression> ::=
  <MultiExpression> |
  <AddExpression> "+" <MultiExpression> |
  <AddExpression> "-" <MultiExpression>
;

<MultiExpression> ::=
  <Number> |
  <MultiExpression> "*" <Number> |
  <MultiExpression> "/" <Number>
;
```

Left scan, Left reduce

- 根据产生式定义，对每个非终结语法元素定义一个函数
- 整个语法树的构建过程，是从词法分析得到的初始 token 序列起步，用语法的根元素对应的函数对这个序列执行分析，逐层归约(reduce)成语法节点(node)的树形结构
- 每个函数的运行流程总结
  - 一个函数负责逐个判断处理一个非终结语法元素的产生式的每个分支情况
  - Left scan - 从序列左端开始扫描
  - Left reduce - 每当序列左侧的若干节点序列成功匹配一个产生式分支，就将这些覆盖到的 token 或 node 归约进一个语法节点(node)，用这个 node 放进序列左端，替换这些 token 或 node
  - 匹配到的产生式中包含其他非终结元素时，函数实现中就要递归调用其他非终结语法元素对应的函数，直到遇到终结符结束递归
  - 本层各分支匹配完成，但序列后面尚有剩余节点，则递归调用可能出现的下一层非终结语法元素对应的函数进行分析

## 字符串算法

- 总体目录
  - 字典树 - 高重复度的存储与分析
  - KMP - 在长字符串里匹配子串模式 O(m+n)
  - Wildcard - 带通配符的字符串模式 O(m+n)
  - 正则
  - 有限状态机 - 比正则匹配可支持更多灵活处理
  - LL, LR - 多层级语法结构分析

之前用 stack 实现的 HTML 语法分析，相当于 LR(0)
LR(1) 的能力可以等效于 LL(n)

### 字典树

Trie 数据结构

- 对一组字符序列进行分析，根据每个字符后续可能出现的字符 set，构造一个树状数据结构
- 通过递归 visit 这个树，可以对所有实际出现的序列进行统计
- [代码](7-trie.html)

### KMP 子串匹配

- 暴力匹配算法 - source 中逐个字符作为起点，查找整个 pattern - 复杂度 O(n \* m)
- pattern 内部存在重复部分的情况下，部分匹配失败后可以回退到能够局部匹配的位置
- 查找 pattern 内部的局部重复: 逐个去掉首字符，看剩余部分头部是否存在与原字符串头部相同的片段
- 先根据 pattern 内容构造回退表 - 内容是在每个字符位置匹配失败时，应当跳转到的下标
- 实现要点见[代码](8-kmp.html)内的注释

### Wildcard 字符串匹配

- 前 n-1 个星号所匹配的原字符串内容应当尽量短；最后一个星号加上之后的部分匹配的内容应当位于原字符串的末尾
- 实现要点见[代码](9-wildcard.html)内的注释
