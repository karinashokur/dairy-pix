import React, { Component } from 'react';
import './Day.css';
class Day extends Component {
  render() {
    let className = 'day';
    let onclick = this.props.onClick;
    if(this.props.filler) {
      className += ' filler';
      onclick = null;
    }
    if(this.props.data.color) {
      className += ' colored';
    }
    return <div className={className} onClick={onclick}></div>;
  }
}
export default Day;
