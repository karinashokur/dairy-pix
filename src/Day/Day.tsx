import classNames from 'classnames';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isNumber } from 'util';
import StorageHandlerYear from '../Storage/StorageHandlerYear';
import './Day.scss';
import DayDetails from './Details/Details';
import IDay from '../types/day';
import Moods from '../types/moods';
interface DayProps {
  date: Date;
  isFiller: boolean;
  onUpdate: () => void;
}
const Day: React.FC<DayProps> = ({ date, isFiller, onUpdate }) => {
  const [data, setData] = useState<IDay>(StorageHandlerYear.getDay(date) || {});
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const classes = classNames({
    day: true,
    filler: isFiller,
  });
  const Pixel = styled.div`
    background-color: ${isNumber(data.mood) ? Moods[data.mood].color : null};
  `;
  const handleDetailsClose = (values?: IDay): void => {
    setShowDetails(false);
    if (!values) return;
    setData(values);
    StorageHandlerYear.setDay(date, values);
    onUpdate();
  };
  return (
    <React.Fragment>
      <Pixel className={classes} onClick={!isFiller ? () => setShowDetails(true) : undefined}>
        {data.note && <span className="note-indicator"></span>}
      </Pixel>
      {showDetails && ( 
        <DayDetails date={date} values={data} onClose={handleDetailsClose} />
      )}
    </React.Fragment>
  );
};
export default Day;
