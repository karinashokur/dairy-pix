import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { BarChart, CloudOff, ZoomIn } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { DayModel } from '../Day/Day';
import DayDetails from '../Day/Details/Details';
import StorageHandler from '../Storage/StorageHandler';
import { Year, YearModel } from '../Year/Year';
import './App.css';
interface AppProps {
  name: string;
}
const App: React.FC<AppProps> = ({ name }) => {
  const storage: StorageHandler = new StorageHandler();
  const currentYear = new Date().getFullYear();
  const [detailsDate, setDetailsDate] = useState<Date>();
  const [years, setYears] = useState<{[key: number]: YearModel}>({
    2019: { 
      0: {
        0: { isColored: true },
        30: { isColored: true },
      },
      1: {
        1: { isColored: true },
        29: { isColored: true }, 
      },
      3: {
        13: { isColored: true },
        17: { isColored: true },
      },
      4: {
        14: { isColored: true },
        16: { isColored: true },
      },
      5: {
        15: { isColored: true },
      },
      6: {
        14: { isColored: true },
        16: { isColored: true },
      },
      7: {
        13: { isColored: true },
        17: { isColored: true },
      },
      10: {
        1: { isColored: true },
        29: { isColored: true },
      },
      11: {
        0: { isColored: true },
        30: { isColored: true },
      },
    },
  });
  const months = years[currentYear] ? years[currentYear] : {};
  const saveYear = (year: number): void => {
    if (years[year]) {
      storage.save(year.toString(), JSON.stringify(years[year]));
    }
  };
  const handleDayDetails = (values?: DayModel): void => {
    if (!detailsDate) { return; }
    if (values) {
      const year = detailsDate.getFullYear();
      const month = detailsDate.getMonth();
      const day = detailsDate.getDate();
      const newYears = { ...years };
      if (!newYears[year]) { newYears[year] = {}; }
      if (!newYears[year][month]) { newYears[year][month] = {}; }
      newYears[year][month][day] = values;
      setYears(newYears);
      saveYear(year);
    }
    setDetailsDate(undefined);
  };
  const loadYear = (year: number): void => {
    const updatedYears = { ...years };
    const data = storage.load(year.toString());
    if (data) {
      updatedYears[year] = JSON.parse(data); 
      setYears(updatedYears);
    }
  };
  useEffect(() => {
    loadYear(new Date().getFullYear());
  }, []); 
  return (
    <div className="diary">
      <AppBar className="appbar" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" className="appbar-title">{name}</Typography>
          <Tooltip title="Zoom">
            <IconButton color="inherit"><ZoomIn /></IconButton>
          </Tooltip>
          <Tooltip title="Statistics">
            <IconButton color="inherit"><BarChart /></IconButton>
          </Tooltip>
          <Tooltip title="Cloud">
            <IconButton color="inherit"><CloudOff /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Year
        key={currentYear}
        year={currentYear}
        months={months}
        onClickDay={(year, month, day) => setDetailsDate(new Date(year, month, day))}
      />
      {detailsDate && <DayDetails date={detailsDate} onClose={handleDayDetails} />}
    </div>
  );
};
export default App;
