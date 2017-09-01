import * as types from '../constants/actionTypes.js';

const initialState = {
  currentSongIndex: null,
  currentTime: null,
  isPlaying: false,
  currentPlaylist: null
};

function player(state, action) {
  switch (action.type) {
    case types.CHANGE_CURRENT_TIME:
      return { ...state, currentTime: action.currentTime };
    case types.CHANGE_PLAYING_SONG:
      return { ...state, currentSongIndex: action.songIndex };
    case types.CHANGE_PLAYING_STATUS:
      return { ...state, isPlaying: action.isPlaying };
    case types.CHANGE_CURRENT_LIST:
      return { ...state, currentPlaylist: action.playlist };
    default:
      return state;
  }
}

export default player;
