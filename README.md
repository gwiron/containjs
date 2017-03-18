# Containjs 1.0

## Containjs 是什么？
Containjs 是一个基于 Commonjs 模块管理规范的 * 浏览器端 * 的 JavaScript 模块加载器（目前为非标准的，代码会持续迭代，现阶段主要提供思路，想集结各路 js 大神一同完善）

## Containjs 使用
### 获取 Containjs
去 gitHub [下载](https://github.com/gwiron/containjs/tree/master/js/lib) 页面下载文件。

### 目录结构
Containjs 目前的目录结构非常简单，项目中 JavaScript 都放在一个 "js" 目录。 例如, 你的项目中有一个 index.html 页面和一些 js 文件
├─index.html            项目html所在目录为主目录
├─js/                 项目js目录
├─├─lib/              项目类库目录 // 非必须
├─├─└─contain.js      contain.js框架文件 // 也可以放在其他目录，只需引入即可 
├─├─a.js
├─├─b.js
│ └─app.js            项目的入口文件

### 开始使用
在你的应用中包含 Contain.js 文件，并且使用服务器环境打开（本地服务器即可）
```
// index.html
<script src="js/lib/Contain.js"></script>
```
* 然后在 js/app.js 入口文件中开始编写你的应用代码，*
Ps：需要注意的是，js/app.js 为默认入口文件，暂时未支持修改


## Containjs 模块使用教程，像写 node 一样写浏览器端代码即可

Ps：如果您已经对于，Commonjs规范有所了解，则不需要看此教程

### 模块依赖
Containjs 的模块依赖非常简单，使用 require(url) 函数直接引入即可
```
var a = require('a.js')
```
Ps：需要注意的是，在 Containjs 中，url 需要纯静态的字符串，* 不支持使用表达式或者变量 *

### 模块定义
Containjs 的模块定义非常简单，满足 commonjs 模仿，以一个文件一个模块的形式，暴露接口的方式也符合 commonjs 规定
```
//a.js
var name = 'a.js'

var getName = function() {
	console.log(name)
}

// 使用模块中的全局变量 exports 提供对外接口
exports.getName = getName

// 或者也可以这样
module.exports.getName = getName
```
## 使用 Containjs 常见问题解答
#### 为什么 index.html 页面必须使用服务器环境打开，例如：127.0.0.1/index.html 打开
答：原因是 containjs 所以的文件均有 ajax 异步加载

#### 为什么 require(url) 中的 url 不可以是变量或者表达式。只能是单纯字符串
答：原因是 Containjs 模块中所依赖文件均是使用* 异步提前加载，同步 require 时调用执行 *，而异步提前加载的原理是，使用正则表达式去匹配出需要调用的模块的，如果使用表达式则会导致无法正确匹配结果导致程序错误
* Ps：需要注意的是，在目前的版本中，请不要在注释中出现，require(url)，因为这样也会对此模块进行加载，如果本模块这本应用中不需要使用则会导致，浪费的加载 *

#### 如果我在本应用中多次 require 某个模块会不会导致请求数太多？
答：在 containjs 中，任何模块，只要* 路径相同 *只会进行加载一次，加载完成后进行执行上下文的生产(context 但是不会执行)，然后存在模块的 module.context 中
且在 containjs 中，require 在多次调用过某一模块过程中，只会进行一次生产模块接口，之后会缓存在 moudule.exports 中，与 node 中不同的是，node 直接返回 module.exports 的引用，而 containjs 则是使用 module.exports 的继承的引用，且每一次调用生产一个新的继承对象，这样带来的好处是，一个应用中只会生产一次本模块的接口，也不必担心被别处修改接口内容