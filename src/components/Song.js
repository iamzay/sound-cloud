import React, { Component } from 'react';
import { Link } from 'react-router';

import Waveform from '../components/Waveform.js';
import SongListItem from '../containers/SongListItem.js';
import TogglePlayButton from '../containers/TogglePlayButton.js';
import Comment from '../components/Comment.js';
import Spinner from '../components/Spinner.js';

import { fetchSongIfNeeded } from '../actions/playlistActions.js';
import { addCommas } from '../utils/FormatUtils.js';
import { getImageUrl } from '../utils/playlistUtils.js';
import { IMAGE_SIZES } from '../constants/songConstants.js';
import { playSong } from '../actions/playerActions.js';
import { SONG_PLAYLIST_SUFFIX } from '../constants/playlist.js';

class Song extends Component {
  constructor(...props) {
    super(...props);
  }

  componentDidMount() {
    const { songId, dispatch } = this.props;
    dispatch(fetchSongIfNeeded(songId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, songId } = this.props;
    if (songId !== nextProps.songId) {
      dispatch(fetchSongIfNeeded(nextProps.songId));
    }
  }

  renderSongs() {
    const { songId, songs, users, playlists, currentPlayingId } = this.props;
    const song = songs[songId];
    const playlist = song.title + SONG_PLAYLIST_SUFFIX;
    if (!playlists[playlist]) {
      return null;
    }

    const relatedSongs = playlists[playlist].items;
    const items = relatedSongs.slice(1).map((relatedSongId, index) => {
      const relatedSong = songs[relatedSongId];
      const user = users[relatedSong.user_id];
      return (
        <SongListItem
          song={relatedSong}
          user={user}
          playlist={playlist}
          key={relatedSong.id}
          index={index + 1}
          isActive={currentPlayingId === relatedSong.id}
        />
      );
    });

    return items;
  }

  renderComments() {
    const { songId, songs, playlists } = this.props;
    const song = songs[songId];
    const comments = song.comments;
    if (!comments) {
      return null;
    }

    const commentElems = comments
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((comment, i) => {
        return <Comment key={comment.id} comment={comment} />;
      });

    return (
      <div className="comment-container">
        <div className="comment-header">Comments</div>
        <div className="comment-list">{commentElems}</div>
      </div>
    );
  }

  render() {
    const { songId, songs, users, player, dispatch, isActive } = this.props;
    const { currentTime } = player;
    const song = songs[songId];
    if (!song) {
      return <Spinner />;
    }

    const user = users[song.user_id];
    const playlist = song.title + SONG_PLAYLIST_SUFFIX;

    const image = getImageUrl(song.artwork_url, IMAGE_SIZES.LARGE);
    return (
      <div className="container">
        <div className="content">
          <div className="grid">
            <div className="col-7-10">
              <div
                className={'song card ' + (isActive ? 'active' : '')}
                style={{ marginBottom: '30px' }}
              >
                <div className="song-main">
                  <div
                    className="song__image"
                    style={{ backgroundImage: `url(${image})` }}
                  >
                    <TogglePlayButton
                      isActive={isActive}
                      index={0}
                      playlist={playlist}
                    />
                  </div>
                  <div className="song__info__wrap">
                    <div className="song__info">
                      <div className="song-title">{song.title}</div>
                      <div className="song-user">
                        <div
                          className="song-user-image"
                          style={{ backgroundImage: `url(${user.avatar_url})` }}
                        />
                        <Link
                          className="song-username"
                          to={`/users/${song.user_id}`}
                        >
                          {user.username}
                        </Link>
                      </div>
                      <div className="song-stats">
                        <div className="song-stat">
                          <i className="icon ion-ios-heart" />
                          <span>{addCommas(song.favoritings_count)}</span>
                        </div>
                        <div className="song-stat">
                          <i className="icon ion-play" />
                          <span>{addCommas(song.playback_count)}</span>
                        </div>
                        <div className="song-stat">
                          <i className="icon ion-chatbubble" />
                          <span>{addCommas(song.comment_count)}</span>
                        </div>
                      </div>
                      <div className="song-description">{song.description}</div>
                    </div>
                  </div>
                  <div className="song-waveform">
                    <Waveform
                      waveformUrl={song.waveform_url.replace('https', 'http')}
                      currentTime={currentTime}
                      duration={song.duration}
                      dispatch={dispatch}
                      isActive={isActive}
                      playSong={() => dispatch(playSong(playlist, 0))}
                    />
                  </div>
                </div>
              </div>
              {this.renderSongs()}
            </div>
          </div>
          <div className="col-3-10">{this.renderComments()}</div>
        </div>
      </div>
    );
  }
}

export default Song;
