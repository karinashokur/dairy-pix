import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { IDay, Moods } from '../Day';
import './Details.scss';
const dateString = {
  locale: 'en-US',
  options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
};
interface DayDetailsProps {
  date: Date;
  values: IDay;
  onClose: (values?: IDay) => void;
}
const DayDetails: React.FC<DayDetailsProps> = ({ date, values, onClose }) => {
  if (!values.mood) { values = { ...values, mood: 0 }; } 
  const [inputData, setInputData] = useState<IDay>(values);
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
    let { name, value } = event.target; 
    if (!name) { return; }
    if (typeof inputData[name] === 'number') {
      value = parseInt(value, 10);
    } else {
      value = value ? value.substr(0, 140) : undefined;
    }
    setInputData(oldInputData => ({
      ...oldInputData,
      [name as string]: value,
    }));
  };
  const renderMoods: JSX.Element[] = [];
  for (const key in Moods) { 
    renderMoods.push(<MenuItem key={key} value={key}>{Moods[key].name}</MenuItem>);
  }
  const MoodPreview = styled.div`
    background-color: ${Moods[inputData.mood || 0].color};
  `;
  return (
    <Dialog open onClose={() => onClose()}>
      <DialogTitle>
        {date.toLocaleDateString(dateString.locale, dateString.options)}
      </DialogTitle>
      <DialogContent>
        <div className="mood">
          <MoodPreview></MoodPreview>
          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="mood-select">Mood</InputLabel>
            <Select
              value={inputData.mood || 0}
              input={<FilledInput name="mood" id="mood-select" />}
              onChange={handleChange}
            >
              {renderMoods}
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
          helperText={`${(inputData.note || '').length} / 140`}
          onChange={handleChange}
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
