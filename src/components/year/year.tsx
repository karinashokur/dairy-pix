import React from 'react';
import Month from '../month/month';
import './year.scss';
interface YearProps {
  year: number;
  onDayUpdated: () => void;
}
const Year: React.FC<YearProps> = ({ year, onDayUpdated }) => {
  const renderMonths: JSX.Element[] = [];
  for (let i = 0; i < 12; i++) {
    renderMonths.push(
      <Month
        key={`${year}-${i}`}
        date={new Date(year, i)}
        onDayUpdated={onDayUpdated}
      />,
    );
  }
  return <div className="year">{renderMonths}</div>;
};
export default Year;
