import React, { Component } from 'react';
import './Month.css';
import Day from '../Day/Day';
type MonthProps = {
  year: number;
  month: number;
  amountDays: number;
  data: any; 
  onClickDay: (day: number) => void;
}
class Month extends Component<MonthProps> {
  render() {
    const days = [];
    for (let i = 0; i < 31; i++) {
      const key = this.props.year + '-' + this.props.month + '-' + i;
      const data = this.props.data[i] ? this.props.data[i] : {};
      days.push(
        <Day key={key}
          filler={i >= this.props.amountDays} data={data}
          onClick={() => this.props.onClickDay(i)}
        />
      );
    }
    return <div className="month">{days}</div>;
  }
}
export default Month;
