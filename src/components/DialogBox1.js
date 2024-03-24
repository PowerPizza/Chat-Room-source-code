import React, { Component } from 'react'
import './dialogBox1.css'

export default class DialogBox1 extends Component {
  render() {
    let {heading_, msg_, on_change_} = this.props;
    return (
      <div className='dialog1_main_canva'>
        <div className='content_area'>
            <h2 className='heading'>{heading_}</h2>
            <span className='msg'>{msg_}</span>
            <div className='opts'>
                <button className='true btn' onClick={()=>{on_change_(true)}}>Yes</button>
                <button className='false btn' onClick={()=>{on_change_(false)}}>No</button>
            </div>
        </div>
      </div>
    )
  }
}
