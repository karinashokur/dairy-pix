import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { BarChart, MoreVert, Security, ZoomIn } from '@material-ui/icons';
import React, { useState } from 'react';
import './AppMenu.scss';
interface AppMenuProps {
  repository: {
    url: string,
    name: string,
    logoSrc: string,
  };
}
const AppMenu: React.FC<AppMenuProps> = ({ repository }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <div>
      <IconButton color="inherit" onClick={event => setAnchor(event.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu
        className="menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        keepMounted
      >
        <MenuItem>
          <ZoomIn />
          <span>Zoom</span>
        </MenuItem>
        <MenuItem>
          <BarChart />
          <span>Statistics</span>
        </MenuItem>
        <MenuItem>
          <Security />
          <span>Privacy</span>
        </MenuItem>
        <MenuItem onClick={() => window.open(repository.url, '_blank')}>
          <div className="gitlab-icon"><img src={repository.logoSrc} alt="Tanuki" /></div>
          <span>{`View on ${repository.name}`}</span>
        </MenuItem>
      </Menu>
    </div>
  );
};
export default AppMenu;
