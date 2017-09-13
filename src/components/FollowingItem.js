import React, { Component } from 'react';

import { getImageUrl } from '../utils/playlistUtils.js';
import { getUserLocation } from '../utils/UserUtils.js';
import { addCommas } from '../utils/FormatUtils.js';

class FollowingItem extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="user-following-item">
        <img
          className="user-following-image"
          alt="user-image"
          src={getImageUrl(user.avatar_url)}
        />
        <div className="user-following-details">
          <span>{user.username}</span>
          <div>
            <i className="icon ion-location" />
            <span>{getUserLocation(user)}</span>
          </div>
        </div>
        <div className="user-following-followers">
          <span>{addCommas(user.followers_count)}</span>
          <span>Followers</span>
        </div>
      </div>
    );
  }
}

export default FollowingItem;
