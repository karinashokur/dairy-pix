import { Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, Lock, MoreVert, NewReleases, Security } from '@material-ui/icons';
import React, { createElement, memo, useState } from 'react';
import { version } from '../../../../package.json';
import privacyInfo from '../../../privacy';
import CryptoService from '../../../services/crypto-service';
import StorageHandler from '../../../storage/storage-handler';
import PasswordInput from '../../password-input/password-input';
import './menu.scss';
const ArrowBackIosFixed = () => createElement(ArrowBackIos, { style: { transform: 'translateX(5px)' } });
interface AppMenuProps {
  repository: {url: string, name: string, logoSrc: string};
  displayYear: number;
  disabled: boolean;
  setDisplayYear: (year: number) => void;
  setEncrypting: (isEncrypting: boolean) => void;
  setProgress: (value: number) => void;
  update?: () => void;
}
const AppMenu: React.FC<AppMenuProps> = (
  { repository, displayYear, disabled, setDisplayYear, setEncrypting, setProgress, update },
) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [passwordInput, setPasswordInput] = useState<boolean>(false);
  const [privacyDialog, setPrivacyDialog] = useState<boolean>(window.location.hash.includes('privacy'));
  const enableEncryption = async (password?: string): Promise<void> => {
    setPasswordInput(false);
    if (!password) return;
    const checkCipher = CryptoService.init(password);
    if (checkCipher) StorageHandler.save('encryption', checkCipher);
    setEncrypting(true);
    await StorageHandler.rewriteAll(setProgress); 
    setProgress(0);
    setEncrypting(false);
  };
  const closePrivacyDialog = () => {
    setPrivacyDialog(false);
    window.history.pushState(null, '', window.location.origin + window.location.pathname);
  };
  return (
    <div>
      <IconButton id="app-menu" color="inherit" onClick={event => setAnchor(event.currentTarget)}>
        <Badge invisible={!update} variant="dot" color="secondary">
          <MoreVert />
        </Badge>
      </IconButton>
      <Menu
        className="menu-popup"
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        keepMounted
      >
        <li className="year-selection">
          <IconButton
            id="app-menu-prev-year"
            color="inherit"
            disabled={disabled}
            onClick={() => setDisplayYear(displayYear - 1)}
          >
            <ArrowBackIosFixed />
          </IconButton>
          <span>{displayYear}</span>
          <IconButton
            id="app-menu-next-year"
            color="inherit"
            disabled={displayYear >= new Date().getFullYear() || disabled}
            onClick={() => setDisplayYear(displayYear + 1)}
          >
            <ArrowForwardIos />
          </IconButton>
        </li>
        {!CryptoService.isEnabled() && (
          <MenuItem
            disabled={disabled}
            onClick={() => { setAnchor(null); setPasswordInput(true); }}
          >
            <Lock />
            <span>Enable Encryption</span>
          </MenuItem>
        )}
        <MenuItem id="app-menu-privacy" onClick={() => { setAnchor(null); setPrivacyDialog(true); }}>
          <Security />
          <span>Privacy</span>
        </MenuItem>
        <MenuItem onClick={() => window.open(repository.url, '_blank')}>
          <div className="menu-icon"><img src={repository.logoSrc} alt="Tanuki" /></div>
          <span>
            {`Source on ${repository.name}`}
            <span className="sup">{`version ${version}`}</span>
          </span>
        </MenuItem>
        {update && (
          <MenuItem onClick={update}>
            <NewReleases />
            <span>
              {'Update Available'}
              <span className="sup">click to update now</span>
            </span>
          </MenuItem>
        )}
      </Menu>
      <Dialog open={privacyDialog} onClose={closePrivacyDialog}>
        <DialogTitle className="dialog-title">
          <Security />
          <span>Privacy</span>
        </DialogTitle>
        <DialogContent className="privacy-content">{privacyInfo}</DialogContent>
        <DialogActions>
          <Button onClick={closePrivacyDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      {passwordInput && <PasswordInput onClose={enableEncryption} />}
    </div>
  );
};
export default memo(AppMenu);
