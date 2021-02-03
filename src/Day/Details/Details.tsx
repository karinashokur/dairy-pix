import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import IDay from '../../types/day';
import Moods from '../../types/moods';
import './Details.scss';
const dateString = {
  locale: 'en-US',
  options: { weekday: 'long', month: 'long', day: 'numeric' },
};
const maxNoteLength = 140;
interface DayDetailsProps {
  date: Date;
  values: IDay;
  onClose: (values?: IDay) => void;
}
const DayDetails: React.FC<DayDetailsProps> = ({ date, values, onClose }) => {
  if (!values.mood) values = { ...values, mood: 0 }; 
  const [inputData, setInputData] = useState<IDay>(values);
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
    const { name } = event.target;
    if (!name) return;
    let { value } = event.target;
    if (typeof inputData[name] === 'number') { 
      value = parseInt(value, 10);
    } else {
      value = value ? value.substr(0, maxNoteLength) : undefined;
    }
    setInputData(oldInputData => ({
      ...oldInputData,
      [name as string]: value,
    }));
  };
  const MoodPreview = styled.div`
    background-color: ${Moods[inputData.mood || 0].color};
  `;
  return (
    <Dialog open onClose={() => onClose()}>
      <DialogTitle>{date.toLocaleDateString(dateString.locale, dateString.options)}</DialogTitle>
      <DialogContent>
        <div className="mood-selection">
          <MoodPreview />
          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="mood-select">Mood</InputLabel>
            <Select
              value={inputData.mood || 0}
              onChange={handleChange}
              input={<FilledInput name="mood" id="mood-select" />}
            >
              {
                Moods.map((x, i) => <MenuItem key={i} value={i}>{x.name}</MenuItem>)
              }
            </Select>
          </FormControl>
        </div>
        <TextField
          name="note"
          label="Note"
          multiline
          rows="4"
          fullWidth
          margin="normal"
          variant="filled"
          value={inputData.note || ''}
          onChange={handleChange}
          helperText={`${(inputData.note || '').length} / ${maxNoteLength}`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(inputData)} color="primary">Apply</Button>
        <Button onClick={() => onClose()} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default DayDetails;
