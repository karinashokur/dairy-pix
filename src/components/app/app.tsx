import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { withSnackbar, WithSnackbarProps, OptionsObject } from 'notistack';
import React, { useEffect, useState } from 'react';
import DataService from '../../services/data-service';
import StorageHandler from '../../storage/storage-handler';
import { CloudAuthenticationError, CloudTransferError, LocalStorageError } from '../../types/errors';
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
const App: React.FC<AppProps & WithSnackbarProps> = (
  { name, repository, enqueueSnackbar, closeSnackbar },
) => {
  const [displayYear, setDisplayYear] = useState<number>(new Date().getFullYear());
  const [status, setStatus] = useState<{[key: string]: boolean | 'error'}>({
    loading: true, 
    saving: false, 
    transferring: false, 
  });
  const now = new Date().getFullYear();
  const infoSnackbarOpt: OptionsObject = {
    variant: 'info',
    persist: true,
    action: key => <Button onClick={() => { closeSnackbar(key); }}>Ok</Button>,
  };
  const updateStatus = (key: string, value: boolean | 'error'): void => {
    setStatus(oldStatus => ({ ...oldStatus, [key]: value }));
  };
  const forceCloudDisconnect = () => {
    if (!StorageHandler.cloud) return;
    DataService.clearCache();
    StorageHandler.disconnectCloud();
    loadYear(displayYear); 
    enqueueSnackbar('Your session has expired! Please reconnect your cloud', { variant: 'info' });
  };
  const saveYear = async (year: number): Promise<void> => {
    try {
      updateStatus('saving', true);
      await DataService.saveYear(year);
    } catch (e) {
      if (e instanceof CloudAuthenticationError) { forceCloudDisconnect(); return; }
      if (e instanceof LocalStorageError) {
        enqueueSnackbar('Your browsers storage might be full. Consider connecting a cloud storage', infoSnackbarOpt);
      }
      console.error(`Failed to save year '${year}':`, e);
      enqueueSnackbar('Something went wrong while saving your diary!', { variant: 'error' });
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
  const transferDataToCloud = async () => {
    updateStatus('transferring', true);
    try {
      await StorageHandler.transferToCloud();
    } catch (e) {
      if (e instanceof CloudTransferError) {
        enqueueSnackbar('Your local data cloud not be transferred to your cloud, because it already contains diary data', infoSnackbarOpt);
      } else {
        console.error('Failed to transfer all diary data to the cloud storage:', e);
        enqueueSnackbar('Something went wrong while transferring your diary data!', { variant: 'error' });
      }
    }
    updateStatus('transferring', false);
  };
  useEffect(() => {
    StorageHandler.init();
    (async () => {
      transferDataToCloud();
      loadYear(displayYear);
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
