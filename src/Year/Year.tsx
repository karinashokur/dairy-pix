import React, { Component } from 'react';
import Month, { MonthModel } from '../Month/Month';
import './Year.css';
export type YearModel = {[key: number]: MonthModel};
type YearProps = {
  year: number;
  months: YearModel;
  onClickDay: (month: number, day: number) => void;
}
export default class Year extends Component<YearProps> {
  render() {
    const renderMonths: JSX.Element[] = [];
    for (let i = 0; i < 12; i++) {
      renderMonths.push(
        <Month key={`${this.props.year}-${i}`}
          days={this.props.months[i] ? this.props.months[i] : {}}
          year={this.props.year} month={i}
          onClickDay={(day) => this.props.onClickDay(i, day)}
        />
      );
    }
    return <div className="year">{renderMonths}</div>;
  }
}
