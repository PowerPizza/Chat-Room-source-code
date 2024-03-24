import React, { Component } from 'react'
import './memberItem.css'

export default class MemberItem extends Component {
  render() {
    let {member_id, member_name} = this.props;

    return (
      <div className='member_ele'>
        <div className='U_icon'></div>
        <div className='texts'>
            <span>ID : {member_id}</span>
            <span>Name : {member_name}</span>
        </div>
      </div>
    )
  }
}
