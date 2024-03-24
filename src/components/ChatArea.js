import React, { Component } from 'react'
import './chatArea.css'

export default class ChatArea extends Component {
  render() {
    let {msgs, typing_users, my_user_id} = this.props;
    if (typing_users && typing_users.includes(my_user_id)){
      typing_users.pop(my_user_id);
    }
    
    let typing_msg = "";
    if (typing_users && typing_users.length){
      if (typing_users.length > 1){
        for (let i = 0; i < typing_users.length; i++) {
          if (i === 2){  // for now its shows like `user@xxxxx1, user@xxxxx2 are typing.` to increase no of id (user@xxxxxn) shows use n integer at place of 2
            break
          }  // add unique ID protection on both room and user ids and work on leave room button. ---- TODO
          typing_msg += `${typing_users[i]}, `;
        }
        typing_msg += "...are typing.";
      }
      else{
        typing_msg += `${typing_users[0]} is typing.`;
      }
    }

    return (
      <div className='chatArea_main_body'>
          <div className='typing_status'>
            <span>{typing_msg}</span>
          </div>
          <div>
            {msgs}
          </div>
      </div>
    )
  }
}
