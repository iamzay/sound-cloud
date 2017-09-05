import React, { Component } from 'react';

import Toolbar from './Toolbar.js';
import Songs from './Songs.js';

import { getPlaylist } from '../utils/playlistUtils.js';

class SongsContainer extends Component {
  render() {
    const { location: { query } } = this.props;
    const playlist = getPlaylist(query);
    return (
      <div>
        <Toolbar q={query.q ? query.q : 'house'} t={query.t} />
        <Songs playlist={playlist} />
      </div>
    );
  }
}

export default SongsContainer;
