import React, { Component } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import HeaderBar from './components/HeaderBar'
import HomeOptions from './components/HomeOptions'
import CreateNewWin from './components/CreateNewWin'
import JoinNowWin from './components/JoinNowWin'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import ChatArea from './components/ChatArea'
import ChatAreaHeader from './components/ChatAreaHeader'
import ClientChat from './components/ClientChat'
import LeaderChat from './components/LeaderChat'
import ChatAreaEntry from './components/ChatAreaEntry'
// import Settings from './components/Settings'  ---- in feature if settings adds so we will enable this line.
import RoomMembersList from './components/RoomMembersList'
import MemberItem from './components/MemberItem'
import MessageBox from './components/MessageBox'
import RoomInfo from './components/RoomInfo'
import DialogBox1 from './components/DialogBox1'
import LoadingCircle from './components/LoadingCircle'
/*
-----> For testing of leaderChat Component
<LeaderChat msg_content={"hi"} fileMetaData={{
  "fileName": "test",
  "fileSize": "9922",
  "fileRenderType": "doc",
  "fileSrc": "none"
}}/>

*/

let web_sock = null;
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      setting_win_disp: "none",
      memList_win_disp: "none",
      roomInfo_win_disp: "none",
      chatRoomCreated: false,
      messages: [],
      members: [],
      room_id: String(Math.random()*1000).replace(".", "@").slice(0, 12),
      room_name: null,
      user_id: null,
      user_name: "",
      user_type: null,
      message_box: null,
      dialog_box: null,
      currently_typing: null,
      loading_screen: null
    }
  }

  establish_websocket = (after_connect) => {
    web_sock = io({ "upgrade": "websocket" });

    web_sock.on("connect", () => {
      console.log("WS CONNECTED");
      after_connect();
    });

    web_sock.on('close', () => {
      console.log("disconnected");
    });

    web_sock.on("castMessage", (data_) => {
      let json_data = JSON.parse(data_);

      let loaded_msgs = this.state.messages;
      if (json_data["user_id"] === this.state.user_id) {
        loaded_msgs.push(<LeaderChat msg_content={json_data["msg"]} user_id={json_data["user_id"]} user_name={json_data["user_name"]} key={this.state.messages.length}/>);
      }
      else {
        loaded_msgs.push(<ClientChat msg_content={json_data["msg"]} user_id={json_data["user_id"]} user_name={json_data["user_name"]} key={this.state.messages.length}/>);
      }
      this.setState({ messages: loaded_msgs });
    });

    web_sock.on("castFile", (data_)=>{
      let whole_data_blob = new Blob([data_], {type: "application/octet-stream"});
      let byte_reader = new FileReader();
      byte_reader.onload = ()=>{
        let divided_data = byte_reader.result.split("__@(93d__");
        let extra_data_len = divided_data[1].length + "__@(93d__".length;  // length of json data which should not be send to user.
        let json_data = JSON.parse(divided_data[1]);

        let file_uri = null;
        file_uri = URL.createObjectURL(whole_data_blob.slice(0, -extra_data_len, json_data["mimeType"]));
        
        let file_metadata = {
          "fileName": json_data["fileName"],
          "fileSize": json_data["fileSize"],
          "fileRenderType": json_data["fileRenderType"],
          "fileSrc": file_uri
        }

        let loaded_msgs = this.state.messages;
        if (json_data["user_id"] === this.state.user_id) {
          loaded_msgs.push(<LeaderChat msg_content={json_data["msg"]} user_id={json_data["user_id"]} user_name={json_data["user_name"]} fileMetaData={file_metadata} key={this.state.messages.length}/>);
        }
        else {
          loaded_msgs.push(<ClientChat msg_content={json_data["msg"]} user_id={json_data["user_id"]} user_name={json_data["user_name"]} fileMetaData={file_metadata} key={this.state.messages.length}/>);
        }
        this.setState({ messages: loaded_msgs });
      }
      byte_reader.readAsBinaryString(whole_data_blob);
    });

    web_sock.on("updateMembers", (members_)=>{
      let data_ = JSON.parse(members_)["members"];
      let new_member_list = [];
      let key_idx = 22;
      data_.forEach((member)=>{
        new_member_list.push(<MemberItem member_id={member["user_id"]} member_name={member["user_name"]} key={key_idx}/>)
        key_idx += 1;
      });
      this.setState({members: new_member_list});
    });

    web_sock.on("changeTypingStatus", (data_)=>{
      let json_data = JSON.parse(data_);
      this.setState({currently_typing: json_data["cur_typing"]})
    })

    web_sock.on('roomClosed', () => {
      this.showLoadingCircle();
      web_sock.close();
      this.showMessageBox("alert", "Chat room has been closed by host. Redirecting in 5sec.");
      setTimeout(()=>{
        this.hideLoadingCircle();
        window.location.href = "/";
      }, 5000);
    });

    web_sock.on("createError", (error)=>{
      this.showMessageBox("alert", error);
      if (web_sock){
        web_sock.close();
      }
    });
  }

  createChatRoom = async (room_name, u_name) => {
    this.showLoadingCircle("Creating room....");
    let svr = await fetch("/create_room", { method: "POST", body: JSON.stringify({ "room_id": this.state.room_id, "room_name": room_name }) });
    let resp_text = await svr.text();
    if (resp_text === "OK") {
      this.setState({ chatRoomCreated: true, "room_name": room_name, "user_id": String(Math.random() * 100).replace(".", "@").slice(0, 10), user_name: u_name, user_type: "admin" });
      this.establish_websocket(() => {
        web_sock.emit("registerUserToRoom", JSON.stringify({ "user_id": this.state.user_id, "user_name": this.state.user_name, "room_id": this.state.room_id, "user_type": this.state.user_type }));
      });
    }
    else if(resp_text === "ALREADY_EXISTS"){
      this.setState({room_id: String(Math.random()*1000).replace(".", "@").slice(0, 12)});
      this.showMessageBox("alert", "Room with this ID already exists please reload the page try again.");
    }
    else{
      this.showMessageBox("alert", `Unexpcted error : ${resp_text.slice(0, 30)}`);
    }
    this.hideLoadingCircle();
    // this.setState({"messages": [<ClientChat msg_content="Hello World"/>, <LeaderChat msg_content="Hi"/>, <LeaderChat msg_content="Hi"/>, <LeaderChat msg_content="Hi"/>, <LeaderChat msg_content="Hi"/>, <LeaderChat msg_content="Hi"/>, <LeaderChat msg_content="Hiw"/>]});
  }

  joinChatRoom = (room_id_, u_name) => {
    this.showLoadingCircle(`Joining to ${room_id_}...`);
    this.setState({ room_id: room_id_, user_id: String(Math.random() * 100).replace(".", "@").slice(0, 10), user_type: "user", user_name: u_name });
    this.establish_websocket(() => {
      web_sock.emit("registerUserToRoom", JSON.stringify({ "user_id": this.state.user_id, "user_name": this.state.user_name, "room_id": room_id_, "user_type": this.state.user_type }));

      web_sock.on("proceedJoining", (data_) => {
        this.setState({ chatRoomCreated: true, room_name: data_});
      });
      this.hideLoadingCircle();
    });
  }

  showMessageBox = (type, text)=>{
    this.setState({message_box: <MessageBox type={type} text={text}/>});
    setTimeout(()=>{
      this.setState({message_box: null})
    }, 3000);
  }

  showDialogBox = (title, message, on_change)=>{
    const to_call = (action)=>{
      on_change(action);
      this.setState({dialog_box: null});
    }
    this.setState({dialog_box: <DialogBox1 heading_={title} msg_={message} on_change_={to_call}/>});
  }
  showLoadingCircle = (msg_)=>{
    this.setState({loading_screen: <LoadingCircle info_={msg_}/>});
  }
  hideLoadingCircle = ()=>{
    this.setState({loading_screen: null});
  }

  on_msg_send = (msg_, files_) => {
    if (!files_.length){
      // let to_send = new Blob(['__@(93d__', JSON.stringify({"msg": msg_, "file_attached": false})]);
      web_sock.emit("castMessage", JSON.stringify({"msg": msg_, "file_attached": false}));
    }
    else{
      for (let i = 0; i < files_.length; i++) {
        let to_send = new Blob([files_[i], '__@(93d__', JSON.stringify({"msg": msg_, "file_attached": true, "mimeType": files_[i].type, "fileName": files_[i].name, "fileSize": files_[i].size, "fileRenderType": files_[i]["renderType"]})]);
        web_sock.emit("castFile", to_send);
        // break;  // latter i remove it...
      }
    }
  }

  change_typingStatus = (status)=>{
    if (!web_sock){
      return;
    }
    let to_send = {"user_id": this.state.user_id, "status": status, "room_id": this.state.room_id};
    web_sock.emit("changeTypingStatus", to_send);
  }

  /* on_clc_settings = ()=>{
    if (this.state.setting_win_disp === "block"){
      this.setState({setting_win_disp: "none"});
    }
    else{
      this.setState({setting_win_disp: "block"});
    }
  } // ---- in feature if settings adds so we will enable this. */

  on_clc_memList = ()=>{
    if (this.state.memList_win_disp === "flex"){
      this.setState({memList_win_disp: "none"});
    }
    else{
      this.setState({memList_win_disp: "flex"});
    }
  }

  on_clc_roomInfo = ()=>{
    if (this.state.roomInfo_win_disp === "flex"){
      this.setState({roomInfo_win_disp: "none"});
    }
    else{
      this.setState({roomInfo_win_disp: "flex"});
    }
  }

  on_clc_share = ()=>{
    if (navigator.clipboard){
      navigator.clipboard.writeText(`${window.location.origin}/Join#${this.state.room_id}`);
      this.showMessageBox("info", "Link copied!!! Share it with anyone you want to join here.");
    }
  }

  on_exit_room = ()=>{
    this.showDialogBox("Exit", "Are you sure want the chat room?", (eve)=>{
      if (eve === true){
        if (this.state.user_type === "user"){
          web_sock.emit("leave_room", JSON.stringify({"room_id": this.state.room_id, "user_id": this.state.user_id}));
          web_sock.close();
          window.location.href = "/";
        }
        else if (this.state.user_type === "admin"){
          web_sock.emit("close_room", JSON.stringify({"room_id": this.state.room_id}));
        }
        // this.setState({home_redirect: <Navigate to="/" replace={true}/>})
      }
    })
  }

  render() {
    if (this.state.chatRoomCreated) {
      return (
        <div className='chatAreaPageWindow'>
          {this.state.dialog_box}
          {this.state.loading_screen}
          <ChatAreaHeader chatRoomName={this.state.room_name} user_type={this.state.user_type} onclickMemList={this.on_clc_memList} onclickShare={this.on_clc_share} onclickRoomInfo={this.on_clc_roomInfo} on_exit={this.on_exit_room}/>
          {/* <TypingStatusChat /> */}
          <div>{this.state.message_box}</div>
          <RoomMembersList window_view={this.state.memList_win_disp} member_eles={this.state.members} close_func={this.on_clc_memList}/>
          <RoomInfo close_func={this.on_clc_roomInfo} window_view={this.state.roomInfo_win_disp} room_id={this.state.room_id} room_name={this.state.room_name} user_id={this.state.user_id} user_name={this.state.user_name}/>
          <ChatArea msgs={this.state.messages} typing_users={this.state.currently_typing} my_user_id={this.state.user_id}/>
          <ChatAreaEntry on_message_send={this.on_msg_send} on_send_file={this.on_send_file} showMessageBox={this.showMessageBox} change_typingStatus={this.change_typingStatus}/>
        </div>
      )
    }

    return (
      <Router>
        {this.state.dialog_box}
        {this.state.loading_screen}
        <HeaderBar/>
        {this.state.message_box}
        {/* <Settings window_view={this.state.setting_win_disp}/> ---- in feature if settings adds so we will enable this line.*/}
        <div className='content_area'>
          <Routes>
            <Route path='/' element={<HomeOptions />} />
            <Route path='/Create' element={<CreateNewWin on_click_create={this.createChatRoom} room_id={this.state.room_id}/>} />
            <Route path='/Join' element={<JoinNowWin on_click_join={this.joinChatRoom} showMessageBox={this.showMessageBox}/>} />
          </Routes>
        </div>
      </Router>
    )
  }
}
// TODO ---- add check for no duplicate ID creates for room as well as of user at server side...