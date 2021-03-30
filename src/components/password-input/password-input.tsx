import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import React, { useState } from 'react';
import './password-input.scss';
interface PasswordInputProps {
  onClose: (password?: string) => void;
}
const PasswordInput: React.FC<PasswordInputProps> = ({ onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <Dialog open onClose={() => onClose()}>
      <DialogTitle className="dialog-title">
        <Lock />
        <span>Enable Encryption</span>
      </DialogTitle>
      <DialogContent className="content">
        <p className="warning">
          {'Make sure you do not forget your password! Because losing your password, means losing \
          your diary!'}
        </p>
        <div className="password">
          <TextField
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText error>
            {password && password.length < 8 ? 'Your password is too short' : ''}
          </FormHelperText>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={!password || password.length < 8}
          onClick={() => onClose(password)}
        >
          {'Enable'}
        </Button>
        <Button onClick={() => onClose()} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default PasswordInput;
