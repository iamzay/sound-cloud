import * as types from '../constants/actionTypes.js';

const initialState = {
  playlists: {},
  songs: {},
  users: {}
};

function entities(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_SONGS:
      return {
        ...state,
        songs: { ...state.songs, ...action.entities.songs },
        users: { ...state.users, ...action.entities.users }
      };
    default:
      return state;
  }
}

export default entities;
