import React, { Component } from 'react';
import Day, { DayModel } from '../Day/Day';
import './Month.css';
export type MonthModel = {[key: number]: DayModel};
type MonthProps = {
  year: number;
  month: number;
  days: MonthModel;
  onClickDay: (day: number) => void;
}
export default class Month extends Component<MonthProps> {
  render() {
    const renderDays: JSX.Element[] = [];
    for (let i = 0; i < 31; i++) {
      renderDays.push(
        <Day key={`${this.props.year}-${this.props.month}-${i}`}
          data={this.props.days[i] ? this.props.days[i] : {}}
          isFiller={i >= this.daysInMonth()}
          onClick={() => this.props.onClickDay(i)}
        />
      );
    }
    return <div className="month">{renderDays}</div>;
  }
  daysInMonth() {
    return new Date(this.props.year, this.props.month + 1, 0).getDate();
  }
}
