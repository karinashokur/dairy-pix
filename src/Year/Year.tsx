import React from 'react';
import Month, { IMonth } from '../Month/Month';
import './Year.scss';
export interface IYear {
  [key: number]: IMonth;
}
interface YearProps {
  year: number;
  months: IYear;
  onClickDay: (year: number, month: number, day: number) => void;
}
const Year: React.FC<YearProps> = ({ year, months, onClickDay }) => {
  const renderMonths: JSX.Element[] = [];
  for (let i = 0; i < 12; i++) {
    renderMonths.push(
      <Month
        key={`${year}-${i}`}
        month={i}
        year={year}
        days={months[i] ? months[i] : {}}
        onClickDay={day => onClickDay(year, i, day)}
      />,
    );
  }
  return <div className="year">{renderMonths}</div>;
};
export default Year;
