import React, { Component } from 'react'
import './leaderChat.css'

export default class LeaderChat extends Component {
  componentDidMount(){
    document.querySelector(".chatArea_main_body").scroll(0, document.querySelector(".chatArea_main_body").scrollHeight);
  }

  render() {
    // fileMetaData : file_src, file_name, file_size, renderType
    let {msg_content, user_id, user_name, fileMetaData} = this.props;
    return (
        <div className='leader_msg_body'>
            <span className='small_triangle'></span>
            <div className='msg_content'>
                <span className='user_lbl'>{user_name} [ID: {user_id}]</span>
                <div className='hr_line'></div>
                <p className='message_'>{msg_content}</p>
                
                {fileMetaData && fileMetaData["fileRenderType"] === "img" ? <img src={fileMetaData["fileSrc"]} alt="image_not_found" className='img_attach' /> : null}
                
                {fileMetaData && fileMetaData["fileRenderType"] === "doc" ? (
                  <div className='doc_attach'>
                    <span>Document</span>
                    <label>Name : {fileMetaData["fileName"].slice(0, 5)+ "..."+ fileMetaData["fileName"].slice(-5)}</label>
                    <label>Size : {fileMetaData["fileSize"]/(1e+6)} MB</label>
                    <div className='doc_icon'></div>
                    <a href={fileMetaData["fileSrc"]} download={fileMetaData["fileName"]} className='download'>OK</a>
                  </div>
                ) : null}
            </div>
        </div>
    )
  }
}
