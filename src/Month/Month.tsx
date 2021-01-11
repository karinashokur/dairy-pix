import React from 'react';
import Day, { IDay } from '../Day/Day';
import './Month.css';
export interface IMonth {
  [key: number]: IDay
}
interface MonthProps {
  year: number;
  month: number;
  days: IMonth;
  onClickDay: (day: number) => void;
}
const Month: React.FC<MonthProps> = ({ year, month, days, onClickDay }) => {
  const daysInMonth = () => new Date(year, month + 1, 0).getDate();
  const renderDays: JSX.Element[] = [];
  for (let i = 1; i < 32; i++) {
    renderDays.push(
      <Day
        key={`${year}-${month}-${i}`}
        data={days[i] ? days[i] : {}}
        isFiller={
          i > daysInMonth() || new Date(year, month, i).getTime() > new Date().getTime()
        }
        onClick={() => onClickDay(i)}
      />,
    );
  }
  return <div className="month">{renderDays}</div>;
};
export default Month;
