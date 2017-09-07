import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleIsPlaying, playSong } from '../actions/playerActions.js';

class TogglePlayButton extends Component {
  constructor(...props) {
    super(...props);
    this.togglePlaying = this.togglePlaying.bind(this);
  }

  togglePlaying(e) {
    const {
      playlist,
      dispatch,
      player: { isPlaying },
      isActive,
      index
    } = this.props;
    e.preventDefault();
    /* 若歌曲已被选中，则只需更改其播放状态 */
    if (isActive) {
      dispatch(toggleIsPlaying(!isPlaying));
      const audio = document.getElementById('audio');
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    } else {
      /* 否则需要选中该歌曲并播放 */
      dispatch(playSong(playlist, index));
    }
  }

  render() {
    const { isActive, player: { isPlaying } } = this.props;

    return (
      <div
        className={
          'play-button-container' +
          (isActive ? ' active' : '') +
          (isPlaying ? ' playing' : '')
        }
        onClick={this.togglePlaying}
      >
        <i className="icon ion-ios-play toggle-play-button-icon" />
        <i className="icon ion-radio-waves toggle-play-button-icon" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    player: state.player
  };
};

export default connect(mapStateToProps)(TogglePlayButton);
