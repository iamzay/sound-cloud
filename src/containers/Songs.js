import React, { Component } from 'react';
import { connect } from 'react-redux';

import SongCard from '../components/SongCard.js';
import Spinner from '../components/Spinner.js';

import { getCurrentPlayingId } from '../utils/songUtils.js';
import { fetchSongsIfNeeded } from '../actions/playlistActions.js';
import { playSong, toggleIsPlaying } from '../actions/playerActions.js';

class Songs extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    const { playlist, playlists, dispatch } = this.props;
    if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
      dispatch(fetchSongsIfNeeded(playlist));
    }

    window.addEventListener('scroll', this.handleScroll);
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

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const { playlist, dispatch } = this.props;
    if (
      window.innerHeight + window.scrollY >
      document.body.offsetHeight - 200
    ) {
      dispatch(fetchSongsIfNeeded(playlist));
    }
  }

  togglePlaying(isActive, index, e) {
    const { playlist, dispatch, player: { isPlaying } } = this.props;
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

  renderSongs(items) {
    const { playlists, entities, player } = this.props;
    const { isPlaying } = player;
    const { songs, users } = entities;
    const currentPlayingId = getCurrentPlayingId(player, playlists);

    const chunk = 5;
    const songRows = [];
    for (let i = 0; i < items.length; i += chunk) {
      /* 渲染每行的5首歌 */
      const songRow = items.slice(i, i + chunk).map((songId, index) => {
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
      });

      console.log(i);
      /* 添加一行 */
      songRows.push(
        <div
          className="song-row"
          key={'song-row-' + (Math.floor(i / chunk) + 1)}
        >
          {songRow}
        </div>
      );
    }

    return songRows;
  }

  render() {
    const { playlist, playlists, entities, player } = this.props;
    const { isPlaying } = player;
    const { songs, users } = entities;
    const currentPlayingId = getCurrentPlayingId(player, playlists);
    const playlistInfo = playlists[playlist];
    const items = playlistInfo ? playlistInfo.items : [];
    const isFetching = !playlistInfo || playlistInfo.isFetching;

    return (
      <div className="container">
        <div className="songs-container">{this.renderSongs(items)}</div>
        {isFetching ? <Spinner /> : null}
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
