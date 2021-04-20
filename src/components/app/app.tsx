import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { OptionsObject, withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useState } from 'react';
import DataService from '../../services/data-service';
import StorageHandler from '../../storage/storage-handler';
import { CloudTransferError, LocalStorageError } from '../../types/errors';
import Lockscreen from '../lockscreen/lockscreen';
import Year from '../year/year';
import './app.scss';
import AppMenu from './menu/app-menu';
import CloudMenu from './menu/cloud-menu';
interface AppProps {
  name: string;
  repository: {url: string, name: string, logoSrc: string};
}
const App: React.FC<AppProps & WithSnackbarProps> = (
  { name, repository, enqueueSnackbar, closeSnackbar },
) => {
  const [displayYear, setDisplayYear] = useState<number>(new Date().getFullYear());
  const [status, setStatus] = useState<{[key: string]: boolean | 'error'}>({
    loading: true, 
    saving: false, 
    transferring: false, 
    encrypting: false, 
  });
  const [locked, setLocked] = useState<string | false>(false);
  const infoSnackbarOpt: OptionsObject = {
    variant: 'info',
    persist: true,
    action: key => <Button onClick={() => { closeSnackbar(key); }}>Ok</Button>,
  };
  const updateStatus = (key: string, value: boolean | 'error'): void => {
    setStatus(oldStatus => ({ ...oldStatus, [key]: value }));
  };
  const saveYear = async (year: number): Promise<void> => {
    try {
      updateStatus('saving', true);
      await DataService.saveYear(year);
    } catch (e) {
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
      console.error(`Failed to load year '${year}':`, e);
      updateStatus('loading', 'error');
    }
  };
  const transferDataToCloud = async (): Promise<void> => {
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
  const checkForEncryption = async (): Promise<boolean> => {
    const checkCipher = await StorageHandler.load('encryption');
    if (!checkCipher) {
      setLocked(false);
      return false;
    }
    setLocked(checkCipher);
    updateStatus('loading', false);
    return true;
  };
  const init = async (): Promise<void> => {
    StorageHandler.init();
    StorageHandler.onForcedDisconnect = () => {
      DataService.clearCache();
      loadYear(displayYear);
      enqueueSnackbar('Your session has expired! Please reconnect your cloud', { variant: 'info' });
    };
    setDisplayYear(new Date().getFullYear());
    if (!(await checkForEncryption())) {
      await transferDataToCloud();
      await loadYear(displayYear);
    }
  };
  useEffect(() => { init(); }, []); 
  return (
    <div className="app">
      <AppBar className="appbar" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className="appbar-title">{name}</Typography>
          <CloudMenu saving={status.saving} onDisconnect={init} />
          <AppMenu
            repository={repository}
            displayYear={displayYear}
            isLocked={!!locked}
            setDisplayYear={loadYear}
            setEncrypting={s => { updateStatus('loading', s); updateStatus('encrypting', s); }}
          />
        </Toolbar>
      </AppBar>
      {!status.loading && !locked && (
        <Year key={displayYear} year={displayYear} onDayUpdated={year => saveYear(year)} />
      )}
      {status.loading === true && ( 
        <div className="placeholder">
          <CircularProgress color="secondary" size={100} />
          { status.transferring && <p>Transferring your diary to your cloud</p> }
          { status.encrypting && <p>Encrypting your diary</p> }
        </div>
      )}
      {status.loading === 'error' && ( 
        <div className="placeholder error">
          <Warning className="icon" />
          <p>Something went wrong while loading your diary!</p>
        </div>
      )}
      {locked && ( 
        <Lockscreen
          checkCipher={locked}
          onUnlock={() => { setLocked(false); loadYear(displayYear); }}
        />
      )}
    </div>
  );
};
export default withSnackbar(App);
