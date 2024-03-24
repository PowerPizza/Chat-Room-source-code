import React, { Component } from 'react'
import './roomMembersList.css';

export default class RoomMembersList extends Component {
  render() {
    let {window_view, member_eles, close_func} = this.props;
    return (
      <div className='roomMemLst_main_body' style={{display: window_view}}>
        <div className='top_header'>
          <p className='heading_members'>Members</p>
          <button className='close_btn' onClick={close_func}>╳</button>
        </div>
        <div className='list_'>
          {/* <MemberItem member_id='29@2993223' member_name='aka'/> */}
          {member_eles}
        </div>
      </div>
    )
  }
}
