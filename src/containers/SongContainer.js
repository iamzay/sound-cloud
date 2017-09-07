import React, { Component } from 'react';
import { connect } from 'react-redux';

import Song from '../components/Song.js';

import { getCurrentPlayingId } from '../utils/songUtils.js';

class SongContainer extends Component {
  constructor(...props) {
    super(...props);
  }

  render() {
    const { id } = this.props.params;
    const songId = parseInt(id);
    const { player, playlists } = this.props;
    const currentPlayingId = getCurrentPlayingId(player, playlists);
    const isActive = currentPlayingId === songId;
    return (
      <Song
        songId={songId}
        {...this.props}
        isActive={isActive}
        currentPlayingId={currentPlayingId}
      />
    );
  }
}

const mapStateToProps = state => {
  const { entities: { songs, users }, playlists, player } = state;
  return {
    songs,
    users,
    playlists,
    player
  };
};

export default connect(mapStateToProps)(SongContainer);
