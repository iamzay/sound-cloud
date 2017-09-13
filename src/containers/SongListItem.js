import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Waveform from '../components/Waveform';
import TogglePlayButton from '../containers/TogglePlayButton.js';

import { IMAGE_SIZES } from '../constants/songConstants.js';
import { addCommas } from '../utils/FormatUtils.js';
import { getImageUrl } from '../utils/playlistUtils.js';
import { playSong } from '../actions/playerActions.js';

class SongListItem extends Component {
  constructor(...props) {
    super(...props);
  }

  render() {
    const {
      song,
      user,
      playlist,
      index,
      isActive,
      dispatch,
      player
    } = this.props;
    const image = getImageUrl(song.artwork_url, IMAGE_SIZES.LARGE);
    return (
      <div className={'songlist-item card' + (isActive ? ' active' : '')}>
        <div
          className="songlist-item-image"
          style={{ backgroundImage: `url(${image})` }}
        >
          <TogglePlayButton
            isActive={isActive}
            playlist={playlist}
            index={index}
          />
        </div>
        <div className="songlist-item-details">
          <div className="songlist-item-title">{song.title}</div>
          <div className="songlist-item-info">
            <div
              className="songlist-item-user-image"
              style={{
                backgroundImage: `url(${getImageUrl(user.avatar_url)})`
              }}
            />
            <div className="songlist-item-user-name">{user.username}</div>
            <div className="songlist-item-stats">
              <div className="songlist-item-stat">
                <i className="icon ion-ios-heart" />
                <span>{addCommas(song.favoritings_count)}</span>
              </div>
              <div className="songlist-item-stat">
                <i className="icon ion-play" />
                <span>{addCommas(song.playback_count)}</span>
              </div>
              <div className="songlist-item-stat">
                <i className="icon ion-chatbubble" />
                <span>{addCommas(song.comment_count)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="songlist-item-waveform">
          <Waveform
            waveformUrl={
              song.waveform_url ? (
                song.waveform_url.replace('https', 'http')
              ) : null
            }
            currentTime={player.currentTime}
            duration={song.duration}
            dispatch={dispatch}
            isActive={isActive}
            playSong={() => dispatch(playSong(playlist, index))}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    player: state.player
  };
};

export default connect(mapStateToProps)(SongListItem);
