import React, { Component } from 'react';
import './App.css';
import Year from '../Year/Year';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, BarChart, CloudOff } from '@material-ui/icons';
class App extends Component {
  render() {
    let date = new Date();
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
        <Year key={date.getFullYear()} year={date.getFullYear()} month={date.getMonth()} day={date.getDate()} />
      </div>
    );
  }
}
export default App;
