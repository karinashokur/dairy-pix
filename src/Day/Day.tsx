import classNames from 'classnames';
import React, { Component } from 'react';
import './Day.css';
export type DayModel = {
  isColored?: boolean
}
type DayProps = {
  data: DayModel;
  isFiller: boolean;
  onClick: () => void;
}
export default class Day extends Component<DayProps> {
  render() {
    const classes = classNames({
      'day': true,
      'filler': this.props.isFiller,
      'colored': this.props.data.isColored && !this.props.isFiller
    });
    return <div className={classes} onClick={!this.props.isFiller ? this.props.onClick : undefined}></div>;
  }
}
