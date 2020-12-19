import React, { Component } from 'react';
import './Day.css';
class Day extends Component {
  render() {
    let className = 'day';
    if(this.props.filler) {
      className += ' filler';
    }
    return <div className={className}></div>;
  }
}
export default Day;
