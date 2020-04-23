



# 重学 JavaScript | 词法，类型【learning notes】

## unicode

[unicode官网](https://home.unicode.org/)

[unicode参考网站](https://www.fileformat.info/info/unicode/) 

[unicode 维基百科](https://zh.wikipedia.org/zh-hans/Unicode)

[字符编码笔记：ASCII，Unicode 和 UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)



- [Blocks](https://www.fileformat.info/info/unicode/block/index.htm)

> - 0 ~ U+007F：常用拉丁字符
> - U+4E00 ~ U+9FFF：CJK Chinese Japanese Korean三合一
>   - 有一些增补区域（extension）
> - U+0000 - U+FFFF：[BMP]([https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%B9%B3%E9%9D%A2%E6%98%A0%E5%B0%84](https://zh.wikipedia.org/wiki/Unicode字符平面映射)) 基本平面

- [Categories](https://www.fileformat.info/info/unicode/category/index.htm)



```javascript
'厉'.codeCodeAt().toString(16)

String.fromCharCode()
```



## atom

### InputElement

#### WhiteSpace（空白）

> 可查阅 unicode [space列表](https://www.fileformat.info/info/unicode/category/Zs/list.htm)
>
> - Tab：制表符（打字机时代：制表时隔开数字很方便）
> - VT：纵向制表符
> - FF: FormFeed
> - SP: Space
> - NBSP: NO-BREAK SPACE（ 处理排版时，如果是普通的SP，会在一行放不下时，将它左右断开;<NBSP>它的左右不会断开）
> - ...

#### LineTerminator

> - LF: Line Feed `\n`
> - CR: Carriage Return `\r`
> - ...

#### Comment

```javascript
// 单行注释
/*
	 多行注释
*/
```

#### Token	

Punctuator

> 符号 比如 `> = < }` ，符号, 用于构成代码结构

IdentifierName

> - Keywords：比如 `await`、`break`... 不能用作变量名，但像 getter 里的 `get`就是个例外
>
> - 变量名：不能用 Keywords，不可与关键字重合, 特例: `get`, `undefined` 全局不可改变量名
> - 属性：可以用 Keywords

Literal

- NumericLiteral

- StringLiteral



### types

#### Number

>   IEEE 754 Double Float
>
> - Sign（1） 
> - Exponent（11） 
> - Fraction（52）

- Number Grammar

```javascript
// DecimalLiteral
0
0.
.2
1e3
1E3
```

```javascript
// BinaryIntegerLiteral
0b111
```

```javascript
// OctalIntegerLiteral
0o10
```

```javascript
// HexIntegerLiteral
0xFF
```

```javascript
0.toString();
0 .toString();
(97).toString(2)
```

- Number Practice

```javascript
Number.MAX_SAFE_INTEGER.toString(16)
"1fffffffffffff"
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
```

#### String

- Character
- Code Point
- Encoding

> ASCII
>
> Unicode
>
> UCS
>
> GB
>
> ​	• GB2312
>
> ​	• GBK(GB13000)
>
> ​	• GB18030
>
> ISO-8859
>
> BIG5

- String—Encoding

> * 存储方式: UTF8/UTF16
>   * UTF8 使用 8 位存储
>   * UTF16 使用 32 位存储
> * 引号内的特殊字符 `\'"bfnrtv`

- String Grammar

```javascript
"abc"
'abc’ 
`abc`
```

#### Boolean

#### Object

#### Null

#### Undefined

```javascript
function f(){
	var undefined = 1;
	console.log(undefined); // 可以在块级作用域中使用 undefined作为变量名
}
```

#### Symbol



# code summary

```javascript
'厉'.codeCodeAt().toString(16)

String.fromCharCode()

0.toString();
0 .toString();
(97).toString(2)

Number.MAX_SAFE_INTEGER.toString(16)
"1fffffffffffff"
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON

function f(){
	var undefined = 1;
	console.log(undefined); // 可以在块级作用域中使用 undefined作为变量名
}

parsInt(2)
```



# homework

## 写一个正则表达式 匹配所有 Number 直接量

- BinaryIntegerLiteral 

```javascript
/^0[bB][01]+$/
```

- OctalIntegerLiteral

```javascript
/^0[oO][0-7]+$/
```

- HexIntegerLiteral

```javascript
/^0[xX][0-9a-fA-F]+$/
```

- NumericLiteral 

```javascript
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$/
```



- Numeric Literals

```javascript
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/
```



## 写一个 UTF-8 Encoding 的函数

> 参考:
>
>  https://segmentfault.com/a/1190000005794963
>
> https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330

```javascript
function UTF8_Encoding(string){
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
/^([^"\\\n\r]|\\(u([0-9a-fA-F]{4}|\{(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}\})|x[0-9a-fA-F]{2}|0(?!=\d)|\r\n|[^\dxu])*$/u
/^([^'\\\n\r]|\\(u([0-9a-fA-F]{4}|\{(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}\})|x[0-9a-fA-F]{2}|0(?!=\d)|\r\n|[^\dxu])*$/u
```



- 讲师答案

```javascript
"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"
                              
'(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'
```



# learning summary

[study notes](#重学 JavaScript | 词法，类型[learning notes] )

## thinking

- 还需要通过查阅资料加深了解的内容：

> unicode
>
> 常见的编码 解码方式
>
> **正则表达式的正确熟练使用**



> 学习的知识点 要对内容拆分，归类，并各个击破。
>
> 做好思维导图 or 笔记 ，便于复习，而不依赖教学视频









