import React, { Component } from 'react';
import './Year.css';
import Month from '../Month/Month';
class Year extends Component {
  render() {
    let months = [];
    for (let i = 0; i < 12; i++) {
      months.push(<Month />);
    }
    return <div className="year">{months}</div>;
  }
}
export default Year;
