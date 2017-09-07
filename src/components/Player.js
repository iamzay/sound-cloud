import React, { Component } from 'react';
import { Link } from 'react-router';

import {
  formatSeconds,
  formatStreamUrl,
  formatSongTitle
} from '../utils/FormatUtils.js';
import { getImageUrl } from '../utils/playlistUtils.js';
import { offsetLeft } from '../utils/MouseUtils.js';

import {
  toggleIsPlaying,
  playSong,
  changeCurrentTime
} from '../actions/playerActions.js';

class Player extends Component {
  constructor(...props) {
    super(...props);

    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleLoadStart = this.handleLoadStart.bind(this);
    this.handleEnded = this.handleEnded.bind(this);

    this.togglePlay = this.togglePlay.bind(this);
    this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
    this.handleSeekMouseMove = this.handleSeekMouseMove.bind(this);
    this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
    this.handleSeekClick = this.handleSeekClick.bind(this);
    this.changeSeekHandle = this.changeSeekHandle.bind(this);
    this.toggleRepeat = this.toggleRepeat.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);

    this.state = {
      shuffle: false,
      repeat: false,
      duration: 0,
      volume: 0.5,
      isSeeking: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    const audioElement = this.audio;
    audioElement.addEventListener('ended', this.handleEnded, false);
    audioElement.addEventListener(
      'loadedmetadata',
      this.handleLoadedMetadata,
      false
    );
    audioElement.addEventListener('loadstart', this.handleLoadStart, false);
    audioElement.addEventListener('timeupdate', this.handleTimeUpdate, false);
    audioElement.addEventListener(
      'volumechange',
      this.handleVolumeChange,
      false
    );
    audioElement.volume = this.state.volume;

    this.audio.play();
  }

  componentDidUpdate(nextProps) {
    const { player: { currentSongIndex } } = nextProps;
    const { player: { currentSongIndex: prevSongIndex } } = this.props;
    if (currentSongIndex !== prevSongIndex) {
      this.audio.play();
    }
  }

  handleLoadedMetadata() {
    const audioElement = this.audio;
    this.setState({
      duration: Math.floor(audioElement.duration)
    });
  }

  handleLoadStart() {
    const { dispatch } = this.props;
    dispatch(changeCurrentTime(0));
    this.setState({
      duration: 0
    });
  }

  handleEnded() {
    if (this.state.repeat) {
      this.audio.play();
    } else {
      this.changeSong('next');
    }
  }

  handleSeekMouseDown(e) {
    this.setState({ isSeeking: true });
    document.addEventListener('mouseup', this.handleSeekMouseUp);
    document.addEventListener('mousemove', this.handleSeekMouseMove);
  }

  handleSeekMouseMove(e) {
    this.changeSeekHandle(e);
  }

  handleSeekMouseUp() {
    this.setState({ isSeeking: false });
    document.removeEventListener('mouseup', this.handleSeekMouseUp);
    document.removeEventListener('mousemove', this.handleSeekMouseMove);
  }

  handleSeekClick(e) {
    this.changeSeekHandle(e);
  }

  changeSeekHandle(e) {
    /* 获得拉动的距离 */
    let dist = e.clientX - offsetLeft(this.seekBar);
    dist = dist >= 0 ? dist : 0;
    const width = this.seekBar.clientWidth;
    /* 计算出拉动距离所占的百分比 */
    let percent = dist / width;
    percent = percent > 1 ? 1 : percent;
    const time = Math.floor(this.state.duration * percent);
    const { dispatch } = this.props;
    dispatch(changeCurrentTime(time));
    this.audio.currentTime = time;
  }

  handleTimeUpdate(e) {
    if (this.isSeeking) {
      return;
    }

    const audio = e.currentTarget;
    const currentTime = Math.floor(audio.currentTime);
    const { player, dispatch } = this.props;
    if (player.currentTime === currentTime) {
      return;
    }
    dispatch(changeCurrentTime(currentTime));
  }

  togglePlay() {
    const { player: { isPlaying }, dispatch } = this.props;
    const audioElement = this.audio;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    dispatch(toggleIsPlaying(!isPlaying));
  }

  toggleRepeat() {
    this.setState({ repeat: !this.state.repeat });
  }

  toggleShuffle() {
    this.setState({ shuffle: !this.state.shuffle });
  }

  changeSong(type) {
    const { dispatch, player, total } = this.props;
    const { currentSongIndex: index, selectedPlaylist: playlist } = player;
    let nextId = 0;

    if (this.state.shuffle) {
      nextId = Math.floor(Math.random() * total);
    } else if (type === 'prev') {
      nextId = index - 1 >= 0 ? index - 1 : total - 1;
    } else {
      nextId = (index + 1) % total;
    }

    dispatch(playSong(playlist, nextId));
  }

  renderDurationBar(e) {
    const { player: { currentTime } } = this.props;
    const { duration } = this.state;
    const width = currentTime / duration * 100;

    return (
      <div className="player-seek-duration-bar" style={{ width: `${width}%` }}>
        <div
          className="player-seek-handle"
          onMouseDown={this.handleSeekMouseDown}
        />
      </div>
    );
  }

  render() {
    const { song, user, player, dispatch } = this.props;
    const { isPlaying, currentTime } = player;
    const { duration } = this.state;

    return (
      <div className="player">
        <audio
          id="audio"
          ref={node => (this.audio = node)}
          src={formatStreamUrl(song.stream_url)}
        />
        <div className="container">
          <div className="player-main">
            <div className="player-section player-info">
              <img
                className="player-image"
                alt="song artwork"
                src={getImageUrl(song.artwork_url)}
              />
              <div className="song-card-details">
                <Link to={`/songs/${song.id}`} className="song-card-title">
                  {formatSongTitle(song.title)}
                </Link>
                <Link
                  to={`/users/${song.user_id}`}
                  className="song-card-user-username"
                >
                  {user.username}
                </Link>
              </div>
            </div>
            <div className="player-section">
              <div
                className="player-button"
                onClick={this.changeSong.bind(this, 'prev')}
              >
                <i className="icon ion-ios-rewind" />
              </div>
              <div className="player-button" onClick={this.togglePlay}>
                <i
                  className={
                    'icon' + (isPlaying ? ' ion-ios-pause' : ' ion-ios-play')
                  }
                />
              </div>
              <div
                className="player-button"
                onClick={this.changeSong.bind(this, 'next')}
              >
                <i className="icon ion-ios-fastforward" />
              </div>
            </div>
            <div className="player-section player-seek">
              <div
                className="player-seek-bar-wrap"
                ref={node => (this.seekBar = node)}
              >
                <div className="player-seek-bar" onClick={this.handleSeekClick}>
                  {this.renderDurationBar()}
                </div>
              </div>
              <div className="player-time">
                <span>{formatSeconds(currentTime)}</span>
                <span className="player-time-divider">/</span>
                <span>{formatSeconds(duration)}</span>
              </div>
            </div>
            <div className="player-section">
              <div
                className={`player-button ${this.state.repeat
                  ? ' active'
                  : ''}`}
                onClick={this.toggleRepeat}
              >
                <i className="icon ion-loop" />
                <span className="player-button-tooltip">Repeat</span>
              </div>
              <div
                className={`player-button ${this.state.shuffle
                  ? ' active'
                  : ''}`}
                onClick={this.toggleShuffle}
              >
                <i className="icon ion-shuffle" />
                <span className="player-button-tooltip">Shuffle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
