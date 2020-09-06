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
- 从词法分析得到的 token 序列起步，通过这些函数处理，逐步归约(reduce)成语法元素
- 每个函数的运行流程总结
  - 一个函数负责逐个判断处理一个非终结元素的产生式的每个分支情况
  - Left scan - 从序列左端开始扫描
  - Left reduce - 每当序列左侧的若干节点序列成功匹配一个产生式分支，就将这些覆盖到的 token 或 node 归约进一个语法节点(node)，用这个 node 放进序列左端，替换这些 token 或 node
  - 匹配到的产生式中包含其他非终结元素时，函数实现中就要递归调用其他元素对应的函数，直到遇到终结符为止结束递归
  - 各分支匹配完成，但序列后面尚有剩余节点，则递归调用可能出现的下一级非终结元素对应的函数进行分析
- 整个语法树的构建，是从根元素对应的函数开始，对词法分析完成后得到的初始 token 序列开始执行分析

## 字符串算法
