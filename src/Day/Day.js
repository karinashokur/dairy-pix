import React, { Component } from 'react';
import './Day.css';
import classNames from 'classnames';
class Day extends Component {
  render() {
    const classes = classNames({
      'day': true,
      'filler': this.props.filler,
      'colored': this.props.data.color
    });
    return <div className={classes} onClick={!this.props.filler ? this.props.onClick : null}></div>;
  }
}
export default Day;
