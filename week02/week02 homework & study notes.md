

## 写一个正则表达式 匹配所有 Number 直接量

```javascript
// 整数
/^-?[1-9]+[0-9]*$/

// 浮点数
/^(-?\\d+)(\\.\\d+)?$/
  
// 二进制数
/^[01]+$/

// 八进制数
/^[0-7]+$/
  
// 十六进制数
/(^0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2}$)/

// Number字面量正则
/(^-?[1-9]+[0-9]*$)|(^(-?\\d+)(\\.\\d+)?$)|(^[01]+$)|(^[0-7]+$)|((^0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2}$))/
```





## 写一个 UTF-8 Encoding 的函数

Unicode符号范围 | UTF-8编码方式

| (十六进制)          | (十进制)      | （二进制）                          |
| ------------------- | ------------- | ----------------------------------- |
| 0000 0000-0000 007F | 0-127         | 0xxxxxxx                            |
| 0000 0080-0000 07FF | 128-2047      | 110xxxxx 10xxxxxx                   |
| 0000 0800-0000 FFFF | 2048-65535    | 1110xxxx 10xxxxxx 10xxxxxx          |
| 0001 0000-0010 FFFF | 65536-1114111 | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

UTF-8的编码规则：
   1）对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF-8编码和ASCII码是相同的。
   2）对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。x表示可用编码的位。

```javascript
function UTF8()
{
    this.encode = function (string) {
        var utftext = "";
        var byte = [];
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);//获取对应的unicode
            if (c < 128) {
                utftext += '\\x' + c.toString(16).toUpperCase();//单字节字符
                byte.push(c);
            }
            else {
                var byte_count = 2;
                if (c > 127 && c < 2048)
                    byte_count = 2;
                else if (c > 2047 && c < 65536)
                    byte_count = 3;
                else if (c > 65535 && c < 1114112)
                    byte_count = 4;
                else
                    return "编码失败！仅支持4位字节及以下的字符串编码！";


                var height_code = '';
                for (var j = 0; j < 8; j++) {
                    if (j < byte_count)
                        height_code += '1';
                    else
                        height_code += '0';
                }


                var d_code = parseInt(height_code, 2);
                for (var i = byte_count - 1; i > -1; i--)
                {
                    var bit = i * 6;
                    if (i == byte_count - 1) {
                        var code = ((c >> bit) | d_code);
                        utftext += '\\x' + code.toString(16).toUpperCase();//按位右移6位获取到需要与高8位11000000也就是192进行补位的位数，然后通过按位或运算进行补位
                        byte.push(code)
                    }
                    else {
                        //63的二进制数是00000000 00111111，通过按位与运算获取后6位需要与低8位10000000进行补位的位数，然后或运算补位
                        var code = (((c >> bit) & 63) | 128);
                        utftext += '\\x' + code.toString(16).toUpperCase();
                        byte.push(code);
                    }
                        
                }
            }
        }
        return utftext;
    }
```



## 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
/(^[\u4E00-\u9FA5A-Za-z0-9]+$ | (?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*/
```





## 学习总结

# Week2 总结

## 编程语言通识

### 1语言按照语法分类

- 非形式语言
	- 中文，英文...
- 形式语言（**乔姆斯基谱系**）
	- 0型 无限制文法 、递归可枚举语言 、图灵机
	- 1型 上下文相关文法
	- 2型 上下文无关文法
	- 3型 正则文法

### 2 产生式（BNF）

- 用尖括号括起来的名称表示语法结构名
- 语法结构分为基础构成和需要其他语法结构定义的复合结构
	- 基础结构称为终结符
	- 复合结构分为非终结符
- 引号和中间的字符表示终结符
- 可以有括号
- `*` 表示重复多次
- `|`表示或
- `+`表示至少一次

### 3 四则运算产生式

```
<Number> = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

<DecimalNumber> = "0" | (("1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") <Number>\* )

<PrimaryExpression> = <DecimalNumber> | "(" <LogicalExpression> ")"

<MultiplicativeExpression> = <PrimaryExpression> |
<MultiplicativeExpression> "\*" <PrimaryExpression>|
<MultiplicativeExpression> "/" <PrimaryExpression>

<AdditiveExpression> = <MultiplicativeExpression> |
<AdditiveExpression> "+" <MultiplicativeExpression>|
<AdditiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> = <AdditiveExpression> |
<LogicalExpression> "||" <AdditiveExpression> |
<LogicalExpression> "&&" <AdditiveExpression>
```

### 4 分类所知道的编程语言（都是图灵完备语言，没有什么高低之分）

- python 动态强类型 

- java 静态强类型
- JavaScript 动态弱类型

## 词法和类型

### Atom 词

### whiteSpace

可查阅 unicode [space列表](https://www.fileformat.info/info/unicode/category/Zs/list.htm)

- Tab：制表符（打字机时代：制表时隔开数字很方便）
- VT：纵向制表符
- FF: FormFeed
- SP: Space
- NBSP: NO-BREAK SPACE（和 SP 的区别在于不会断开、不会合并）
- ...

### LineTerminator 换行符

- LF: Line Feed `\n`
- CR: Carriage Return `\r`
- ...

### Comment 注释

### Token 记号：一切有效的东西

- Punctuator: 符号 比如 `> = < }`
- Keywords：比如 `await`、`break`... 不能用作变量名，但像 getter 里的 `get`就是个例外
  - Future reserved Keywords: `eum`
- IdentifierName：标识符，可以以字母、_ 或者 $ 开头，代码中用来标识**[变量](https://developer.mozilla.org/en-US/docs/Glossary/variable)、[函数](https://developer.mozilla.org/en-US/docs/Glossary/function)、或[属性](https://developer.mozilla.org/en-US/docs/Glossary/property)**的字符序列
  - 变量名：不能用 Keywords
  - 属性：可以用 Keywords
- Literal: 直接量
  - Number
    - 存储 Uint8Array、Float64Array
    - 各种进制的写法
      - 二进制0b
      - 八进制0o
      - 十进制0x
    - 实践
      - 比较浮点是否相等：Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
      - 如何快捷查看一个数字的二进制：(97).toString(2)
  - String
    - Character
    - Code Point
    - Encoding
      - Unicode编码 - UTF
        - utf-8 可变长度 （控制位的用处）
    - Grammar
      - `''`、`""`、``` `
  - Boolean
  - Null
  - Undefined