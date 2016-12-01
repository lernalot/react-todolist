'use strict';
import React from "react";
import TodoItem from "./TodoItem.js"


export default class TodoMain extends React.Component{
    // 遍历显示任务，转发props
    
    render(){
        console.log(this.props.todos);
        let listStyle = this.props.todos.isDone?{color: 'red'}:{color:"#57c5f7"};//渲染元素的style在render内定义，主要是做选择的时候定义在这里
        return (
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
    }
}