## react实现todolist 增删改查

> 实现需求：todolist实现增删改查；

> 实现思路：react组件划分。因为用的是localstorage封装了数据库各个组件之间数据库不能同步，所以设计组件的思路是在父组件里进行增删改查后的渲染操作（setstate），父组件app下有增删改查操作，因此有四个子层级组件，考虑到刚开始做删除功能的时候对li有操作，所以把对li的操作（删除），ui样式的变动和渲染统一放在了删除todoitem组件里，因此该组件的功能就是对li执行删除操作，和一些事件处理，组件内容应该返回li和和删除按钮，但是li是一个数组，所以需要做一个循环去不停的渲染todoitem，所以设计一个父组件todomain，todomain的功能就是对数据执行map，map里循环渲染todoitem组件，同事把数组传给子组件todoitem，所以todomain应该是从app（app组件有增加组件传递的数据，并把该数组存到了数据库（localDb），所以要获取这个数组进行渲染）继承数据，因此设计思路如图：



#### 环境搭建工具：node.js,webpack,webpack-dev-server,babel编译jsx,es6

#### 使用框架:react.js,localDb(利用localstorage机制封装的本地数据库),ant-design。(ps:未使用jquery)

#### 安装 gitclone   git@github.com:lernalot/react-todolist-.git ，npm install，注意node-modules里一定要有localDb文件夹。

### 组件分析
- app.js，首先看底部render的子组件：

	```javascript
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
	```
1. 其中card是从antd引入的一个api，antd是一个view层的框架，提供了一些ui组件可以使用。
2. 引入的组件分别为增加组件，查询组件，渲染组件（子组件删除），修改组件。
-  接下来看增加的渲染操作addTodo方法


	```javascript
	addTodo(todoItem){
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

	```javascript
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
	```
1. timeId是每一个li生成的时间戳，他是唯一的，删除组件传过来时间戳之后，遍历数据库，找到li，数组删除这个元素。
2. 值得注意的，这里相比增加方法的setState，这里渲染的是this.state.todos，而不是对数据库的渲染，主要是考虑到查询之后当前list有可能为一部分的数组，用户希望是在当前查询到的list删除和显示，所以就渲染了this.state.todos，但之后对数据库进行删除操作，才是真正的对数据做了修改。
- 修改方法：
	```javascript
- 	reviseContent(todo,index,timeId,lastReviseTime){
		let reviseIndex = Number(index)-1;
		let reviseObject = {text:todo,index:reviseIndex,timeId:timeId};
		let i;
		message.config({
			top:48,
			duration:1
		});
		this.state.todos.splice(reviseIndex,1,reviseObject);
		this.setState({todos: this.state.todos});
		for(i=0;i<this.db.get('todos').length;i++){
			if(this.db.get('todos')[i].timeId == timeId){
				this.db.get('todos')[i] = reviseObject;
				this.state.todos[i].lastReviseTime = lastReviseTime;
			}
		}
		this.db.set('todos', this.db.get('todos'));
		this.refs.modal.setState({
		  visible: false,
		});
		// message.success('修改成功！');
		document.getElementById('reviseinput').value = '';
	}
	```

1. 修改方法也是从数据库找到指定的数据，数据库修改之后，显示当前this.state.todos。
2. 这里的lastReviseTime是最后一次修改时间，通过修改组件传入。


- 查询方法queryList：

```javascript
- queryList(queryArr){
        message.config({
            top:48,
            duration:1
        });
        if(this.state.todos.length == this.db.get('todos').length && queryArr.length == 0){
            message.warning('查询内容不存在');
            return;
        }
        if(queryArr.length == 0){
            message.warning('当前list不存在查询内容，已为您转到全部list');
            this.setState({
                todos:this.db.get('todos')
            });
        }else{
                this.setState({
                todos:queryArr
            });
        }     
    }
