import React, { Component } from 'react';
import { Link } from 'react-router';

import { getImageUrl } from '../utils/playlistUtils.js';
import { formatSongTitle } from '../utils/FormatUtils.js';
import { IMAGE_SIZES } from '../constants/songConstants.js';

class SongCard extends Component {
  constructor(...props) {
    super(...props);
    this.renderPlayButton = this.renderPlayButton.bind(this);
  }

  renderPlayButton() {
    const { isActive, isPlaying, togglePlaying } = this.props;

    return (
      <div
        className={
          'play-button-container' +
          (isActive ? ' active' : '') +
          (isPlaying ? ' playing' : '')
        }
        onClick={togglePlaying}
      >
        <i className="icon ion-ios-play toggle-play-button-icon" />
        <i className="icon ion-radio-waves toggle-play-button-icon" />
      </div>
    );
  }

  render() {
    const { user, song, isActive, isPlaying, togglePlay } = this.props;
    const imagUrl = getImageUrl(song.artwork_url);
    return (
      <div className={'song-card' + (isActive ? ' active' : '')}>
        <div
          className="song-card-image"
          style={{ backgroundImage: `url(${imagUrl})` }}
        >
          {this.renderPlayButton()}
        </div>
        <div className="song-card-user clearfix">
          <img
            alt="user avatar"
            className="song-card-user-image"
            src={getImageUrl(user.avatar_url)}
          />
          <div className="song-card-details">
            <Link className="song-card-title" to={`/songs/${song.id}`}>
              {formatSongTitle(song.title)}
            </Link>
            <Link
              className="song-card-user-username"
              to={`/users/${song.user_id}`}
            >
              {user.username}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SongCard;
