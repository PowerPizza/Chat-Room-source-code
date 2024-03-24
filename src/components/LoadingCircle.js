import React, { Component } from 'react'
import './loadingCircle.css'

export default class LoadingCircle extends Component {
  render() {
    let {info_} = this.props;
    return (
      <div className='loading_circle_body'>
        <div className='content'>
            <div className='circle'>
                <div className='sub_circle'></div>
            </div>
            <p className='information'>{info_}</p>
        </div>
      </div>
    )
  }
}
