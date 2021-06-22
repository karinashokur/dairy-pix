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
    DataService.setDay(date, values);
    onUpdate();
  };
  return (
    <Fragment>
      <Pixel className={classes} onClick={!isFiller ? () => setShowDetails(true) : undefined}>
        {data.note && !isFiller && <span className="note-indicator"></span>}
      </Pixel>
      {showDetails && ( 
        <DayDetails date={date} values={data} onClose={handleDetailsClose} />
      )}
    </Fragment>
  );
};
export default memo(Day);
