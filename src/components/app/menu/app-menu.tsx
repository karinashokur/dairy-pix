import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, Lock, MoreVert, Security } from '@material-ui/icons';
import React, { createElement, useState } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import privacyInfo from '../../../privacy';
import CryptoService from '../../../services/crypto-service';
import StorageHandler from '../../../storage/storage-handler';
import PasswordInput from '../../password-input/password-input';
import './menu.scss';
const ArrowBackIosFixed = () => createElement(ArrowBackIos, { style: { transform: 'translateX(5px)' } });
interface AppMenuProps extends RouteComponentProps {
  repository: {url: string, name: string, logoSrc: string};
  displayYear: number;
  isLocked: boolean;
  setDisplayYear: (year: number) => void;
  setEncrypting: (isEncrypting: boolean) => void;
}
const AppMenu: React.FC<AppMenuProps> = (
  { repository, displayYear, isLocked, setDisplayYear, setEncrypting, history },
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
        open={!!anchor}
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
        <MenuItem onClick={() => { setAnchor(null); history.push('/privacy'); }}>
          <Security />
          <span>Privacy</span>
        </MenuItem>
        <MenuItem onClick={() => window.open(repository.url, '_blank')}>
          <div className="menu-icon"><img src={repository.logoSrc} alt="Tanuki" /></div>
          <span>{`View on ${repository.name}`}</span>
        </MenuItem>
      </Menu>
      <Switch>
        <Route path="/privacy">
          <Dialog open onClose={() => history.push('/')}>
            <DialogTitle className="dialog-title">
              <Security />
              <span>Privacy</span>
            </DialogTitle>
            <DialogContent className="privacy-content">{privacyInfo}</DialogContent>
            <DialogActions>
              <Button onClick={() => history.push('/')} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        </Route>
      </Switch>
      {passwordInput && <PasswordInput onClose={enableEncryption} />}
    </div>
  );
};
export default withRouter(AppMenu);
