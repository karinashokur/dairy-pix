import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, Lock, MoreVert, Security } from '@material-ui/icons';
import React, { createElement, useState } from 'react';
import PasswordInput from '../../password-input/password-input';
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
  onEncEnable: (password: string) => void;
}
const AppMenu: React.FC<AppMenuProps> = (
  { repository, displayYear, setDisplayYear, onEncEnable },
) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [passwordInput, setPasswordInput] = useState<boolean>(false);
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
        <MenuItem onClick={() => { setAnchor(null); setPasswordInput(true); }}>
          <Lock />
          <span>Enable Encryption</span>
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
      {passwordInput && (
        <PasswordInput onClose={password => {
          setPasswordInput(false);
          if (password) onEncEnable(password);
        }}
        />
      )}
    </div>
  );
};
export default AppMenu;
