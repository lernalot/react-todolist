# react实现todolist 增删改查

> 实现需求：todolist实现增删改查；
> 实现思路：利用react，react做组件划分。因为用的是localstorage封装了数据库各个组件之间数据库不能同步，所以设计组件的思路是在父组件里进行增删改查后的渲染操作（setstate），父组件app下有增删改查操作，因此有四个子层级组件，考虑到刚开始做删除功能的时候对li有操作，所以把对li的操作（删除），ui样式的变动和渲染统一放在了删除todoitem组件里，因此该组件的功能就是对li执行删除操作，和一些事件处理，组件内容应该返回li和和删除按钮，但是li是一个数组，所以需要做一个循环去不停的渲染todoitem，所以设计一个父组件todomain，todomain的功能就是对数据执行map，map里循环渲染todoitem组件，同事把数组传给子组件todoitem，所以todomain应该是从app（app组件有增加组件传递的数据，并把该数组存到了数据库（localDb），所以要获取这个数组进行渲染）继承数据，因此设计思路：
![][image-1]
### 环境搭建工具：node.js,webpack,webpack-dev-server,babel编译jsx,es6

### 使用框架:react.js,localDb(封装的本地数据库),ant-design(ps:未使用jquery)

### 安装 gitclone 

[image-1]:	http://chuantu.biz/t5/43/1480562037x1019182426.jpg