'use strict';
import React from 'react';
import ReactDom from 'react-dom';
//import TodoRevise from './TodoRevise.js';

import {  Input } from 'antd';
import { Button } from 'antd';
import { Checkbox } from 'antd';
export default class TodoItem extends React.Component{


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



//<Checkbox type="checkbox" onChange={this.handlerChange.bind(this)} id="check-box"></Checkbox>