``` 

1. queryArr是查询后得到的数组，通过查询组件传过来，查询的基本原理就是从当前list遍历（因为可能存在查询之后再查询操作，再查询的时候，app对数据库做了修改，但TodoQuery的数据库信息不会实时同步，但是this.state.todos会同步，所以根据当前list做查询，如果当前list查不到内容而且list长度和数据库长度不同，就重新渲染一遍this.state.todos，然后让用户再查询），查询思想就是判断查询的str是否出现在数组的元素里，通过indexOf方法判断索引是否大于-1即可。
###TodoMain组件：
```javascript
- return (
        <ul className="todo-list">
            {this.props.todos.map((todo, index) => {
                //return <li style={listStyle}>{this.props.todos[index].text}</li>
                return <TodoItem key={index} text={todo.text} isDone={todo.isDone} lastReviseTime={todo.lastReviseTime} timeId={todo.timeId} index={index} {...this.props} />
                //return <TodoItem key={index} {...todo} index={index} {...this.props}/>
                //map对数组进行了遍历，todo表示每一个数组元素text，index代表索引，所以让todoitem渲染的过程是一个循环的渲染过程，每次渲染不一样，是动态组件渲染
                //作为动态组件，需要一个key，每次渲染的时候key不同，才会显示不同的渲染，是一个表示的渲染
            })}
        </ul>
    )
    ```

1. 使用map对数据进行遍历渲染，注意spread操作符，{…todo},{...props},spread操作符把props，todos的属性和方法传递到子组件TodoItem。
2. 这里是一个循环，所以return的TodoItem组件是一个动态组件，根据react组件的动态机制，需要在todoItem组件里设置一个key，并要保证每次key的值都不一样，也就是渲染的列表的，渲染是对this.state.todos的渲染，列表每一项都有不同的index，所以取值key={index}。
###TodoItem组件

```javascript
- export default class TodoItem extends React.Component{
	    constructor(){
	        super();
	        this.state = {
	            checkAll:false
	        }
	    }
	
	    // 鼠标移入
	    handlerMouseOver(){
	        ReactDom.findDOMNode(this.refs.deleteBtn).style.display = "inline";
	        ReactDom.findDOMNode(this.refs.changeBtn).style.display = "inline";
	    }
	
	    // 鼠标移出
	    handlerMouseOut(){
	        ReactDom.findDOMNode(this.refs.deleteBtn).style.display = "none";
	        ReactDom.findDOMNode(this.refs.changeBtn).style.display = "none";
	    }
	
	    // 删除当前任务
	    handlerDelete(){
	        this.props.deleteTodo(this.props.timeId);
	        console.log(this.props.timeId);
	    }
	    reviseTodo(){
	        this.props.reviseTodo(this.props.text,this.props.index,this.props.timeId);
	    }
	
	    render(){
	        let doneStyle = this.props.isDone ? {color: 'red'} : {color: '#57c5f7'};
	
	        return (
	            <li
	                onMouseOver={this.handlerMouseOver.bind(this)}
	                onMouseOut={this.handlerMouseOut.bind(this)}
	                ref='checkList'
	            >
	                <span style={doneStyle} className="listContent">{this.props.text}</span>
	                <Button ref="deleteBtn" onClick={this.handlerDelete.bind(this)} style={{'display': 'none'}} className="fr libtn-height">删除</Button>
	                <Button ref="changeBtn" style={{'display': 'none'}} className="change libtn-height" onClick={this.reviseTodo.bind(this)}>修改</Button>
	                <span className='product-time'>创建时间：{this.props.timeId}</span><span className='revise-time'>最后修改时间：{this.props.lastReviseTime}</span>
	            </li>
	        )
	    }
	}
