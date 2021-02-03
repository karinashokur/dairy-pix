import { AppBar, CircularProgress, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { CloudDone, CloudUpload, Warning } from '@material-ui/icons';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useState } from 'react';
import StorageHandler, { SupportedClouds } from '../Storage/StorageHandler';
import StorageHandlerYear from '../Storage/StorageHandlerYear';
import Year from '../Year/Year';
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
  const [status, setStatus] = useState<{[key: string]: boolean | 'error'}>({
    loading: true, 
    saving: false, 
    cloud: false, 
    transferring: false, 
  });
  const updateStatus = (key: string, value: boolean | 'error'): void => {
    setStatus(oldStatus => ({ ...oldStatus, [key]: value }));
  };
  const saveYear = async (year: number): Promise<void> => {
    try {
      updateStatus('saving', true);
      await StorageHandlerYear.saveYear(year);
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
      await StorageHandlerYear.loadYear(year);
      updateStatus('loading', false);
    } catch (e) {
      console.error(`Failed to load year '${year}':`, e);
      updateStatus('loading', 'error');
    }
  };
  useEffect(() => {
    StorageHandler.init();
    updateStatus('cloud', StorageHandler.cloud !== false);
    (async () => {
      updateStatus('transferring', true);
      await StorageHandler.transferToCloud();
      updateStatus('transferring', false);
      loadYear(now);
    })();
  }, []); 
  return (
    <div className="app">
      <AppBar className="appbar" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className="appbar-title">{name}</Typography>
          <div className="cloud-btn">
            {!status.cloud && ( 
              <Tooltip title="Save in Cloud">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    StorageHandler.connectCloud(SupportedClouds.Dropbox);
                    updateStatus('cloud', true);
                  }}
                >
                  <CloudUpload />
                </IconButton>
              </Tooltip>
            )}
            {status.cloud && !status.saving && ( 
              <Tooltip title="Disconnect Cloud">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    StorageHandler.disconnectCloud();
                    updateStatus('cloud', false);
                  }}
                >
                  <CloudDone />
                </IconButton>
              </Tooltip>
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
          onDayUpdated={() => saveYear(now)}
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
