import { CircularProgress, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { CloudDone, CloudOff, CloudQueue } from '@material-ui/icons';
import React, { Fragment, useState } from 'react';
import CryptoService from '../../../services/crypto-service';
import DataService from '../../../services/data-service';
import StorageHandler from '../../../storage/storage-handler';
import SupportedClouds, { CloudsMeta } from '../../../types/supported-clouds';
import './menu.scss';
interface CloudMenuProps {
  saving: boolean | 'error';
  onDisconnect?: () => void;
}
const CloudMenu: React.FC<CloudMenuProps> = ({ saving, onDisconnect }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const disconnect = (): void => {
    setAnchor(null);
    CryptoService.disable();
    DataService.clearCache();
    StorageHandler.disconnectCloud();
    if (onDisconnect instanceof Function) onDisconnect();
  };
  const getMenuItem = (variant: SupportedClouds, off = false): JSX.Element => (
    <MenuItem disabled={off} key={variant} onClick={() => StorageHandler.connectCloud(variant)}>
      <div className="menu-icon">
        <img src={CloudsMeta[variant].logo} alt={CloudsMeta[variant].name} />
      </div>
      <span>{CloudsMeta[variant].name}</span>
    </MenuItem>
  );
  return (
    <Fragment>
      <Tooltip title={!StorageHandler.cloud ? 'Connect Your Cloud' : ''}>
        <IconButton color="inherit" onClick={e => { if (!saving) setAnchor(e.currentTarget); }}>
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
        open={!!anchor}
        onClose={() => setAnchor(null)}
        keepMounted
      >
        {!StorageHandler.cloud && ( 
          <div>{Object.keys(CloudsMeta).map((i, variant) => getMenuItem(variant))}</div>
        )}
        {StorageHandler.cloud && ( 
          <div>
            {getMenuItem(StorageHandler.cloud.variant, true)}
            <MenuItem onClick={disconnect}>
              <CloudOff />
              <span>Disconnect</span>
            </MenuItem>
          </div>
        )}
      </Menu>
    </Fragment>
  );
};
export default CloudMenu;
