import React, { Component } from 'react';
import { IMAGE_SIZES } from '../constants/songConstants.js';
import { formatSeconds } from '../utils/FormatUtils.js';
import { getImageUrl } from '../utils/playlistUtils.js';

class Comment extends Component {
  constructor(...props) {
    super(...props);
  }

  render() {
    const { comment } = this.props;
    const { user } = comment;
    const imageUrl = getImageUrl(user.avatar_url, IMAGE_SIZES.LARGE);
    return (
      <div className="comment">
        <div
          className="comment-user-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="comment-details">
          <div className="comment-body">{comment.body}</div>
          <div className="comment-user-name">{user.username}</div>
        </div>
        <div className="comment-time">
          {formatSeconds(Math.floor(comment.timestamp / 1000))}
        </div>
      </div>
    );
  }
}

export default Comment;
