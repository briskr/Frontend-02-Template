# 四则运算表达式的 BNF 定义

## 不带括号版本

```
<MultiExpression> ::=
    <MultiExpression> "*" <Number> |
    <MultiExpression> "/" <Number> |
    <Number>
;

<AddExpression> ::=
    <AddExpression> "+" <MultiExpression> |
    <AddExpression> "-" <MultiExpression> |
    <MultiExpression>
;
```

## 带括号版本

练习：编写带括号的四则运算产生式

实现说明：

- 操作数仅限非负整数；
- 括号仅用于加法表达式提升优先级，例如`(1+2)*3` ，不支持 `(1*2)+3`

```
<AddExpression> ::=
    <AddExpression> "+" <MultiExpression> |
    <AddExpression> "-" <MultiExpression> |
    <MultiExpression>

<MultiExpression> ::=
    <MultiExpression> "*" <ParenBlockOrNumber> |
    <MultiExpression> "/" <ParenBlockOrNumber> |
    <ParenBlockOrNumber>
;

<ParenBlockOrNumber> ::=
    "(" <AddExpression> ")" |
    <Number>
;

<Number> ::= <Digit> +
;

<Digit> ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
;


```
