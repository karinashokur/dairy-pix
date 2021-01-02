import React from 'react';
import { Day, DayModel } from '../Day/Day';
import './Month.css';
export interface MonthModel {
  [key: number]: DayModel
}
interface MonthProps {
  year: number;
  month: number;
  days: MonthModel;
  onClickDay: (day: number) => void;
}
export const Month: React.FC<MonthProps> = ({ year, month, days, onClickDay }) => {
  const daysInMonth = () => new Date(year, month + 1, 0).getDate();
  const renderDays: JSX.Element[] = [];
  for (let i = 0; i < 31; i++) {
    renderDays.push(
      <Day
        key={`${year}-${month}-${i}`}
        data={days[i] ? days[i] : {}}
        isFiller={i >= daysInMonth()}
        onClick={() => onClickDay(i)}
      />,
    );
  }
  return <div className="month">{renderDays}</div>;
};
