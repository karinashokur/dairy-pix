import { CircularProgress, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { CloudDone, CloudOff, CloudQueue } from '@material-ui/icons';
import React, { useState } from 'react';
import dropboxLogo from '../../../assets/dropbox.svg';
import googleDriveLogo from '../../../assets/google-drive.svg';
import onedriveLogo from '../../../assets/onedrive.svg';
import StorageHandler, { SupportedClouds } from '../../../storage/storage-handler';
import './menu.scss';
interface CloudMenuProps {
  saving: boolean | 'error';
}
const CloudMenu: React.FC<CloudMenuProps> = ({ saving }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const openMenu = (event: any) => {
    if (saving) return;
    setAnchor(event.currentTarget);
  };
  return (
    <React.Fragment>
      <Tooltip title={!StorageHandler.cloud ? 'Connect Your Cloud' : ''}>
        <IconButton color="inherit" onClick={event => openMenu(event)}>
          {!StorageHandler.cloud && ( 
            <CloudQueue />
          )}
          {StorageHandler.cloud && !saving && ( 
            <CloudDone />
          )}
          {StorageHandler.cloud && saving && ( 
            <CircularProgress color="secondary" size={24} />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        className="menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        keepMounted
      >
        {!StorageHandler.cloud && ( 
          <div>
            <MenuItem onClick={() => StorageHandler.connectCloud(SupportedClouds.Dropbox)}>
              <div className="menu-icon"><img src={dropboxLogo} alt="Dropbox" /></div>
              <span>Dropbox</span>
            </MenuItem>
            <MenuItem onClick={() => StorageHandler.connectCloud(SupportedClouds.OneDrive)}>
              <div className="menu-icon"><img src={onedriveLogo} alt="OneDrive" /></div>
              <span>OneDrive</span>
            </MenuItem>
            <MenuItem onClick={() => StorageHandler.connectCloud(SupportedClouds.GoogleDrive)}>
              <div className="menu-icon"><img src={googleDriveLogo} alt="Google Drive" /></div>
              <span>Google Drive</span>
            </MenuItem>
          </div>
        )}
        {StorageHandler.cloud && ( 
          <div>
            {}
            <MenuItem onClick={() => { setAnchor(null); StorageHandler.disconnectCloud(); }}>
              <CloudOff />
              <span>Disconnect</span>
            </MenuItem>
          </div>
        )}
      </Menu>
    </React.Fragment>
  );
};
export default CloudMenu;
