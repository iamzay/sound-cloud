import * as types from '../constants/actionTypes.js';

const initialState = {
  currentSongIndex: null,
  currentTime: 0,
  isPlaying: false,
  selectedPlaylist: null
};

function player(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_CURRENT_TIME:
      return { ...state, currentTime: action.currentTime };
    case types.CHANGE_PLAYING_SONG:
      return { ...state, currentSongIndex: action.currentSongIndex };
    case types.TOGGLE_IS_PLAYING:
      return { ...state, isPlaying: action.isPlaying };
    case types.CHANGE_CURRENT_PLAYLIST:
      return { ...state, selectedPlaylist: action.selectedPlaylist };
    default:
      return state;
  }
}

export default player;
