import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { BarChart, CloudOff, ZoomIn } from '@material-ui/icons';
import React, { Component } from 'react';
import StorageHandler from '../Storage/StorageHandler';
import Year, { YearModel } from '../Year/Year';
import './App.css';
type AppProps = {
  name: string;
}
export default class App extends Component<AppProps> {
  storage: StorageHandler;
  state: Readonly<{preferences: any; years: {[key: number]: YearModel}}> 
  constructor(props: AppProps) {
    super(props);
    this.storage = new StorageHandler();
    this.state = {
      preferences: {},
      years: {
        2019: { 
          0: {
            0: {isColored: true},
            30: {isColored: true},
          },
          1: {
            1: {isColored: true},
            29: {isColored: true}, 
          },
          3: {
            13: {isColored: true},
            17: {isColored: true},
          },
          4: {
            14: {isColored: true},
            16: {isColored: true},
          },
          5: {
            15: {isColored: true},
          },
          6: {
            14: {isColored: true},
            16: {isColored: true},
          },
          7: {
            13: {isColored: true},
            17: {isColored: true},
          },
          10: {
            1: {isColored: true},
            29: {isColored: true},
          },
          11: {
            0: {isColored: true},
            30: {isColored: true},
          },
        }
      },
    }
  }
  componentDidMount() {
    this.loadPreferences();
    this.loadYear(new Date().getFullYear());
  }
  render() {
    const year = new Date().getFullYear();
    const months = this.state.years[year] ? this.state.years[year] : {};
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
          year={year}  months={months}
          onClickDay={(month, day) => this.handleClickDay(year, month, day)}
        />
      </div>
    );
  }
  handleClickDay(year: number, month: number, day: number): void {
    const newYears = { ...this.state.years };
    if(!newYears[year]) { newYears[year] = {}; }
    if(!newYears[year][month]) { newYears[year][month] = {}; }
    newYears[year][month][day] = {isColored: true};
    this.setState({years: newYears}, () => {
      this.saveYear(year);
    });
  }
  saveYear(year: number): void {
    if(this.state.years[year]) {
      this.storage.save(year.toString(), JSON.stringify(this.state.years[year]));
    }
  }
  loadYear(year: number): void {
    const updatedYears = { ...this.state.years };
    const data = this.storage.load(year.toString());
    if(data) {
      updatedYears[year] = JSON.parse(data); 
      this.setState({years: updatedYears});
    }
  }
  savePreferences(): void {
    this.storage.save('preferences', JSON.stringify(this.state.preferences));
  }
  loadPreferences(): void {
    const data = this.storage.load('preferences');
    if(data) {
      this.setState({preferences: JSON.parse(data)}); 
    }
  }
}
