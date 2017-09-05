import * as types from '../constants/actionTypes.js';

export function playSong(playlist, index) {
  return (dispatch, getState) => {
    const {
      player: { currentSongIndex: current, selectedPlaylist, isPlaying }
    } = getState();
    if (selectedPlaylist !== playlist) {
      dispatch(changeCurrentPlaylist(playlist));
    }
    if (current !== index) {
      dispatch(changePlayingSong(index));
    }
    if (!isPlaying) {
      dispatch(toggleIsPlaying(true));
    }
  };
}

export function changePlayingSong(index) {
  return {
    type: types.CHANGE_PLAYING_SONG,
    currentSongIndex: index
  };
}

export function changeCurrentPlaylist(playlist) {
  return {
    type: types.CHANGE_CURRENT_PLAYLIST,
    selectedPlaylist: playlist
  };
}

export function changeCurrentTime(time) {
  return {
    type: types.CHANGE_CURRENT_TIME,
    currentTime: time
  };
}

export function toggleIsPlaying(isPlaying) {
  return {
    type: types.TOGGLE_IS_PLAYING,
    isPlaying
  };
}
