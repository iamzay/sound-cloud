import React, { Component } from 'react';
import { connect } from 'react-redux';

import SongCard from '../components/SongCard.js';

import { getCurrentPlayingId } from '../utils/songUtils.js';
import { fetchSongsIfNeeded } from '../actions/playlistActions.js';
import { playSong, toggleIsPlaying } from '../actions/playerActions.js';

class Songs extends Component {
  componentDidMount() {
    const { playlist, playlists, dispatch } = this.props;
    if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
      dispatch(fetchSongsIfNeeded(playlist));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playlist, playlists, dispatch } = this.props;
    if (playlist !== nextProps.playlist) {
      if (
        !(nextProps.playlist in playlists) ||
        playlists[nextProps.playlist].items.length === 0
      ) {
        dispatch(fetchSongsIfNeeded(nextProps.playlist));
      }
    }
  }

  togglePlaying(isActive, index, e) {
    const { playlist, dispatch, player: { isPlaying } } = this.props;
    e.preventDefault();
    /* 若歌曲已被选中，则只需更改其播放状态 */
    if (isActive) {
      dispatch(toggleIsPlaying(!isPlaying));
    } else {
      /* 否则需要选中该歌曲并播放 */
      dispatch(playSong(playlist, index));
    }
  }

  render() {
    const { playlist, playlists, entities, player } = this.props;
    const { isPlaying } = player;
    const { songs, users } = entities;
    const currentPlayingId = getCurrentPlayingId(player, playlists);
    const playlistInfo = playlists[playlist];
    const items = playlistInfo ? playlistInfo.items : [];

    return (
      <div className="songs-container">
        {items.map((songId, index) => {
          const song = songs[songId];
          const user = users[song.user_id];
          const isActive = currentPlayingId === song.id;
          return (
            <SongCard
              isActive={isActive}
              isPlaying={isPlaying}
              togglePlaying={this.togglePlaying.bind(this, isActive, index)}
              song={song}
              user={user}
              key={index}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { playlists, entities, player } = state;

  return {
    playlists,
    entities,
    player
  };
};

export default connect(mapStateToProps)(Songs);
