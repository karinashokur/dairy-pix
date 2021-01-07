import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { DayModel } from '../Day';
interface DayDetailsProps {
  date: Date;
  onClose: (values?: DayModel) => void;
}
export const DayDetails: React.FC<DayDetailsProps> = ({ date, onClose }) => {
  const dateString = {
    locale: 'en-US',
    options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };
  const [values, setValues] = useState<DayModel>({});
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value === 1,
    }));
  };
  return (
    <Dialog open onClose={() => onClose()}>
      <DialogTitle id="form-dialog-title">
        {date.toLocaleDateString(dateString.locale, dateString.options)}
      </DialogTitle>
      <DialogContent>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="isColored">Colored</InputLabel>
          <Select
            value={values.isColored || ''}
            input={<FilledInput name="isColored" id="isColored" />}
            onChange={handleChange}
          >
            <MenuItem value={1}>true</MenuItem>
            <MenuItem value={0}>false</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(values)} color="primary">Apply</Button>
        <Button onClick={() => onClose()} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default DayDetails;
