import classNames from 'classnames';
import React from 'react';
import './Day.css';
export interface DayModel {
  isColored?: boolean;
}
interface DayProps {
  data: DayModel;
  isFiller: boolean;
  onClick: () => void;
}
export const Day: React.FC<DayProps> = ({ data, isFiller, onClick }) => {
  const classes = classNames({
    day: true,
    filler: isFiller,
    colored: data.isColored && !isFiller,
  });
  return <div className={classes} onClick={!isFiller ? onClick : undefined}></div>;
};
