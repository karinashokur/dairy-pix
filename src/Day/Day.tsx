import classNames from 'classnames';
import React from 'react';
import './Day.css';
import styled from 'styled-components';
export interface DayModel {
  mood?: string;
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
  });
  const Pixel = styled.div`
    background-color: ${data.mood}
  `;
  return <Pixel className={classes} onClick={!isFiller ? onClick : undefined}></Pixel>;
};
