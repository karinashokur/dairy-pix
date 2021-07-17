import classNames from 'classnames';
import React, { Fragment, memo, useState } from 'react';
import styled from 'styled-components';
import { isNumber } from 'util';
import DataService from '../../services/data-service';
import IDay from '../../types/day';
import Moods from '../../types/moods';
import './day.scss';
import DayDetails from './details/details';
interface DayProps {
  date: Date;
  isFiller: boolean;
  onUpdate: () => void;
}
const Day: React.FC<DayProps> = ({ date, isFiller, onUpdate }) => {
  const [data, setData] = useState<IDay>(DataService.getDay(date) || {});
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const isFuture = date.getTime() > new Date().getTime();
  const classes = classNames({
    day: true,
    filler: isFiller || isFuture,
    blink: data.mood === undefined && date.toDateString() === new Date().toDateString(),
  });
  const Pixel = styled.div`
    background-color: ${isNumber(data.mood) ? Moods[data.mood].color : null};
  `;
  const handleDetailsClose = (values?: IDay): void => {
    setShowDetails(false);
    if (!values) return;
    setData(values);
    DataService.setDay(date, values);
    onUpdate();
  };
  return (
    <Fragment>
      <Pixel
        className={classes}
        onClick={!isFiller && !isFuture ? () => setShowDetails(true) : undefined}
      >
        {data.note && !isFiller && <span className="note-indicator"></span>}
        {!date.getMonth() && !(date.getDate() % 5) && !isFiller
          && <span className="label">{date.getDate()}</span>
        }
        {date.getDate() === 1 && !(date.getMonth() % 2) && !isFiller
          && <span className="label">{date.toLocaleString('en-US', { month: 'short' })}</span>
        }
      </Pixel>
      {showDetails && ( 
        <DayDetails date={date} values={data} onClose={handleDetailsClose} />
      )}
    </Fragment>
  );
};
export default memo(Day);
