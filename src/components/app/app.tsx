import { AppBar, CircularProgress, Toolbar, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useState } from 'react';
import DataService from '../../services/data-service';
import StorageHandler from '../../storage/storage-handler';
import Year from '../year/year';
import './app.scss';
import AppMenu from './menu/app-menu';
import CloudMenu from './menu/cloud-menu';
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
  const [status, setStatus] = useState<{[key: string]: boolean | 'error'}>({
    loading: true, 
    saving: false, 
    transferring: false, 
  });
  const updateStatus = (key: string, value: boolean | 'error'): void => {
    setStatus(oldStatus => ({ ...oldStatus, [key]: value }));
  };
  const saveYear = async (year: number): Promise<void> => {
    try {
      updateStatus('saving', true);
      await DataService.saveYear(year);
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
    try {
      updateStatus('loading', true);
      await DataService.loadYear(year);
      updateStatus('loading', false);
    } catch (e) {
      console.error(`Failed to load year '${year}':`, e);
      updateStatus('loading', 'error');
    }
  };
  useEffect(() => {
    StorageHandler.init();
    (async () => {
      try {
        updateStatus('transferring', true);
        await StorageHandler.transferToCloud();
        updateStatus('transferring', false);
        loadYear(now);
      } catch (e) {
        console.error('Failed to transfer all diary data to the cloud storage:', e);
        updateStatus('loading', 'error'); 
      }
    })();
  }, []); 
  return (
    <div className="app">
      <AppBar className="appbar" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className="appbar-title">{name}</Typography>
          <CloudMenu saving={status.saving} />
          <AppMenu repository={repository} />
        </Toolbar>
      </AppBar>
      {!status.loading && (
        <Year
          key={now}
          year={now}
          onDayUpdated={year => saveYear(year)}
        />
      )}
      {status.loading === true && ( 
        <div className="placeholder">
          <CircularProgress color="secondary" size={100} />
          { status.transferring && <p>Transferring data to your cloud</p> }
        </div>
      )}
      {status.loading === 'error' && ( 
        <div className="placeholder error">
          <Warning />
          <p>Something went wrong while loading your diary!</p>
        </div>
      )}
    </div>
  );
};
export default withSnackbar(App);
