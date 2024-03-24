import React, { Component } from 'react'
import './homeOptions.css'
import { Link } from 'react-router-dom'

export default class HomeOptions extends Component {
  render() {
    return (
      <div className='default_conf_layout homeOptions_main_body'>
        <h2 className='heading_'>Chat Room</h2>
        <Link to="/Create">
          <button className='opt o1'>Create New</button>
        </Link>
        <Link to="/Join">
          <button className='opt o2'>Join Now</button>
        </Link>
      </div>
    )
  }
}
