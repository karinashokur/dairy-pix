import { CircularProgress, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { CloudDone, CloudOff, CloudQueue } from '@material-ui/icons';
import React, { useState } from 'react';
import StorageHandler from '../../../storage/storage-handler';
import SupportedClouds, { CloudsMeta } from '../../../types/supported-clouds';
import './menu.scss';
interface CloudMenuProps {
  saving: boolean | 'error';
}
const CloudMenu: React.FC<CloudMenuProps> = ({ saving }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const getMenuItem = (variant: SupportedClouds, off = false): JSX.Element => (
    <MenuItem disabled={off} key={variant} onClick={() => StorageHandler.connectCloud(variant)}>
      <div className="menu-icon">
        <img src={CloudsMeta[variant].logo} alt={CloudsMeta[variant].name} />
      </div>
      <span>{CloudsMeta[variant].name}</span>
    </MenuItem>
  );
  return (
    <React.Fragment>
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
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        keepMounted
      >
        {!StorageHandler.cloud && ( 
          <div>{Object.keys(CloudsMeta).map((i, variant) => getMenuItem(variant))}</div>
        )}
        {StorageHandler.cloud && ( 
          <div>
            {getMenuItem(StorageHandler.cloud.variant, true)}
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
