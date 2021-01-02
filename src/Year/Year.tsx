import React from 'react';
import { Month, MonthModel } from '../Month/Month';
import './Year.css';
export interface YearModel {
  [key: number]: MonthModel;
}
interface YearProps {
  year: number;
  months: YearModel;
  onClickDay: (month: number, day: number) => void;
}
export const Year: React.FC<YearProps> = ({ year, months, onClickDay }) => {
  const renderMonths: JSX.Element[] = [];
  for (let i = 0; i < 12; i++) {
    renderMonths.push(
      <Month
        key={`${year}-${i}`}
        month={i}
        year={year}
        days={months[i] ? months[i] : {}}
        onClickDay={day => onClickDay(i, day)}
      />,
    );
  }
  return <div className="year">{renderMonths}</div>;
};
