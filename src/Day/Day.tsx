import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { isNumber } from 'util';
import './Day.scss';
export interface IDay {
  mood?: number;
}
export const Moods: {color: string, name: string}[] = [
  { color: '#2196F3', name: 'Normal / Average' },
  { color: '#26C6DA', name: 'Good / Happy' },
  { color: '#FFEB3B', name: 'Fantastic / Amazing' },
  { color: '#F48FB1', name: 'Relaxed' },
  { color: '#ff9800', name: 'Stressed / Frantic' },
  { color: '#f44336', name: 'Frustrated / Angry' },
  { color: '#9E9E9E', name: 'Depressed / Sad' },
  { color: '#26A69A', name: 'Exhausted / Tired' },
  { color: '#9CCC65', name: 'Sick' },
  { color: '#9c27b0', name: 'Grieving' },
  { color: '#795548', name: 'Mood Swings' },
];
interface DayProps {
  data: IDay;
  isFiller: boolean;
  onClick: () => void;
}
const Day: React.FC<DayProps> = ({ data, isFiller, onClick }) => {
  const classes = classNames({
    day: true,
    filler: isFiller,
  });
  const Pixel = styled.div`
    background-color: ${isNumber(data.mood) ? Moods[data.mood].color : null}
  `;
  return <Pixel className={classes} onClick={!isFiller ? onClick : undefined}></Pixel>;
};
export default Day;
