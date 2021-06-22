import React, { memo } from 'react';
import Day from '../day/day';
import './month.scss';
interface MonthProps {
  date: Date;
  onDayUpdated: () => void;
}
const Month: React.FC<MonthProps> = ({ date, onDayUpdated }) => {
  const [year, month] = [date.getFullYear(), date.getMonth()];
  const daysInMonth = () => new Date(year, month + 1, 0).getDate();
  const renderDays: JSX.Element[] = [];
  for (let i = 1; i < 32; i++) {
    renderDays.push(
      <Day
        key={`${year}-${month}-${i}`}
        date={new Date(year, month, i)}
        onUpdate={onDayUpdated}
        isFiller={i > daysInMonth() || new Date(year, month, i).getTime() > new Date().getTime()}
      />,
    );
  }
  return <div className="month">{renderDays}</div>;
};
export default memo(Month);
