import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { BarChart, CloudOff, ZoomIn } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { IDay, Moods } from '../Day/Day';
import DayDetails from '../Day/Details/Details';
import StorageHandler from '../Storage/StorageHandler';
import Year, { IYear } from '../Year/Year';
import './App.css';
const generateRandomData = () => {
  const data: IYear = {};
  if (localStorage.getItem('randomData')) { 
    for (let m = 0; m < 12; m++) {
      data[m] = {};
      for (let d = 1; d < 32; d++) {
        data[m][d] = { mood: Math.floor(Math.random() * Moods.length) };
      }
    }
  }
  return data;
};
interface AppProps {
  name: string;
}
const App: React.FC<AppProps> = ({ name }) => {
  const storage: StorageHandler = new StorageHandler();
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<{[key: number]: IYear}>({ 2019: generateRandomData() });
  const [details, setDetails] = useState<{date: Date, values: IDay}>();
  const saveYear = (year: number): void => {
    if (years[year]) {
      storage.save(year.toString(), JSON.stringify(years[year]));
    }
  };
  const loadYear = (year: number): void => {
    const updatedYears = { ...years };
    const data = storage.load(year.toString());
    if (data) {
      updatedYears[year] = JSON.parse(data); 
      setYears(updatedYears);
    }
  };
  const handleDayDetails = (values?: IDay): void => {
    if (!details) { return; }
    if (values) {
      const year = details.date.getFullYear();
      const month = details.date.getMonth();
      const day = details.date.getDate();
      const newYears = { ...years };
      if (!newYears[year]) { newYears[year] = {}; }
      if (!newYears[year][month]) { newYears[year][month] = {}; }
      newYears[year][month][day] = values;
      setYears(newYears);
      saveYear(year);
    }
    setDetails(undefined);
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
        months={years[currentYear] ? years[currentYear] : {}}
        onClickDay={(year, month, day) => setDetails({
          date: new Date(year, month, day),
          values: years[year][month] && years[year][month][day] ? years[year][month][day] : {},
        })}
      />
      {details
        && <DayDetails date={details.date} values={details.values} onClose={handleDayDetails} />
      }
    </div>
  );
};
export default App;
