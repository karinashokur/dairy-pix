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
        0: { mood: '#026AAA' },
        30: { mood: '#8B5552' },
      },
      1: {
        1: { mood: '#69A93D' },
        29: { mood: '#2A1999' }, 
      },
      3: {
        13: { mood: '#8B5552' },
        17: { mood: '#1B7D5F' },
      },
      4: {
        14: { mood: '#1B7D5F' },
        16: { mood: '#C69570' },
      },
      5: {
        15: { mood: '#B63542' },
      },
      6: {
        14: { mood: '#78562A' },
        16: { mood: '#2A1999' },
      },
      7: {
        13: { mood: '#C69570' },
        17: { mood: '#B53FAC' },
      },
      10: {
        1: { mood: '#026AAA' },
        29: { mood: '#69A93D' },
      },
      11: {
        0: { mood: '#78562A' },
        30: { mood: '#B53FAC' },
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
