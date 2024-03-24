import React, { Component } from 'react'
import './chatAreaEntry.css'
import documentIcon from '../images/document_icon.svg'
import photoIcon from '../images/photo_icon.svg'

let is_typing = false;
let timestemp_last = 0;
let last_status = "";

//change_typingStatus
export default class ChatAreaEntry extends Component {
  constructor(){
    super();
    this.state = {msg_: null, ele_entry: null, clip_list_box: null, files_to_send: [], send_listed: []}
  }

  onchange_entry = (ele)=>{
    this.setState({ele_entry: ele.target});
    timestemp_last = new Date().getTime();
    is_typing = true;
  }

  on_click_send = ()=>{
    if (this.state.ele_entry === null){
      this.props.on_message_send("", this.state.files_to_send);
    }
    else{
      this.props.on_message_send(this.state.ele_entry.innerText, this.state.files_to_send);
      this.state.ele_entry.innerText = "";
    }
    this.setState({files_to_send: [], send_listed: []});
  }

  on_attach_media = (renderType, accept_only="*/*")=>{
    // renderType (should be ) : doc, image
    let file_ = document.createElement("input");
    file_.type = "file";
    // file_.multiple = true;  // IN FEATURE IF WE ALLOW USER TO SEND MULTIPLE DOCUMENTS SO ENABLE THIS LINE.
    file_.accept = accept_only;
    file_.onchange = ()=>{
      if (file_.files.length > 3){
        this.props.showMessageBox("alert", "Cannot select more then 3 files at once.");
        return;
      }
      let file_list_render = [];
      for (let i = 0; i < file_.files.length; i++){

        if (!file_.files[i].type.startsWith('image/') && accept_only.startsWith("image/")){
          this.props.showMessageBox("alert", `Invalid file '${file_.files[i].name}' should be an image file.`);
          return;
        }

        file_.files[i]["renderType"] = renderType;
        file_list_render.push(
          <div className='ele' key={i+1}>
            <span>{file_.files[i].name}</span>
          </div>
        );
      }
      this.setState({files_to_send: file_.files, send_listed: file_list_render});
    };
    file_.click();

    this.on_click_clip();
  }
  
  on_click_clip = (ele)=>{
    if (this.state.clip_list_box){
      this.setState({clip_list_box: null});
    }
    else{
      this.setState({clip_list_box:(
        <div className='clip_list' style={{"left": ele.target.offsetLeft-170, "top": ele.target.offsetTop-290}}>
          <div className='itm i1' onClick={()=>{this.on_attach_media("doc")}}>
            <img src={documentIcon} alt="doc_icon" draggable={false}/>
            <span>Document</span>
          </div>
          <div className='itm i2' onClick={()=>{this.on_attach_media("img", "image/*")}}>
            <img src={photoIcon} alt="photo_icon" draggable={false}/>
            <span>Photos</span>
          </div>
        </div>
      )})
    }
  }

  componentDidMount(){
    setInterval(()=>{
      if (!is_typing){
        if (last_status !== "online"){
          this.props.change_typingStatus("online");
          last_status = "online";
        }
        return;
      }
      let time_differ = Math.ceil((new Date().getTime() - timestemp_last)/1000);
      if (time_differ > 1){  // high digit at place of 1 will cause delay in changing status to online after user stopped typing.
        is_typing = false;
      }
      else{
        if (last_status !== "typing"){
          this.props.change_typingStatus("typing");
          last_status = "typing";
        }
      }
    }, 1000);
  }

  render() {
    return (
      <div className='chatAreaEntry_main_body'>
        <div className='file_list'>
            {this.state.send_listed}
        </div>

        {this.state.clip_list_box}

        <div className='interactives'>
          <div className='text_entry' contentEditable={true} onKeyUp={this.onchange_entry}></div>
          <button className='btn clip' onClick={this.on_click_clip}></button>
          <button className='btn send' onClick={this.on_click_send}></button>
        </div>
      </div>
    )
  }
}
