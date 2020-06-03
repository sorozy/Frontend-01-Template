
/**
 * 
 * 参考（抄袭了）3班 王婧锦 同学的作业
 * https://github.com/nikukeke/Frontend-01-Template/tree/master/week08
 */

function match(element, selector) {
    // 如果是复合选择器还要用正则拆一下，或者用状态机把它拆开
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if (attr && attr.value === selector.replace("#", '')) { 
            return true;
        }
    } else if (selector.charAt(0) == ".") {
        var attr = element.attributes.filter(attr => attr.name === "class")[0]
        // 实现复合选择器，实现支持空格的形式把class补全
        if (attr && attr.value === selector.replace(".", '')) { 
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for(var part of selectorParts) {
        if(part.charAt(0) == "#") {
            p[1] += 1;
        } else if(part.charAt(0) == ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if(sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    } 
    if(sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if(sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}

function compteCSS(element) {
    // console.log(rules);
    // console.log("compute CSS for Element", element);
    // 00:34
    var elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }
    // 获取父元素序列
    // 1、入栈的时候，push的时候加上parent，逐级寻找
    // 2、从栈中取父元素
    // slice如果都不传参数，那么就是复制一份

    // body .a #good 复杂选择器    
    // body .a #good, body .a #bad 带逗号的，选择器列表
    for (let rule of rules) {
        // selector字符串的形式，为了保持跟element的顺序，所以做了个reverse
        var selectorParts = rule.selectors[0].split(" ").reverse();
        // 行内样式已经在element里了
        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;
        var j = 1;
        // 同时循环element和selector看两者匹不匹配
        // 行内元素最好处理，因为已经在element里了
        for (var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            // 如果匹配到，我们要加入
            // console.log("Element", element, "matched rule", rule);

            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    // for(var k = 0; k < 4; k++) {
                    //     computedStyle[declaration.property][declaration.value][k] += sp[k]
                    // }
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
            }
            // console.log(element.computedStyle);
        }
    }

    // let inlineStyle = element.attributes.filter(p => p.name == "style");
    // css.parse("* {"+inlineStyle+"}")
    // sp= [1, 0, 0, 0]

}
function emit(token) {
    // console.log(token)
    let top = stack[stack.length - 1];
    if (token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };


        element.tagName = token.tagName;
        for (let p in token) {
            if (p != "type" || p != "tagName") {
                // if (p != "type" && p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }
        // 创建元素把属性和名称都加好之后
        // 计算css的话，我们想它尽可能的早(有一些结构有一个很大的副标签，所以不可取)
        // 所以每个元素刷出来应该进行cpmpteCSS计算
        compteCSS(element);

        top.children.push(element);
        // element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type == "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            // ++++++++++++++ 遇到style标签时，执行添加CSS规则的操作 +++++++++
            // 入栈的top一定是element
            // 为什么要在pop阶段去执行css的收集，因为你在push的时候,style标签的子元素
            // 也就是文本节点，还没有挂到style标签上，这时候style标签子元素会是空的
            // 如果我们在pop之前处理，就能取到它的children

            // 检查top是否是style标签，如果是style标签，那我们进行css收集
            if (top.tagName === "style") {
                addCSSRules(top.children[0].content);
            }
            // 为什么layout要加在结束标签的位置？
            // 因为我们需要拿到它的子元素，才能对他进行layout
            // 其实也是一种简化的方法，实际上要根据属性判断不同的阶段
            layout(top);
            stack.pop();
            
        }
        currentTextNode = null;
    }
    else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}



// 首页的6个 data tagOpen endTagOpen tagName beforeAttributeName selfClosingStartTag
function data(c) { // 开始标签 结束标签 自封闭标签 （注释暂且不论
    if (c == "<") {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: "EOF"
        })
        return;
    } else {
        emit({
            type: "text",
            content: c
        });
        return data;
    }
}

function tagOpen(c) {
    if (c == "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    } else {
        emit({
            type: "text",
            content: c
        })
        return;
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) { // 空格
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(/^[A-Z]$/)) {
        currentToken.tagName += c; // .toLowerCase();
        return tagName;
    } else if (c == ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) { // 处理属性
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {

    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return beforeAttributeValue;
    } else if (c == "\"") {
        return doubleQuoteAttributeValue;
    } else if (c == "\'") {
        return singleQuoteAttributeValue;
    } else if (c == ">") {
        return data;
    } else {
        return UnquoteAtteibuteValue(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == "\"" || c == "'" || c == "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function doubleQuoteAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == "\"" || c == "'" || c == "<") {

    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function singleQuoteAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        // return singleQuoteAttributeValue;
        return doubleQuoteAttributeValue;
    }
}

function afterQuoteAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function UnquoteAtteibuteValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == "\u0000") {

    } else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return UnquoteAtteibuteValue;
    }
}

function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == "EOF") {

    } else {

    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    } else if (c == ">") {

    } else if (c == EOF) {

    } else {

    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(c);
    }
}

module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    // console.log(html);
    // console.log(stack[0]);
    return stack[0];
    // document.getElementsByTagName('html')[0].parentNode
    // 这样的话取stack[0]就可以把整个树拿出来
}