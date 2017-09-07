import React, { Component } from 'react';
import { connect } from 'react-redux';

import Player from '../components/Player.js';

import { getCurrentPlayingId } from '../utils/songUtils.js';

class PlayerContainer extends Component {
  render() {
    const { entities, player, playlists, dispatch } = this.props;
    const { songs, users } = entities;

    const songId = getCurrentPlayingId(player, playlists);

    if (songId === null) {
      return null;
    }

    const { selectedPlaylist: playlist } = player;
    const playlistLen = playlists[playlist].items.length;

    const song = songs[songId];
    const user = users[song.user_id];
    return (
      <Player
        song={song}
        user={user}
        player={player}
        total={playlistLen}
        dispatch={dispatch}
      />
    );
  }
}

const mapStateToProps = state => {
  const { player, playlists, entities } = state;

  return {
    player,
    playlists,
    entities
  };
};

export default connect(mapStateToProps)(PlayerContainer);
