import React, { Component } from 'react'
import './messageBox.css'

export default class MessageBox extends Component {
  render() {
    let {type, text} = this.props;
    return (
      <div className='msgBox_main_body'>
        <div className={`content ${type}`}>
            <div className='icon'></div>
            <span className='message_text'>{text}</span>
        </div>
      </div>
    )
  }
}
