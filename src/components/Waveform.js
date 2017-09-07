import React, { Component } from 'react';

import { offsetLeft } from '../utils/MouseUtils.js';
import { changeCurrentTime } from '../actions/playerActions.js';

class Waveform extends Component {
  constructor(...props) {
    super(...props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.state = { seekPercent: 0 };
  }

  renderWaveform() {
    const { currentTime, duration, isActive } = this.props;
    const width = isActive ? currentTime / (duration / 1000) * 100 : 0;

    return (
      <div
        className="waveform-image-container"
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
      >
        {this.renderImage()}
        <div className="waveform-image-bg" style={{ width: `${width}%` }} />
        {this.renderClickable()}
      </div>
    );
  }

  renderImage() {
    const { waveformUrl } = this.props;

    return (
      <img alt="song-waveform" src={waveformUrl} className="waveform-image" />
    );
  }

  renderClickable() {
    const { isActive, playSong } = this.props;
    const { seekPercent } = this.state;
    const width = seekPercent * 100;

    if (!isActive) {
      return (
        <div>
          <div className="waveform-play-highlight" />
          <div className="waveform-play-highlight-icon" onClick={playSong}>
            <i className="icon ion-ios-play" />
          </div>
        </div>
      );
    }

    if (width === 0) {
      return null;
    }

    return (
      <div>
        <div className="waveform-seek-line" style={{ width: `${width}%` }} />
        <div className="waveform-seek-bar" style={{ width: `${width}%` }} />
      </div>
    );
  }

  handleMouseDown(e) {
    const { isActive, duration, dispatch } = this.props;
    if (!isActive) {
      return;
    }

    const audioElem = document.querySelector('#audio');
    const time = Math.floor(this.state.seekPercent * (duration / 1000));
    dispatch(changeCurrentTime(time));
    audioElem.currentTime = time;
  }

  handleMouseMove(e) {
    const { isActive } = this.props;
    if (!isActive) {
      return;
    }

    const dist = e.clientX - offsetLeft(e.currentTarget);
    const seekPercent = dist / e.currentTarget.offsetWidth;
    this.setState({ seekPercent });
  }

  handleMouseLeave() {
    this.setState({ seekPercent: 0 });
  }

  render() {
    const {
      isActive,
      currentTime,
      duration,
      dispatch,
      waveformUrl
    } = this.props;
    return (
      <div className="waveform">
        <canvas className="waveform-canvas" />
        {this.renderWaveform()}
      </div>
    );
  }
}

export default Waveform;
