import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { IDay, Moods } from '../Day';
import './Details.css';
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
    setInputData(oldInputData => ({
      ...oldInputData,
      [event.target.name as string]: parseInt(event.target.value, 10),
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
      <DialogTitle id="form-dialog-title">
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(inputData)} color="primary">Apply</Button>
        <Button onClick={() => onClose()} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default DayDetails;
