'use strict';
import React from "react";
import ReactDOM from "react-dom";
import { Input } from 'antd';
import { Button } from 'antd';
import { message } from 'antd';
import { Alert } from 'antd';

class TodoHeader extends React.Component {
    constructor(){
        super();
        this.state={
            additems:' '
        };
    }


    // 绑定键盘回车事件，添加新任务
    handlerKeyUp(event){
        if(event.keyCode === 13){
            let value = event.target.value;
            //增加时间戳赋予数据库的元素id
            let timeId = new Date().getTime();

            if(!value) return false;

            let newTodoItem = {
                text: value,
                timeId:timeId,
                lastReviseTime:'尚未修改'
            };
            event.target.value = "";
            this.state.additems = newTodoItem;
            this.props.addTodo(newTodoItem);
        }
        let value = event.target.value;
    }

    addClick(){
        let addvalue = document.getElementById('inputva').value;
        let isSpace = true;
        let i;
        for(i=0;i<addvalue.length;i++){
            if(addvalue[i] != ' '){
                isSpace = false;
                break;
            }
        }
        message.config({
            top:48,
            duration:1
        });
        if(!addvalue || isSpace) {
            message.error('不能增加空值！');
            return;
        }
        let timeId = new Date().getTime();
        let newTodoItem = {text:addvalue,timeId:timeId,lastReviseTime:'尚未修改'};//idDone执行批量删除
        this.props.addTodo(newTodoItem);
    }

    showAll(){
        this.props.showAll();
    }
    render(){
        return (
            <div className="panel-header">
                <Input id="inputva" onKeyUp={this.handlerKeyUp.bind(this)} type="text" placeholder="回车或者点击增加按钮增加，点击增加按钮可同样内容重复增加"/>
                <Button className="add-button" onClick={this.addClick.bind(this)}>增加</Button>
                <Button onClick={this.showAll.bind(this)} className="show-all">显示全部</Button>
            </div>
        )
    }
}

export default TodoHeader;

