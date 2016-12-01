'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import LocalDb from 'LocalDb';
import { Input } from 'antd';
import { Card } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';

//引入各个操作的组件
import TodoHeader from './TodoHeader.js';
import TodoMain from './TodoMain.js';//渲染增加的元素
import TodoFooter from './TodoFooter.js';
import TodoRevise from './TodoRevise.js';
import TodoQuery from './TodoQuery.js';



class App extends React.Component{
    constructor(){
        super();
        this.db = new LocalDb('React-todos');//数据存储在本地localstorage
        this.state = {
            todos: this.db.get("todos") || []
        }
    }

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

    //所以这里是经过item里面的点击事件触发才会执行函数，函数的执行就是把按钮对应的数据删除掉，然后render
    deleteTodo(timeId){
        //this.state.queryTodos.splice(index,1);
        //遍历数据库找到唯一的被删除元素的index....
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
        this.db.set('todos',this.db.get('todos'));//更改数据库
        // this.setState({
        //     todos:this.db.get('todos')
        // });
        message.config({
            top:48,
            duration:1
        });
        message.success('删除成功！');
    }
    //修改，通过弹窗，获取list内容，然后修改之后setstate
    reviseTodo(todo,index,timeId){
        this.refs.modal.showModal(todo,index,timeId);
    }
    closeDialog(){
        document.getElementById('reviseinput').value = '';
        this.refs.modal.setState({
          visible: false
        });
    }
    //todos是每一次增加后的内容的对象数组，数组元素为每一次用户输入的文案
    //因为删除按钮是在main里面传递到item渲染的，所以删除按钮的事件是触发在todomain组件的
    reviseContent(todo,index,timeId,lastReviseTime){
        let reviseIndex = Number(index)-1;
        let reviseObject = {text:todo,index:reviseIndex,timeId:timeId};
        let i;
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
        document.getElementById('reviseinput').value = '';
    }

    //查询
    queryList(queryArr){
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

    //显示全部
    showAll(){
        this.setState({
            todos:this.db.get('todos')
        });
    }

    render(){
        return (
            <Card className="pannel">
                <TodoHeader addTodo={this.addTodo.bind(this)} todos={this.state.todos} showAll={this.showAll.bind(this)} />
                <TodoQuery ref="query" todos={this.state.todos} queryList={this.queryList.bind(this)} />
                <TodoMain todos={this.state.todos}  deleteTodo={this.deleteTodo.bind(this)} reviseTodo={this.reviseTodo.bind(this)}/>
                <TodoRevise ref="modal" todos={this.state.todos} closeDialog={this.closeDialog.bind(this)} reviseContent={this.reviseContent.bind(this)}/>
            </Card>
        )
    }

}
ReactDOM.render(<App/>,document.getElementById('app'));
