import React, { Component } from 'react';
import './Month.css';
import Day from '../Day/Day';
class Month extends Component {
  render() {
    let days = [];
    for (let i = 0; i < 31; i++) {
      let key = this.props.year + '-' + this.props.month + '-' + i;
      days.push(<Day key={key} filler={i >= this.props.amountDays} />);
    }
    return <div className="month">{days}</div>;
  }
}
export default Month;
