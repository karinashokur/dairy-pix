import { FormHelperText, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { ArrowForward, Lock } from '@material-ui/icons';
import React, { useState } from 'react';
import CryptoService from '../../services/crypto-service';
import './lockscreen.scss';
interface LockscreenProps {
  checkCipher: string;
  onUnlock: () => void;
}
const Lockscreen: React.FC<LockscreenProps> = ({ checkCipher, onUnlock }) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const submit = (): void => {
    const init = CryptoService.init(password, checkCipher);
    if (init) { onUnlock(); return; }
    setError(true);
    setPassword('');
  };
  return (
    <div className="lockscreen placeholder">
      <Lock className="icon" />
      <div className="input-wrapper">
        <TextField
          id="lockscreen-input"
          className="input"
          type="password"
          label="Password"
          margin="normal"
          variant="filled"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={submit}>
                  <ArrowForward />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && <FormHelperText error>Incorrect password</FormHelperText>}
      </div>
    </div>
  );
};
export default Lockscreen;
