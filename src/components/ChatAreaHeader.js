import React, { Component } from 'react'
import './chatAreaHeader.css'

export default class ChatAreaHeader extends Component {
  constructor(){
    super();
    this.state = {
      userOptDisplayPC: "none",
      userOptDisplayMOB: "none",
      dropDownDisplay: "none",
      dropDownRotate: "0deg"
    }
  }

  makeResponsive = ()=>{
    let cli_w = document.documentElement.clientWidth;
    if (cli_w < 400){
      this.setState({userOptDisplayMOB: "flex"});
      this.setState({userOptDisplayPC: "none"});
    }
    else{
      this.setState({userOptDisplayPC: "flex"});
      this.setState({userOptDisplayMOB: "none"});
    }
  }

  componentDidMount(){
    this.makeResponsive();
    window.onresize = this.makeResponsive;
  }

  render() {
    let {chatRoomName, user_type, onclickMemList, onclickShare, onclickRoomInfo, on_exit} = this.props;
    let admin_options = [];
    let user_options = [];
    let both_options = [<button className='opt invite' key={103} onClick={onclickShare}></button>, <button className='opt U_info' key={104} onClick={onclickRoomInfo}></button>, <button className='opt member_list' onClick={onclickMemList} key={105}></button>];
    
    const onclick_dropdown = ()=>{
      if (this.state.dropDownDisplay === "none"){
        this.setState({dropDownDisplay: "flex", dropDownRotate: "180deg"});
      }
      else{
        this.setState({dropDownDisplay: "none", dropDownRotate: "0deg"});
      }
    }

    return (
      <div className='CAH_main_body'>
        <div className='backbutton' onClick={on_exit}></div>
        <span className='chat_room_name'>{chatRoomName}</span>
        <div className='right_options pc_mode' style={{display: this.state.userOptDisplayPC}}>
            {both_options}
            {user_type==="admin" ? admin_options : null}
            {user_type==="user" ? user_options : null}
        </div>

        <div className='right_options mobile_mode' style={{display: this.state.userOptDisplayMOB}}>
            <button className='opt downarrow' onClick={onclick_dropdown} style={{rotate: this.state.dropDownRotate}}></button>
            <div className='hidden_opts' style={{display: this.state.dropDownDisplay}}>
              {both_options}
              {user_type==="admin" ? admin_options : null}
              {user_type==="user" ? user_options : null}
            </div>
        </div>
      </div>
    )
  }
}
