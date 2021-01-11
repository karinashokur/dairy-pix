import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { isNumber } from 'util';
import './Day.css';
export interface IDay {
  mood?: number;
}
export const Moods: {color: string, name: string}[] = [
  { color: '#69A93D', name: 'Sick' },
  { color: '#C69570', name: 'Amazing' },
  { color: '#B53FAC', name: 'Good' },
  { color: '#78562A', name: 'Normal' },
  { color: '#026AAA', name: 'Exhausted' },
  { color: '#2A1999', name: 'Depressed' },
  { color: '#B63542', name: 'Frustrated' },
  { color: '#1B7D5F', name: 'Stressed' },
  { color: '#8B5552', name: 'Moody' },
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
