import React, { Component } from 'react';
import './Month.css';
import Day from '../Day/Day';
class Month extends Component {
  render() {
    let days = [];
    for (let i = 0; i < 31; i++) {
      days.push(<Day />);
    }
    return <div className="month">{days}</div>;
  }
}
export default Month;
