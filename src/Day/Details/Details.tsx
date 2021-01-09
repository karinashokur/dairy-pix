import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DayModel, Moods } from '../Day';
import './Details.css';
interface DayDetailsProps {
  date: Date;
  onClose: (values?: DayModel) => void;
}
const DayDetails: React.FC<DayDetailsProps> = ({ date, onClose }) => {
  const dateString = {
    locale: 'en-US',
    options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };
  const [values, setValues] = useState<DayModel>({});
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value,
    }));
  };
  const renderMoods: JSX.Element[] = [];
  for (const key in Moods) { 
    renderMoods.push(<MenuItem key={key} value={key}>{Moods[key].name}</MenuItem>);
  }
  const MoodPreview = styled.div`
    background-color: ${Moods[values.mood || 0].color};
  `;
  return (
    <Dialog open onClose={() => onClose()}>
      <DialogTitle id="form-dialog-title">
        {date.toLocaleDateString(dateString.locale, dateString.options)}
      </DialogTitle>
      <DialogContent>
        <div className="mood">
          <MoodPreview></MoodPreview>
          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="mood-select">Mood</InputLabel>
            <Select
              value={values.mood || 0}
              input={<FilledInput name="mood" id="mood-select" />}
              onChange={handleChange}
            >
              {renderMoods}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(values)} color="primary">Apply</Button>
        <Button onClick={() => onClose()} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default DayDetails;