```


1. React.findDOMNode(this)可以获取当前这个组件标签。
2. 在元素中定义ref=xxx属性，就可以通过React.findDOMNode(this.refs.xxx)获取到这个元素。
3. 给元素定义class类名的时候要使用className，这里最后修改时间是从修改组件传过来的，TodoItem和TodoRevise没有通信关系，TodoRevise把数据传到app，然后下发到TodoItem显示。（是否有其他方式解决互不相干（兄弟节点或者其他）的组件之间的通信关系？）
###TodoRevise组件

```javascript
- class TodoRevise extends React.Component {
	    constructor(){
	        super();
	        this.state={
	            visible: false
	        };
	    }
	    // 绑定键盘回车事件，添加新任务
	    showModal(todo,index,timeId) {
	        this.setState({
	          visible: true,
	          reviseList: todo,
	          reviseIndex:index*1+1,
	          reviseTimeId:timeId
	        });
	    }
	    handleOk() {
	        let newList = document.getElementById('reviseinput').value;
	        let lastReviseTime = new Date().getTime();
	        this.state.reviseList = newList;
	        this.props.reviseContent(this.state.reviseList,this.state.reviseIndex,this.state.reviseTimeId,lastReviseTime);
	    }
	    handleCancel() {
	        this.props.closeDialog();
	    }
	    copyList(){
	        document.getElementById('reviseinput').value = this.state.reviseList;
	    }
	    keyComplete(event){
	        let lastReviseTime = new Date().getTime();
	        if(event.keyCode == 13){
	            let newList = document.getElementById('reviseinput').value;
	            this.state.reviseList = newList;
	            this.props.reviseContent(this.state.reviseList,this.state.reviseIndex,this.state.reviseTimeId,lastReviseTime);
	        }
	    }
	
	    render() {
	        return (
	          <div>
	            <Modal title="修改列表内容" visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
	              <div>您正在修改第{this.state.reviseIndex}条，修改内容为<p className="revise_content" onClick={this.copyList.bind(this)}>{this.state.reviseList}</p></div>
	              <p>在下面输入框中对原内容进行修改(支持回车键保存)</p>
	              <Input type="text" id="reviseinput" placeholder="点击蓝色字体将内容复制到输入框" onKeyUp={this.keyComplete.bind(this)}></Input>
	            </Modal>
	          </div>
	        )
	    }
	}
	export default TodoRevise;
	```

	
1. 这里modal是ant-design的一个组件，自带了handOk，show modal，handleCancel方法，修改的显示隐藏就是通过更改this,state.visible(boolean)来决定的，监听确定按钮点击事件和回车键输入事件来执行把修改的对象传给app进行数据库查询找到被修改的对象，并赋值新的修改的内容（由参数传递过来）。
###总结与思考
####react渲染性能优点：
- react不直接操作dom，将DOM结构存储在内存中，然后同render()的返回内容进行比较，计算出需要改动的地方，最后才反映到DOM中。
- react使用虚拟节点，通过js创建dom节点对象。
- 传统的dom树：传统dom节点是非常庞大的，拥有很多属性,对传统dom的操作如增加或者删除将会引起重排，重排是DOM元素的几何属性变化，DOM树的结构变化，渲染树需要重新计算。页面在下载好文档时会生成两个内部数据结构dom树和渲染树，每次对dom节点的操作引起了重排之后，dom树会发生重新排列，此时渲染树就要开始对页面重新的结构进行计算，从读取dom（更改属性就要对dom对象的属性进行便利查找）到修改属性，把属性重新入栈到dom对象，生成新的dom文档的时候，重排必然引起重绘，重绘就会需要渲染树进行重新计算得到样式。
- 虚拟节点：基本算法过程分为：
	1. 通过js创建dom对象，存储在内存中，react会根据一个根节点（实际节点）：
	```javascript
		var ulRoot = ul.render()
		document.body.appendChild(ulRoot)
	也就是react中：
	`ReactDOM.render(<App/>,document.getElementById('ulRoot'));
	```
	来逐层计算子节点，然后把子节点抛到根节点（ulRoot）下。
	2. js内比较修改后新的虚拟dom树和原来的旧的虚拟dom树，diff算法：
	两个树的完全的 diff 算法时间复杂度为 O(n^3)，在前端里很少跨级移动dom元素，所以一般只会在同一层级对新旧dom树的dom元素进行对比，时间复杂度减为O(n)。差异计算：
	- 深度优先遍历dom树，对比dom数组的差异，把差异存储在一个数组里。
	3. 把差异应用到dom树，dom节点的操作可能会有：
		- 替换掉原来的节点，例如把上面的div换成了section
		- 移动、删除、新增子节点，例如上面div的子节点，把p和ul顺序互换
		- 修改了节点的属性
		- 对于文本节点，文本内容可能会改变。
	每种操作对应一个对象，不同的差异把差异作为对象属性存储到数组里。
	4. 遍历dom树，从存储差异的数组里获得index，然后对dom树的节点数组进行差异操作，差异操作会根据差异数组的对象类型，执行不同的操作，替换删除等等。
- react对变化是一个存储然后批处理的过程，仅对变化的dom进行批处理。（批处理机制？）
####react使用
1. 组件规划：明确需求功能，明确功能对应的组件之间的关系。
	- 对于兄弟节点又没有相互引用，由于react单向数据传输机制，项目里使用的是使用this.props.deleteTodo(para1,para2)，将参数从子组件传到父组件，然后由父组件记录到this.state.todos,再传递到其他组件。
2. 子组件进行事件操作，将用户的行为记录下来，然后通过参数传到app做数据处理和setState。