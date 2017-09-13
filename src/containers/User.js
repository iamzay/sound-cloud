import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchUserIfNeeded } from '../actions/userActions.js';
import Spinner from '../components/Spinner.js';
import { addCommas, getSocialIcon } from '../utils/FormatUtils.js';
import { getImageUrl } from '../utils/playlistUtils.js';
import { IMAGE_SIZES } from '../constants/songConstants.js';
import { getUserLocation } from '../utils/UserUtils';
import { USER_PLAYLIST_SUFFIX } from '../constants/playlist.js';
import SongListItem from '../containers/SongListItem.js';
import FollowingItem from '../components/FollowingItem.js';
import { getCurrentPlayingId } from '../utils/songUtils.js';

class User extends Component {
  constructor(...props) {
    super(...props);
  }

  componentDidMount() {
    const { userId, users, dispatch } = this.props;
    if (!users[userId] || !users[userId].followings) {
      dispatch(fetchUserIfNeeded(userId));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userId, users, dispatch } = nextProps;
    if (userId !== this.props.userId) {
      if (!users[userId] || !users[userId].followings) {
        dispatch(fetchUserIfNeeded(userId));
      }
    }
  }

  renderSongs() {
    const { userId, users, songs, dispatch, playlists, player } = this.props;
    const user = users[userId];
    const playlist = user.username + USER_PLAYLIST_SUFFIX;
    const playlistInfo = playlists[playlist];
    if (!playlistInfo) {
      return null;
    }

    const currentPlayingId = getCurrentPlayingId(player, playlists);
    const songItems = playlistInfo.items.map((id, index) => {
      const song = songs[id];
      return (
        <SongListItem
          song={song}
          user={user}
          playlist={playlist}
          index={index}
          isActive={currentPlayingId === song.id}
          key={song.id}
        />
      );
    });

    return <div>{songItems}</div>;
  }

  renderFollowings() {
    const { userId, users } = this.props;
    const user = users[userId];
    if (!user.followings) {
      return null;
    }

    const followingItems = user.followings.map((user, index) => {
      return <FollowingItem user={user} key={user.id} />;
    });

    return (
      <div>
        <div className="user-following-header">
          {`Following ${user.followings_count} Users`}
        </div>
        <div className="user-following-list">{followingItems}</div>
      </div>
    );
  }

  render() {
    const { userId, users } = this.props;
    const user = users[userId];
    if (!user) {
      return <Spinner />;
    }

    const image = user.avatar_url
      ? getImageUrl(user.avatar_url, IMAGE_SIZES.LARGE)
      : null;
    return (
      <div className="container">
        <div className="content">
          <div className="grid">
            <div className="col-7-10">
              <div className="user card">
                <div
                  className="user-image"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="user-details">
                  <div className="user-username">{user.username}</div>
                  <div className="user-location">
                    <i className="icon ion-location" />
                    <span>{getUserLocation(user)}</span>
                  </div>
                  <div className="user-followers">
                    {addCommas(user.followers_count) + ' followers'}
                  </div>
                  <div
                    className="user-description"
                    dangerouslySetInnerHTML={{ __html: user.description }}
                  />
                </div>
              </div>
              <div className="user-songs">{this.renderSongs()}</div>
            </div>
            <div className="col-3-10">
              <div className="user-following">{this.renderFollowings()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { entities: { songs, users }, player, playlists } = state;
  return {
    songs,
    users,
    player,
    playlists
  };
};

export default connect(mapStateToProps)(User);
