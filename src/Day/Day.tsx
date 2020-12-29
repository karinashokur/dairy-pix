import React, { Component } from 'react';
import './Day.css';
import classNames from 'classnames';
type DayProps = {
  filler: boolean;
  data: any; 
  onClick: () => void;
}
class Day extends Component<DayProps> {
  render() {
    const classes = classNames({
      'day': true,
      'filler': this.props.filler,
      'colored': this.props.data.color
    });
    return <div className={classes} onClick={!this.props.filler ? this.props.onClick : undefined}></div>;
  }
}
export default Day;
