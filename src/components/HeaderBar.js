import React, { Component } from 'react'
import '../components/headerBar.css'

export default class HeaderBar extends Component {
  render() {
    // let {settings_func} = this.props;  ---- in feature if settings adds so we will enable this line.
    return (
        <nav className='header_main_body'>
            <span className='header_text'>Chat Room V-1.0</span>
            {/* <button className='config_opt' onClick={settings_func}></button> ---- in feature if settings adds so we will enable this line. */}
        </nav>
    )
  }
}
