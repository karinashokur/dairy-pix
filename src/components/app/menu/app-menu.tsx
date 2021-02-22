import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, BarChart, MoreVert, Security } from '@material-ui/icons';
import React, { createElement, useState } from 'react';
import './menu.scss';
const ArrowBackIosFixed = () => createElement(ArrowBackIos, { style: { transform: 'translateX(5px)' } });
interface AppMenuProps {
  repository: {
    url: string,
    name: string,
    logoSrc: string,
  };
  displayYear: number;
  setDisplayYear: (year: number) => void;
}
const AppMenu: React.FC<AppMenuProps> = ({ repository, displayYear, setDisplayYear }) => {
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
        <li className="year-selection">
          <IconButton color="inherit" onClick={() => setDisplayYear(displayYear - 1)}>
            <ArrowBackIosFixed />
          </IconButton>
          <span>{displayYear}</span>
          <IconButton
            color="inherit"
            disabled={displayYear >= new Date().getFullYear()}
            onClick={() => setDisplayYear(displayYear + 1)}
          >
            <ArrowForwardIos />
          </IconButton>
        </li>
        <MenuItem>
          <BarChart />
          <span>Statistics</span>
        </MenuItem>
        <MenuItem>
          <Security />
          <span>Privacy</span>
        </MenuItem>
        <MenuItem onClick={() => window.open(repository.url, '_blank')}>
          <div className="menu-icon"><img src={repository.logoSrc} alt="Tanuki" /></div>
          <span>{`View on ${repository.name}`}</span>
        </MenuItem>
      </Menu>
    </div>
  );
};
export default AppMenu;
