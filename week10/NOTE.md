# 每周总结可以写在这里

## Range API

```
var range = new Range()
range.setStart(element, 9)
range.setEnd(element, 4)
var range = document.getSelection().getRangeAt(0)
```

- API(辅助)
  - range.setStartBefore
  - range.setEndBefore
  - range.setStartAfter
  - range.setEndAfter
  - range.selectNode
  - range.selectNdoeContents
  - range.extractContents()
  - range.insertNode

## CSS Dom

> ```
> document.styleSheets
> ```

- styleSheets
- CssStyleSheets
  - cssRules
  - insertRule
  - removeRule

### Rule

- CssStyleRule

### getComputedStyle

- getComputedStyle
  - window.getComputedStyle(elt, pesudoEit)
    - el 想要获取的元素
    - pseudoElt 可选，伪元素

## window Handle

通过`window.open`打开的子window，父级window可以操作它

### scroll

- scrollBy
- scrollTo
- scrollHeight
- scrollTop
- scrollLeft
- ……

### getClientRects

### getBoundingClientRect