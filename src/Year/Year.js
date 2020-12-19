import React, { Component } from 'react';
import './Year.css';
import Month from '../Month/Month';
class Year extends Component {
  daysInMonth(month) {
    return new Date(this.props.year, month + 1, 0).getDate();
  }
  render() {
    let months = [];
    for (let i = 0; i < 12; i++) {
      let key = this.props.year + '-' + i;
      months.push(<Month key={key} year={this.props.year} month={i} amountDays={this.daysInMonth(i)} />);
    }
    return <div className="year">{months}</div>;
  }
}
export default Year;
