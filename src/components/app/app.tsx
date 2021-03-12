import { AppBar, CircularProgress, Toolbar, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useState } from 'react';
import CloudAuthenticationError from '../../errors/cloudAuthenticationError';
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
  const [displayYear, setDisplayYear] = useState<number>(new Date().getFullYear());
  const [status, setStatus] = useState<{[key: string]: boolean | 'error'}>({
    loading: true, 
    saving: false, 
    transferring: false, 
  });
  const now = new Date().getFullYear();
  const updateStatus = (key: string, value: boolean | 'error'): void => {
    setStatus(oldStatus => ({ ...oldStatus, [key]: value }));
  };
  const forceCloudDisconnect = () => {
    if (!StorageHandler.cloud) return;
    DataService.clearCache();
    StorageHandler.disconnectCloud();
    loadYear(displayYear); 
    enqueueSnackbar('Your session timed out! Please reconnect your cloud', {
      variant: 'error',
      anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
    });
  };
  const saveYear = async (year: number): Promise<void> => {
    try {
      updateStatus('saving', true);
      await DataService.saveYear(year);
    } catch (e) {
      if (e instanceof CloudAuthenticationError) { forceCloudDisconnect(); return; }
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
      setDisplayYear(year);
      updateStatus('loading', false);
    } catch (e) {
      if (e instanceof CloudAuthenticationError) { forceCloudDisconnect(); return; }
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
        loadYear(displayYear);
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
          <CloudMenu saving={status.saving} onDisconnect={() => loadYear(now)} />
          <AppMenu repository={repository} displayYear={displayYear} setDisplayYear={loadYear} />
        </Toolbar>
      </AppBar>
      {!status.loading && (
        <Year key={displayYear} year={displayYear} onDayUpdated={year => saveYear(year)} />
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
