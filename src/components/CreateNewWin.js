import React, { Component } from 'react'
import './createNewWin.css'
import { Link } from 'react-router-dom'

export default class CreateNewWin extends Component {
  constructor(){
    super();
    this.state = {room_name: null, user_name: null}
  }

  on_change_room_name = (eve)=>{
    this.setState({"room_name": eve.target.value});
  }

  on_change_user_name = (eve)=>{
    this.setState({"user_name": eve.target.value});
  }

  render() {
    let {on_click_create, room_id} = this.props;

    return (
      <div className='default_conf_layout createNewWin_main_body'>
        <div className='top_holder'>
            <Link to="/">
              <button className='back_btn'></button>
            </Link>
            <h2 className='heading_'>Create - Chat Room</h2>
        </div>
        <div className='entry_box'>
            <label>Room ID</label>
            <input type="text" className='entry room_id' spellCheck={false} disabled value={room_id}/>
        </div>
        <div className='entry_box'>
            <label>Room Name</label>
            <input type="text" className='entry room_name' spellCheck={false} onChange={this.on_change_room_name}/>
        </div>
        <div className='entry_box'>
            <label>User Name</label>
            <input type="text" className='entry user_name' spellCheck={false} placeholder='(optional..)' onChange={this.on_change_user_name}/>
        </div>
        <button className='create_btn' onClick={()=>{on_click_create(this.state.room_name, this.state.user_name)}}>Create</button>
      </div>
    )
  }
}
