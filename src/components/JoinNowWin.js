import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './joinNowWin.css'

export default class JoinNowWin extends Component {
  auto_room_id = "";
  
  constructor(){
    super();
    this.state = {join_room_id: null, user_name: null}
  }

  componentDidMount(){
    let hash_data = window.location.hash.slice(1);
    if (hash_data.length){
      if (hash_data.length === 12){
        this.auto_room_id = hash_data;
        this.setState({join_room_id: this.auto_room_id});
        window.location.hash = "";
        this.props.showMessageBox("info", "Enter your name (optional) and click on join.");
      }
  
      else{
        this.props.showMessageBox("alert", "Wrong invite link detected!!!");
      }
    }
  }

  render() {
    let {on_click_join} = this.props;

    const set_room_id = (ele)=>{
      this.setState({join_room_id: ele.target.value})
    }
    
    const set_user_name = (ele)=>{
      this.setState({user_name: ele.target.value})
    }

    return (
      <div className='default_conf_layout join_main_body'>
        <div className='top_holder'>
            <Link to="/">
              <button className='back_btn'></button>
            </Link>
            <h2 className='heading_'>Join - Chat Room</h2>
        </div>
        <div className='entry_box'>
            <label>Room ID</label>
            <input type="text" className='entry room_id' spellCheck={false} onChange={set_room_id} value={this.auto_room_id ? this.auto_room_id : null} disabled={this.auto_room_id ? true : false}/>
        </div>
        <div className='entry_box'>
            <label>User Name</label>
            <input type="text" className='entry user_name' spellCheck={false} placeholder='(optional..)' onChange={set_user_name}/>
        </div>
        <button className='join_btn' onClick={()=>{on_click_join(this.state.join_room_id, this.state.user_name)}}>Join</button>
      </div>
    )
  }
}
