import { AppBar, CircularProgress, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { CloudDone, CloudUpload } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { IDay } from '../Day/Day';
import DayDetails from '../Day/Details/Details';
import generateRandomData from '../helper';
import StorageHandler, { SupportedClouds } from '../Storage/StorageHandler';
import Year, { IYear } from '../Year/Year';
import './App.scss';
import AppMenu from './AppMenu/AppMenu';
interface AppProps {
  name: string;
  repository: {
    url: string,
    name: string,
    logoSrc: string,
  };
}
const App: React.FC<AppProps> = ({ name, repository }) => {
  const now = new Date().getFullYear();
  const [years, setYears] = useState<{[key: number]: IYear}>({ [now]: generateRandomData() });
  const [details, setDetails] = useState<{date: Date, values: IDay}>();
  const [status, setStatus] = useState<{[key: string]: boolean}>({
    loading: false, 
    saving: false, 
  });
  const saveYear = async (year: number): Promise<void> => {
    if (!years[year]) return;
    try {
      setStatus(oldStatus => ({ ...oldStatus, saving: true }));
      await StorageHandler.save(year.toString(), JSON.stringify(years[year]));
    } catch (e) {
      console.error(`Failed to save year '${year}':`, e); 
    }
    setStatus(oldStatus => ({ ...oldStatus, saving: false }));
  };
  const loadYear = async (year: number): Promise<void> => {
    const updatedYears = { ...years };
    try {
      setStatus(oldStatus => ({ ...oldStatus, loading: true }));
      const data = await StorageHandler.load(year.toString());
      if (data) {
        updatedYears[year] = JSON.parse(data);
        setYears(updatedYears);
      }
    } catch (e) {
      console.error(`Failed to load year '${year}':`, e); 
    }
    setStatus(oldStatus => ({ ...oldStatus, loading: false }));
  };
  const handleDayDetailsClose = (values?: IDay): void => {
    if (!details) return;
    if (values) {
      const year = details.date.getFullYear();
      const month = details.date.getMonth();
      const day = details.date.getDate();
      const newYears = { ...years };
      if (!newYears[year]) newYears[year] = {};
      if (!newYears[year][month]) newYears[year][month] = {};
      newYears[year][month][day] = values;
      setYears(newYears);
      saveYear(year);
    }
    setDetails(undefined);
  };
  useEffect(() => {
    loadYear(now);
  }, []); 
  return (
    <div className="app">
      <AppBar className="appbar" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className="appbar-title">{name}</Typography>
          {!StorageHandler.cloud && ( 
            <Tooltip title="Save in Cloud">
              <IconButton
                color="inherit"
                onClick={() => StorageHandler.connectCloud(SupportedClouds.Dropbox)}
              >
                <CloudUpload />
              </IconButton>
            </Tooltip>
          )}
          {StorageHandler.cloud && !status.saving && ( 
            <IconButton color="inherit"><CloudDone /></IconButton>
          )}
          {status.saving && ( 
            <CircularProgress className="cloud-saving" color="secondary" size={24} />
          )}
          <AppMenu repository={repository} />
        </Toolbar>
      </AppBar>
      {status.loading && ( 
        <div className="app-loading"><CircularProgress color="secondary" size={100} /></div>
      )}
      {!status.loading && (
        <Year
          key={now}
          year={now}
          months={years[now] ? years[now] : {}}
          onClickDay={(year, month, day) => setDetails({
            date: new Date(year, month, day),
            values: years[year][month] && years[year][month][day] ? years[year][month][day] : {},
          })}
        />
      )}
      {details && ( 
        <DayDetails date={details.date} values={details.values} onClose={handleDayDetailsClose} />
      )}
    </div>
  );
};
export default App;
