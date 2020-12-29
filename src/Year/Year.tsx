import React, { Component } from 'react';
import './Year.css';
import Month from '../Month/Month';
type YearProps = {
  year: number;
  data: any;
  onClickDay: (month: number, day: number) => void;
}
class Year extends Component<YearProps> {
  render() {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const key = this.props.year + '-' + i;
      const data = this.props.data[i] ? this.props.data[i] : {};
      months.push(
        <Month key={key}
          year={this.props.year} month={i} amountDays={this.daysInMonth(i)} data={data}
          onClickDay={(day) => this.props.onClickDay(i, day)}
        />
      );
    }
    return <div className="year">{months}</div>;
  }
  daysInMonth(month: number) {
    return new Date(this.props.year, month + 1, 0).getDate();
  }
}
export default Year;
