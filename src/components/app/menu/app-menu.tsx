import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, Lock, MoreVert, Security } from '@material-ui/icons';
import React, { createElement, useState } from 'react';
import CryptoService from '../../../services/crypto-service';
import StorageHandler from '../../../storage/storage-handler';
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
  isLocked: boolean;
  setDisplayYear: (year: number) => void;
  setEncrypting: (isEncrypting: boolean) => void;
}
const AppMenu: React.FC<AppMenuProps> = (
  { repository, displayYear, isLocked, setDisplayYear, setEncrypting },
) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [passwordInput, setPasswordInput] = useState<boolean>(false);
  const enableEncryption = async (password?: string): Promise<void> => {
    setPasswordInput(false);
    if (!password) return;
    const checkCipher = CryptoService.init(password);
    if (checkCipher) StorageHandler.save('encryption', checkCipher);
    setEncrypting(true);
    await StorageHandler.rewriteAll();
    setEncrypting(false);
  };
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
          <IconButton
            color="inherit"
            disabled={isLocked}
            onClick={() => setDisplayYear(displayYear - 1)}
          >
            <ArrowBackIosFixed />
          </IconButton>
          <span>{displayYear}</span>
          <IconButton
            color="inherit"
            disabled={displayYear >= new Date().getFullYear() || isLocked}
            onClick={() => setDisplayYear(displayYear + 1)}
          >
            <ArrowForwardIos />
          </IconButton>
        </li>
        {!CryptoService.isEnabled() && !isLocked && (
          <MenuItem onClick={() => { setAnchor(null); setPasswordInput(true); }}>
            <Lock />
            <span>Enable Encryption</span>
          </MenuItem>
        )}
        <MenuItem>
          <Security />
          <span>Privacy</span>
        </MenuItem>
        <MenuItem onClick={() => window.open(repository.url, '_blank')}>
          <div className="menu-icon"><img src={repository.logoSrc} alt="Tanuki" /></div>
          <span>{`View on ${repository.name}`}</span>
        </MenuItem>
      </Menu>
      {passwordInput && <PasswordInput onClose={enableEncryption} />}
    </div>
  );
};
export default AppMenu;
