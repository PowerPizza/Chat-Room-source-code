import React, { Component } from 'react'
import './roomInfo.css'

export default class RoomInfo extends Component {
  render() {
    let {window_view, close_func, room_id, room_name, user_id, user_name} = this.props;
    return (
        <div className='roomInfo_main_body' style={{display: window_view}}>
            <div className='top_header'>
                <p className='heading_'>Information</p>
                <button className='close_btn' onClick={close_func}>╳</button>
            </div>
            <div className='content'>
                <span>Room ID : {room_id}</span>
                <span>Room Name : {room_name}</span>
                <span>User ID : {user_id}</span>
                <span>User Name : {user_name}</span>
            </div>
        </div>
    )
  }
}
