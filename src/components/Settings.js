import React, { Component } from 'react'
import './settings.css'

export default class Settings extends Component {
  render() {
    let {window_view} = this.props;
    return (
      <div className='settings_main_body' style={{"display": window_view}}>
        <div className='top_header'>
            <h2 className='heading_'>App Settings</h2>
        </div>
        <div className='entries_form'>
            <label htmlFor="name_entry">User Name </label>
            <input type="text" className='name_entry inputCSS_UID9223'/>
            {/* <label htmlFor="class_entry">Class</label>
            <input type="text" className='class_entry inputCSS_UID9223'/> */}
        </div>
      </div>
    )
  }
}
