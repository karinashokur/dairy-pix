import { AppBar, CircularProgress, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { CloudDone, CloudUpload, Warning } from '@material-ui/icons';
import { withSnackbar, WithSnackbarProps } from 'notistack';
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
const App: React.FC<AppProps & WithSnackbarProps> = ({ name, repository, enqueueSnackbar }) => {
  const now = new Date().getFullYear();
  const [years, setYears] = useState<{[key: number]: IYear}>({ [now]: generateRandomData() });
  const [details, setDetails] = useState<{date: Date, values: IDay}>();
  const [status, setStatus] = useState<{[key: string]: boolean | 'error'}>({
    loading: false, 
    saving: false, 
  });
  const updateStatus = (key: string, value: boolean | 'error'): void => {
    setStatus(oldStatus => ({ ...oldStatus, [key]: value }));
  };
  const saveYear = async (year: number): Promise<void> => {
    if (!years[year]) return;
    try {
      updateStatus('saving', true);
      await StorageHandler.save(year.toString(), JSON.stringify(years[year]));
    } catch (e) {
      console.error(`Failed to save year '${year}':`, e);
      enqueueSnackbar('Something went wrong while saving your diary!', {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    }
    updateStatus('saving', false);
  };
  const loadYear = async (year: number): Promise<void> => {
    const updatedYears = { ...years };
    try {
      updateStatus('loading', true);
      const data = await StorageHandler.load(year.toString());
      if (data) {
        updatedYears[year] = JSON.parse(data);
        setYears(updatedYears);
      }
      updateStatus('loading', false);
    } catch (e) {
      console.error(`Failed to load year '${year}':`, e);
      updateStatus('loading', 'error');
    }
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
          <div className="cloud-btn">
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
          </div>
          <AppMenu repository={repository} />
        </Toolbar>
      </AppBar>
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
      {status.loading === true && ( 
        <div className="placeholder"><CircularProgress color="secondary" size={100} /></div>
      )}
      {status.loading === 'error' && ( 
        <div className="placeholder">
          <Warning />
          <p>Something went wrong while loading your diary!</p>
        </div>
      )}
    </div>
  );
};
export default withSnackbar(App);
