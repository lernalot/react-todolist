'use strict';
import React from "react";
import ReactDOM from "react-dom";
import { Input } from 'antd';
import { Button } from 'antd';
import { Alert } from 'antd';
import { Modal } from 'antd';

class TodoRevise extends React.Component {
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

