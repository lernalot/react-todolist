'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import LocalDb from 'LocalDb';

import { Button } from 'antd';
import { Alert } from 'antd';
import { message } from 'antd';


export default class TodoQuery extends React.Component{
	constructor(){
		super();
		this.db = new LocalDb('React-todos');
		this.state = {
			item:''
		};
	}

	queryContent(){
		let queryStr = document.getElementById('inputva').value;
		let queryArr = [];
		let queryDb = this.db.get('todos') || [];
		message.config({
            top:48,
            duration:2.5
        });
		if(this.props.todos.length == 0 && queryDb.length == 0){
            message.error('数据为空请勿查询');
            return;
        }else if(queryStr == ''){
        	message.error('请勿查询空值');
        	return;
        }else{
        	this.props.todos.map((todo,index) => {
				if(todo.text.indexOf(queryStr)!=-1){
					queryArr.push(todo);
				}
			});
			this.props.queryList(queryArr);
	    }
	}

	render(){
		return (
			<Button className='query-button' onClick={this.queryContent.bind(this)}>查询</Button>
		)
	}
}



// onClick={this.query.bind(this)}