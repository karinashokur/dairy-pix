import React, { Component } from 'react';
import './App.css';
import Year from '../Year/Year';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, BarChart, CloudOff } from '@material-ui/icons';
import StorageHandler from '../Storage/StorageHandler';
class App extends Component {
  constructor(props) {
    super(props);
    this.storage = new StorageHandler();
    this.state = {
      preferences: {},
      years: {
        2018: { 
          0: {
            1: {color: true},
            5: {color: true},
            15: {color: true},
            16: {color: true}
          },
          1: {
            9: {color: true},
            10: {color: true},
            31: {color: true}
          },
          2: {
            12: {color: true},
            17: {color: true},
            22: {color: true},
            24: {color: true},
            30: {color: true}
          }
        }
      },
    }
  }
  componentDidMount() {
    this.loadPreferences();
    this.loadYear(new Date().getFullYear());
  }
  render() {
    const date = new Date();
    const year = date.getFullYear();
    const data = this.state.years[year] ? this.state.years[year] : {};
    return (
      <div className="diary">
        <AppBar className="appbar" position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" className="appbar-title">{this.props.name}</Typography>
            <Tooltip title="Zoom">
              <IconButton color="inherit"><ZoomIn /></IconButton>
            </Tooltip>
            <Tooltip title="Statistics">
              <IconButton color="inherit"><BarChart /></IconButton>
            </Tooltip>
            <Tooltip title="Cloud">
              <IconButton color="inherit"><CloudOff /></IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Year key={year}
          year={year} month={date.getMonth()} day={date.getDate()} data={data}
          onClickDay={(month, day) => this.handleClickDay(year, month, day)}
        />
      </div>
    );
  }
  handleClickDay(year, month, day) {
    const newYears = { ...this.state.years };
    if(!newYears[year]) { newYears[year] = {}; }
    if(!newYears[year][month]) { newYears[year][month] = {}; }
    newYears[year][month][day] = {color: true};
    this.setState({years: newYears}, () => {
      this.saveYear(year);
    });
  }
  saveYear(year) {
    if(this.state.years[year]) {
      this.storage.save(year, JSON.stringify(this.state.years[year]))
    }
  }
  loadYear(year) {
    const updatedYears = { ...this.state.years };
    const data = this.storage.load(year);
    if(data) {
      updatedYears[year] = JSON.parse(data); 
      this.setState({years: updatedYears});
    }
  }
  savePreferences() {
    this.storage.save('preferences', JSON.stringify(this.state.preferences));
  }
  loadPreferences() {
    const data = this.storage.load('preferences');
    if(data) {
      this.setState({preferences: JSON.parse(data)}); 
    }
  }
}
export default App;
