## react实现todolist 增删改查

> 实现需求：todolist实现增删改查；
> 实现思路：react组件划分。因为用的是localstorage封装了数据库各个组件之间数据库不能同步，所以设计组件的思路是在父组件里进行增删改查后的渲染操作（setstate），父组件app下有增删改查操作，因此有四个子层级组件，考虑到刚开始做删除功能的时候对li有操作，所以把对li的操作（删除），ui样式的变动和渲染统一放在了删除todoitem组件里，因此该组件的功能就是对li执行删除操作，和一些事件处理，组件内容应该返回li和和删除按钮，但是li是一个数组，所以需要做一个循环去不停的渲染todoitem，所以设计一个父组件todomain，todomain的功能就是对数据执行map，map里循环渲染todoitem组件，同事把数组传给子组件todoitem，所以todomain应该是从app（app组件有增加组件传递的数据，并把该数组存到了数据库（localDb），所以要获取这个数组进行渲染）继承数据，因此设计思路如图：



#### 环境搭建工具：node.js,webpack,webpack-dev-server,babel编译jsx,es6

#### 使用框架:react.js,localDb(利用localstorage机制封装的本地数据库),ant-design。(ps:未使用jquery)

#### 安装 gitclone   git@github.com:lernalot/react-todolist-.git ，npm install，注意node-modules里一定要有localDb文件夹。

### 组件分析
- app.js，首先看底部render的子组件：
	render(){
		return (
		<Card className="pannel">
		<TodoHeader addTodo={this.addTodo.bind(this)} todos={this.state.todos} showAll={this.showAll.bind(this)} />
		<TodoQuery ref="query" todos={this.state.todos} queryList={this.queryList.bind(this)} />
		<TodoMain todos={this.state.todos}  changeTodoState={this.changeTodoState.bind(this)} deleteTodo={this.deleteTodo.bind(this)} reviseTodo={this.reviseTodo.bind(this)}/>
		<TodoRevise ref="modal" todos={this.state.todos} closeDialog={this.closeDialog.bind(this)} reviseContent={this.reviseContent.bind(this)}/>
		</Card>
		)
		}
1. 其中card是从antd引入的一个api，antd是一个view层的框架，提供了一些ui组件可以使用。
2. 引入的组件分别为增加组件，查询组件，渲染组件（子组件删除），修改组件。
-  接下来看增加的渲染操作addTodo方法
	```addTodo(todoItem){
		if(!this.db.get('todos')){
		   this.db.set('todos',[]);
		}        
		this.state.todos.unshift(todoItem);
		if(this.state.todos.length != this.db.get('todos').length){
		this.db.get('todos').unshift(todoItem);
		}
		this.db.set('todos',this.db.get('todos'));
		this.setState({
		todos:this.db.get('todos')
		});
		message.config({
		top:48,
		duration:1
		});
		message.success('增加成功！');
		}
	```
1. 从代码可以看出this.db代表数据库的操作，set保存，get取值，todoItem是从增加组件传过来的input的值，这里负责入栈操作，并把最新的数组渲染出来。

- 删除操作deleteTodo
	deleteTodo(timeId){
		let i =0;
		for(i=0;i<this.db.get('todos').length;i++){
		if(this.db.get('todos')[i].timeId == timeId){
		this.db.get('todos').splice(i,1);
		}
		}
		this.state.todos.map((todo,index) => {
		console.log(todo);
		if(todo.timeId == timeId){
		this.state.todos.splice(index,1);
		}
		});
		this.setState({todos:this.state.todos});
		this.db.set('todos',this.db.get('todos'));
		message.config({
		top:48,
		duration:1
		});
		message.success('删除成功！');
		}
1. timeId是每一个li生成的时间戳，他是唯一的，删除组件传过来时间戳之后，遍历数据库，找到li，数组删除这个元素。
2. 值得注意的，这里相比增加方法的setState，这里渲染的是this.state.todos，而不是对数据库的渲染，主要是考虑到查询之后当前list有可能为一部分的数组，用户希望是在当前查询到的list删除和显示，所以就渲染了this.state.todos，但之后对数据库进行删除操作，才是真正的对数据做了修改。